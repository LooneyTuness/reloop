import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function SellItem() {
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  function handlePhotoSelect(e) {
    const files = Array.from(e.target.files);

    if (files.length + photos.length > 5) {
      setMessage("You can only upload up to 5 photos");
      return;
    }

    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024;

      if (!isImage) {
        setMessage("Only image files are allowed");
        return false;
      }

      if (!isValidSize) {
        setMessage("File size must be less than 5MB");
        return false;
      }

      return true;
    });

    const newPhotos = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
    }));

    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    setMessage("");
  }

  const removePhoto = (index) => {
    setPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos];
      URL.revokeObjectURL(updatedPhotos[index].preview);
      updatedPhotos.splice(index, 1);
      return updatedPhotos;
    });
  };

  const uploadPhotos = async () => {
    const uploadedUrls = [];

    for (const photo of photos) {
      if (photo.uploaded) {
        uploadedUrls.push(photo.url);
        continue;
      }

      const fileName = `${Date.now()}-${photo.file.name}`;
      const { data, error } = await supabase.storage
        .from("item-photos")
        .upload(fileName, photo.file);

      if (error) {
        console.error("Upload error:", error);
        throw new Error(`Failed to upload ${photo.file.name}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("item-photos")
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.price) {
      setMessage("Please fill in all fields");
      return;
    }
    if (photos.length === 0) {
      setMessage("Please add at least one photo");
      return;
    }

    setUploading(true);

    try {
      const photoUrls = await uploadPhotos();

      const { error } = await supabase
        .from("items")
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            photos: photoUrls,
            user_id: user.id,
            user_email: user.email,
          },
        ])
        .select();

      if (error) {
        throw new Error(`Database error: $ ${error.message}`);
      }

      setMessage(
        `Item "${formData.title}" listed successfully with ${photoUrls.length} photos!`
      );

      // Reset form
      setFormData({ title: "", category: "", price: "", description: "" });
      setPhotos([]);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Sell Your Item
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.user_metadata?.username || user?.email}! List
              your item for sale on Reloop
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Photos ({photos.length}/5)
              </label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="text-gray-400 mb-2 text-3xl">📸</div>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop images
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5MB each (max 5 photos)
                  </p>
                </label>
              </div>

              {/* Photo Previews */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Vintage Leather Jacket"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                <option value="clothing">Clothing</option>
                <option value="bags">Bags</option>
                <option value="shoes">Shoes</option>
                <option value="watches">Watches</option>
                <option value="home">Home</option>
                <option value="books">Books</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your item's condition, size, features..."
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading Photos..." : "List Item for Sale"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
