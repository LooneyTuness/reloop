"use client";

import { Mail, Phone, MapPin, Camera } from "lucide-react";
import Link from "next/link";

export default function Footer() {


  return (
    <footer className="bg-gradient-to-br from-gray-50 to-green-50/30 border-t border-green-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            {/* Trust Badges */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="bg-white rounded-2xl p-4 shadow-2xl">
                  <img 
                    src="/images/verified-ecommerce-badge.png" 
                    alt="Verified E-commerce" 
                    className="h-16 w-auto"
                  />
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-2xl">
                  <img 
                    src="/images/wbe-logo.webp" 
                    alt="WBE Logo" 
                    className="h-16 w-auto"
                  />
                </div>
              </div>
            </div>

            {/* Brand Name */}
            <Link href="/" className="flex items-center gap-4 mb-6 hover:scale-105 transition-all duration-300 group" onClick={() => console.log('Footer logo clicked, navigating to home')}>
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-4xl font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors duration-300">
                  vtoraraka.mk
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-tight">
                  Втора рака. Прв избор.
                </p>
              </div>
            </Link>


          </div>
</div>
        {/* Contact Information */}
        <div className="border-t border-blue-200 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Е-пошта
                </p>
                <p className="text-gray-900 font-bold text-lg">info@vtoraraka.mk</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Телефон
                </p>
                <p className="text-gray-900 font-bold text-lg">+389 75 251 009</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-4 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Локација
                </p>
                <p className="text-gray-900 font-bold text-lg">
                  Скопје, Македонија
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-green-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-lg font-semibold text-gray-700">
                Следете не:
              </span>
              <div className="flex">
                <a 
                  href="https://instagram.com/vtorarakamk" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Camera className="w-7 h-7 text-white" />
                </a>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </footer>
  );
}
