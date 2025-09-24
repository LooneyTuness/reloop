"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

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
  const { t } = useLanguage();

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

      setMessage(t("listingSuccess").replace("{title}", formData.title));

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
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-2xl mx-auto px-8">
        <div className="bg-white border border-gray-200 p-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light text-black mb-4">
              {t("listItemTitle")}
            </h1>
            <p className="text-gray-600 font-light">
              {t("welcomeBack")}, {user?.user_metadata?.username || user?.email}
              ! {t("listItemWelcome")}
            </p>

            {/* Progress Indicator */}
            <div className="mt-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-xs font-light transition-all duration-300 ${
                    photos.length > 0
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-12 h-px transition-all duration-300 ${
                    formData.title ? "bg-black" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 flex items-center justify-center text-xs font-light transition-all duration-300 ${
                    formData.title
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div
                  className={`w-12 h-px transition-all duration-300 ${
                    formData.category && formData.price
                      ? "bg-black"
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 flex items-center justify-center text-xs font-light transition-all duration-300 ${
                    formData.category && formData.price
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 max-w-xs mx-auto font-light">
                <span>{t("steps.photos")}</span>
                <span>{t("steps.details")}</span>
                <span>{t("steps.pricing")}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-light text-gray-600 mb-4">
                {t("uploadPhotos")} ({photos.length}/5)
              </label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-200 p-8 text-center hover:border-black transition-colors">
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
              <label className="block text-sm font-light text-gray-600 mb-3">
                {t("itemTitle")} {t("required")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder={t("itemTitlePlaceholder")}
                />
                {formData.title && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-600 mb-3">
                {t("category")} {t("required")}
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
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
              <label className="block text-sm font-light text-gray-600 mb-3">
                {t("price")} {t("required")}
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-light"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-600 mb-3">
                {t("description")}
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none resize-none transition-all font-light"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t("descriptionPlaceholder")}
              />
            </div>

            {message && (
              <div
                className={`p-4 text-sm font-light ${
                  message.includes("Thanks for listing")
                    ? "bg-gray-50 text-black border border-gray-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-black text-white py-4 px-6 transition-all duration-300 font-light hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? t("uploadingPhotos") : t("listItemButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
