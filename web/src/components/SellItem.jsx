"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function SellItem() {
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    size: "",
    price: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  function handlePhotoSelect(e) {
    const files = Array.from(e.target.files);

    if (files.length + photos.length > 5) {
      setMessage(t("maxPhotos"));
      return;
    }

    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024;

      if (!isImage) {
        setMessage(t("onlyImages"));
        return false;
      }

      if (!isValidSize) {
        setMessage(t("fileTooLarge"));
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
      setMessage(t("fillAllFields"));
      return;
    }
    if (photos.length === 0) {
      setMessage(t("addPhotos"));
      return;
    }

    setUploading(true);

    try {
      const photoUrls = await uploadPhotos();

      const { error } = await supabase
        .from("items")
        .insert([
          {
            name: formData.title,
            title: formData.title,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            size: formData.size || null,
            photos: photoUrls,
            user_id: user.id,
            user_email: user.email,
          },
        ])
        .select();

      if (error) {
        throw new Error(`Database error: $ ${error.message}`);
      }

      setMessage(t("listingSuccess").replace("{title}", formData.title));

      // Reset form
      setFormData({
        title: "",
        category: "",
        size: "",
        price: "",
        description: "",
      });
      setPhotos([]);

      // Navigate to home page after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("listItemTitle")}
            </h1>
            <p className="text-gray-600">
              {t("welcomeBack")}, {user?.user_metadata?.username || user?.email}
              !
            </p>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="flex items-center justify-center space-x-4 mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    photos.length > 0
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-16 h-1 rounded transition-all duration-300 ${
                    formData.title ? "bg-primary" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    formData.title
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div
                  className={`w-16 h-1 rounded transition-all duration-300 ${
                    formData.category && formData.price
                      ? "bg-primary"
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    formData.category && formData.price
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 max-w-sm mx-auto">
                <span>{t("steps.photos")}</span>
                <span>{t("steps.details")}</span>
                <span>{t("steps.pricing")}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("uploadPhotos")} ({photos.length}/5)
              </label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <p className="text-sm text-gray-600 font-light">
                    {t("clickToUpload")}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-light">
                    {t("maxPhotosInfo")}
                  </p>
                </label>
              </div>

              {/* Photo Previews */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 text-xs hover:bg-gray-900 transition-colors"
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
                {t("itemTitle")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={t("itemTitlePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("category")} <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">{t("selectCategory")}</option>
                <option value="clothing">{t("categoryClothing")}</option>
                <option value="bags">{t("categoryBags")}</option>
                <option value="shoes">{t("categoryShoes")}</option>
                <option value="watches">{t("categoryWatches")}</option>
                <option value="home">{t("categoryHome")}</option>
                <option value="books">{t("categoryBooks")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("sizeLabel")}
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              >
                <option value="">{t("selectSize")}</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="XXXL">XXXL</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                <option value="46">46</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("price")} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("description")}
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t("descriptionPlaceholder")}
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  message.includes("Thanks for listing") ||
                  message.includes("успешно")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? t("uploadingPhotos") : t("listItemButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
