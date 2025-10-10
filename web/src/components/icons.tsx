type LogoProps = {
  className?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
};

export function VtorarakaLogo({ 
  className = "", 
  alt = "vtoraraka", 
  size = 'md',
  showText = true 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7 sm:w-9 sm:h-9',
    lg: 'w-12 h-12 sm:w-16 sm:h-16',
    xl: 'w-16 h-16 sm:w-20 sm:h-20'
  };

  const textSizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  };

  const iconSizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm`}>
        <span className={`text-white font-bold ${iconSizeClasses[size]}`}>V</span>
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 tracking-tight ${textSizeClasses[size]}`}>
          vtoraraka
        </span>
      )}
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
