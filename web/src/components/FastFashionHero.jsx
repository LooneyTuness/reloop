"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function FastFashionHero() {
  const { t } = useLanguage();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        console.log("Video loaded successfully");
        setVideoLoaded(true);
      };

      const handleError = (e) => {
        console.error("Video failed to load:", e);
        setVideoError(true);
        setVideoLoaded(true); // Show content even if video fails
      };

      const handleCanPlay = () => {
        console.log("Video can play");
        setVideoLoaded(true);
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("error", handleError);

      // Force play attempt
      const playVideo = async () => {
        try {
          await video.play();
          console.log("Video playing successfully");
        } catch (error) {
          console.log("Video autoplay failed:", error);
          // Still show content even if autoplay fails
          setVideoLoaded(true);
        }
      };

      // Small delay to ensure video element is ready
      setTimeout(playVideo, 100);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("error", handleError);
      };
    }
  }, []);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden mobile-scrollbar-hide">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Fallback background image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: videoError
              ? "url('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')"
              : "none",
          }}
        ></div>

        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{ display: videoError ? "none" : "block" }}
        >
          <source src="/images/video.mp4" type="video/mp4" />
          {t("videoNotSupported")}
        </video>

        {/* Video overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Loading indicator */}
      {!videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-sm">{t("loadingVideo")}</p>
          </div>
        </div>
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white text-xs p-2 rounded">
          Video: {videoLoaded ? "Loaded" : "Loading"} | Error:{" "}
          {videoError ? "Yes" : "No"}
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-start sm:justify-center px-6 sm:px-8 lg:px-12 pt-32 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
        <div className="max-w-4xl text-left sm:text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8 lg:mb-10 animate-fade-in-up">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm sm:text-base font-medium text-white">
              {t("sustainableFashionMarketplace")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-title text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 sm:mb-10 lg:mb-12 text-white animate-fade-in-up delay-100">
            <span className="block text-white leading-tight">
              {t("shopSmarter")}
            </span>
            <span className="block leading-tight" style={{ color: "#80EF80" }}>
              {t("wasteLess")}
            </span>
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 mb-8 sm:mb-10 lg:mb-12 animate-fade-in-up delay-200 max-w-4xl">
            {t("buyAndSell")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-start sm:justify-center items-start sm:items-center animate-fade-in-up delay-400">
            <Link
              href="/catalog"
              className="group inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-white font-semibold rounded-lg border transition-all duration-300 text-base sm:text-lg w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              style={{
                backgroundColor: "#4ADE80",
                borderColor: "#4ADE80",
                color: "#ffffff",
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#22C55E";
                e.target.style.borderColor = "#22C55E";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#4ADE80";
                e.target.style.borderColor = "#4ADE80";
              }}
            >
              <span className="truncate">{t("startShopping")}</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
            </Link>
            <Link
              href="/seller-application"
              className="group inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 text-base sm:text-lg w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              style={{
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              <span className="truncate">{t("addYourStory")}</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
