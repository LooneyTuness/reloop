"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LaunchPage() {
  const router = useRouter();

  const handleDashboardAccess = () => {
    router.push('/seller-dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
        <h1 className="text-white text-lg sm:text-xl font-medium">vtoraraka.mk</h1>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Launching soon with glitch effect */}
        <div 
          className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 min-h-[40vh] sm:min-h-[50vh] lg:min-h-screen relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/albert-vincent-wu-DekwzONAHbg-unsplash.jpg')"
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/70"></div>
          
          <div className="glitch-container text-center lg:text-left relative z-10">
            <div className="glitch-text">
              <div className="glitch-word text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-tight">
                Launching
              </div>
              <div className="glitch-word text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-tight mt-1 sm:mt-2 lg:mt-4">
                soon
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Macedonian content */}
        <div className="flex-1 flex items-start lg:items-center justify-center p-6 sm:p-8 lg:p-12 min-h-[60vh] sm:min-h-[50vh] lg:min-h-screen">
          <div className="max-w-md w-full space-y-8 sm:space-y-10 lg:space-y-8">
            {/* Launch announcement */}
            <div className="space-y-4 sm:space-y-5">
              <p className="text-lg sm:text-xl leading-relaxed font-medium">
                Сè уште не е тука, но ќе ви откриеме една тајна.
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-gray-300">
                Доаѓа навистина, навистина наскоро. Затоа, почекајте и проверете повторно на 10ти ноември. Можеби ќе видите нешто што ќе ве воодушеви!
              </p>
            </div>

            {/* Call to action */}
            <div className="space-y-5 sm:space-y-6">
              <p className="text-lg sm:text-xl leading-relaxed font-medium">
              Сега е идеално време да ја изградите вашата продавница! Прикачете ги вашите најкул парчиња и бидете подготвени за старт!
              </p>
              
              {/* Dashboard access button with arrow */}
              <div className="flex items-center space-x-3 sm:space-x-4 pt-2">
                <div className="text-2xl sm:text-3xl text-green-400">→</div>
                <button
                  onClick={handleDashboardAccess}
                  className="bg-white text-black font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105 flex-1 sm:flex-none shadow-lg"
                >
                  Оди на Продавачкиот панел
                </button>
              </div>
            </div>

            {/* Social media */}
            <div className="space-y-4 sm:space-y-5 pt-4 sm:pt-6 border-t border-gray-800">
              <p className="text-base sm:text-lg leading-relaxed text-gray-300">
                Возбудени сте да стапите во контакт со нас?
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                Заследете не на <a href="https://instagram.com/vtorarakamk" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline font-medium">@vtorarakamk</a> на Инстаграм за новости и информации.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Glitch effect styles */}
      <style jsx>{`
        .glitch-container {
          position: relative;
        }
        
        .glitch-word {
          position: relative;
          color: white;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          word-break: break-word;
        }
        
        .glitch-word::before,
        .glitch-word::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-word::before {
          animation: glitch-1 0.5s infinite;
          color: #ff0000;
          z-index: -1;
        }
        
        .glitch-word::after {
          animation: glitch-2 0.5s infinite;
          color: #00ff00;
          z-index: -2;
        }
        
        @keyframes glitch-1 {
          0%, 14%, 15%, 49%, 50%, 99%, 100% {
            transform: translate(0);
          }
          15%, 49% {
            transform: translate(-2px, 2px);
          }
        }
        
        @keyframes glitch-2 {
          0%, 20%, 21%, 62%, 63%, 99%, 100% {
            transform: translate(0);
          }
          21%, 62% {
            transform: translate(2px, -2px);
          }
        }
        
        .glitch-word:hover::before {
          animation: glitch-1 0.1s infinite;
        }
        
        .glitch-word:hover::after {
          animation: glitch-2 0.1s infinite;
        }
      `}</style>
    </div>
  );
}