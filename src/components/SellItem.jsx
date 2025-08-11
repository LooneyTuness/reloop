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
        `Thanks for listing! "${formData.title}" is now part of the circular economy.`
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
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2 font-display">
              List an Item – Save Resources
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.user_metadata?.username || user?.email}! Give
              your clothes a second life and help reduce waste.
            </p>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    photos.length > 0
                      ? "bg-brand-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-12 h-0.5 transition-all duration-300 ${
                    formData.title ? "bg-brand-600" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    formData.title
                      ? "bg-brand-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div
                  className={`w-12 h-0.5 transition-all duration-300 ${
                    formData.category && formData.price
                      ? "bg-brand-600"
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    formData.category && formData.price
                      ? "bg-brand-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 max-w-xs mx-auto">
                <span>Photos</span>
                <span>Details</span>
                <span>Pricing</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Photos ({photos.length}/5)
              </label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-brand-300 rounded-xl p-6 text-center hover:border-brand-500 transition-colors">
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
              <div className="relative">
                <input
                  type="text"
                  required
                  className="input-field pr-10"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Vintage Leather Jacket"
                />
                {formData.title && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
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
                  message.includes("Thanks for listing")
                    ? "bg-brand-50 text-brand-700 border border-brand-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full brand-gradient text-white py-3 px-6 rounded-full transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading Photos..." : "List Item & Save CO₂"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
