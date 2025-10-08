@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  colors: {
    brand: {
      DEFAULT: "#00C853", // Swish vibrant green
      50: "#E8F8F0",
      100: "#C8F0D8",
      200: "#9FE4B8",
      300: "#6ED498",
      400: "#4ACA7C",
      500: "#00C853",
      600: "#00B248",
      700: "#009A3E",
      800: "#008234",
      900: "#005A25",
    },
    swish: {
      green: "#00C853",
      light: "#4CAF50",
      accent: "#8BC34A",
    },
  },
  boxShadow: {
    glass: "0 10px 30px rgba(0,0,0,0.08)",
    card: "0 8px 20px rgba(99, 102, 241, 0.08)",
    'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
  },
  keyframes: {
    float: {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-6px)" },
    },
    "fade-in": {
      "0%": { opacity: "0", transform: "translateY(8px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "fade-in-up": {
      "0%": { opacity: "0", transform: "translateY(20px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "slide-in": {
      "0%": { opacity: "0", transform: "translateX(-20px)" },
      "100%": { opacity: "1", transform: "translateX(0)" },
    },
    marquee: {
      "0%": { transform: "translateX(0)" },
      "100%": { transform: "translateX(-50%)" },
    },
    shimmer: {
      "0%": { transform: "translateX(-100%)" },
      "100%": { transform: "translateX(100%)" },
    },
    "pulse-slow": {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.5" },
    },
    wiggle: {
      "0%, 100%": { transform: "rotate(-3deg)" },
      "50%": { transform: "rotate(3deg)" },
    },
    "scale-in": {
      "0%": { transform: "scale(0.9)", opacity: "0" },
      "100%": { transform: "scale(1)", opacity: "1" },
    },
    "bounce-gentle": {
      "0%, 100%": { transform: "translateY(0)" },
      "50%": { transform: "translateY(-10px)" },
    },
    glow: {
      "0%": { boxShadow: "0 0 5px rgba(0, 200, 83, 0.2)" },
      "100%": { boxShadow: "0 0 20px rgba(0, 200, 83, 0.4)" },
    },
    "heart-beat": {
      "0%": { transform: "scale(1)" },
      "14%": { transform: "scale(1.3)" },
      "28%": { transform: "scale(1)" },
      "42%": { transform: "scale(1.3)" },
      "70%": { transform: "scale(1)" },
    },
    "fade-in-scale": {
      "0%": { opacity: "0", transform: "scale(0.95)" },
      "100%": { opacity: "1", transform: "scale(1)" },
    },
    "slide-up": {
      "0%": { opacity: "0", transform: "translateY(16px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    "rotate-slow": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  },
  animation: {
    float: "float 6s ease-in-out infinite",
    "fade-in": "fade-in .6s ease-out both",
    "fade-in-up": "fade-in-up 0.8s ease-out both",
    "slide-in": "slide-in 0.6s ease-out both",
    marquee: "marquee 20s linear infinite",
    shimmer: "shimmer 2s infinite",
    "pulse-slow": "pulse-slow 3s infinite",
    wiggle: "wiggle 1s ease-in-out infinite",
    "scale-in": "scale-in 0.5s ease-out both",
    "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
    glow: "glow 2s ease-in-out infinite alternate",
    "heart-beat": "heart-beat 1.5s ease-in-out infinite",
    "fade-in-scale": "fade-in-scale 0.5s ease-out both",
    "slide-up": "slide-up 0.6s ease-out both",
    "rotate-slow": "rotate-slow 8s linear infinite",
  },
  backdropBlur: {
    xs: "2px",
    '3xl': '64px',
  },
  borderRadius: {
    squircle: "24px",
  },
  spacing: {
    '18': '4.5rem',
    '88': '22rem',
    '128': '32rem',
  },
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.21 0.006 285.885);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.705 0.015 286.067);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.552 0.016 285.938);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.274 0.006 286.033);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.552 0.016 285.938);
}

@layer base {
  * {
    border-color: var(--border);
    outline-color: var(--ring);
    outline-offset: 2px;
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: 'Inter', var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #fafafa 0%, #f8fafc 50%, #f1f5f9 100%);
  }
  .container {
    @apply mx-auto px-4;
    max-width: 1450px;
  }

  .h1 {
    @apply text-3xl font-bold tracking-tighter;
  }
  @media (min-width: 640px) {
    .h1 {
      @apply text-4xl;
    }
  }
  @media (min-width: 768px) {
    .h1 {
      @apply text-5xl;
    }
  }
  @media (min-width: 1024px) {
    .h1 {
      @apply text-6xl;
    }
  }

  .h2 {
    @apply text-3xl font-bold tracking-tight;
  }
  @media (min-width: 640px) {
    .h2 {
      @apply text-4xl;
    }
  }
  @media (min-width: 768px) {
    .h2 {
      @apply text-5xl;
    }
  }

  .h3 {
    @apply text-2xl font-bold tracking-tight;
  }
  @media (min-width: 640px) {
    .h3 {
      @apply text-3xl;
    }
  }
  @media (min-width: 768px) {
    .h3 {
      @apply text-4xl;
    }
  }

  .h4 {
    @apply text-xl font-semibold;
  }

  .h5 {
    @apply text-lg font-semibold;
  }

  .subheading {
    @apply text-slate-500;
  }
  @media (min-width: 768px) {
    .subheading {
      @apply text-xl;
    }
  }
}

/* Modern Gen Z Swish Styles */
@layer components {
  .glass-header {
    @apply bg-white/80 backdrop-blur-2xl border-0 shadow-lg;
    background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,200,83,0.1);
    transition: all 0.3s ease;
  }

  .brand-gradient {
    background: linear-gradient(135deg, #00C853 0%, #4CAF50 25%, #66BB6A 50%, #81C784 75%, #A5D6A7 100%);
    box-shadow: 0 12px 40px rgba(0, 200, 83, 0.25), 0 4px 16px rgba(0, 200, 83, 0.15);
    transition: all 0.3s ease;
  }

  .brand-gradient:hover {
    box-shadow: 0 16px 48px rgba(0, 200, 83, 0.35), 0 6px 20px rgba(0, 200, 83, 0.25);
    transform: translateY(-2px);
  }

  .hero-gradient {
    background: 
      radial-gradient(1600px 800px at 10% -10%, rgba(0,200,83,.08), transparent 70%),
      radial-gradient(1000px 500px at 110% 10%, rgba(76,175,80,.06), transparent 60%),
      radial-gradient(1400px 700px at 50% 120%, rgba(139,195,74,.04), transparent 70%),
      linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,250,250,0.98) 50%, rgba(248,250,252,0.95) 100%);
  }

  .left-gradient-overlay {
    background: linear-gradient(
      90deg,
      rgba(0, 200, 83, 0.06) 0%,
      rgba(76, 175, 80, 0.04) 25%,
      rgba(46, 125, 50, 0.02) 45%,
      transparent 65%,
      transparent 100%
    );
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
  }

  .glass-card:hover {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12), 0 6px 20px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  .neo-morphism {
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    box-shadow: 
      12px 12px 24px rgba(0, 0, 0, 0.08),
      -12px -12px 24px rgba(255, 255, 255, 0.9),
      inset 2px 2px 4px rgba(255, 255, 255, 0.8),
      inset -2px -2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .neo-morphism:hover {
    box-shadow: 
      16px 16px 32px rgba(0, 0, 0, 0.12),
      -16px -16px 32px rgba(255, 255, 255, 0.95),
      inset 3px 3px 6px rgba(255, 255, 255, 0.9),
      inset -3px -3px 6px rgba(0, 0, 0, 0.08);
  }

  .glow-green {
    box-shadow: 
      0 0 24px rgba(0, 200, 83, 0.4), 
      0 0 48px rgba(0, 200, 83, 0.25), 
      0 0 96px rgba(0, 200, 83, 0.08);
    animation: pulse-glow 3s ease-in-out infinite;
  }

  .modern-button {
    @apply relative overflow-hidden rounded-2xl px-8 py-4 font-semibold text-white transition-all duration-300;
    background: linear-gradient(135deg, #00C853 0%, #4CAF50 100%);
    box-shadow: 0 8px 24px rgba(0, 200, 83, 0.25);
  }

  .modern-button::before {
    content: '';
    @apply absolute inset-0 opacity-0 transition-opacity duration-300;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
  }

  .modern-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 200, 83, 0.35);
  }

  .modern-button:hover::before {
    opacity: 1;
  }

  .modern-button:active {
    transform: translateY(0);
    box-shadow: 0 6px 20px rgba(0, 200, 83, 0.3);
  }

  .modern-input {
    @apply w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl;
    @apply focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20;
    @apply transition-all duration-300 placeholder-gray-400;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  }

  .modern-input:focus {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 24px rgba(0, 200, 83, 0.15);
    transform: translateY(-1px);
  }

  .product-card {
    @apply relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500;
    @apply hover:shadow-2xl hover:-translate-y-2;
  }

  .product-card::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300;
  }

  .product-card:hover::before {
    opacity: 1;
  }

  .floating-action {
    @apply fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl transition-all duration-300;
    @apply hover:scale-110 hover:shadow-3xl active:scale-95;
    background: linear-gradient(135deg, #00C853 0%, #4CAF50 100%);
    box-shadow: 0 12px 40px rgba(0, 200, 83, 0.4);
  }

  .floating-action:hover {
    box-shadow: 0 16px 48px rgba(0, 200, 83, 0.5);
  }

  .search-bar {
    @apply flex items-center space-x-4 bg-white/70 backdrop-blur-xl px-6 py-4 rounded-2xl;
    @apply border border-white/30 shadow-lg transition-all duration-300;
    @apply hover:bg-white/85 focus-within:bg-white/95 focus-within:shadow-xl;
  }

  .search-bar:focus-within {
    box-shadow: 0 12px 40px rgba(0, 200, 83, 0.15);
    transform: translateY(-1px);
  }

  .badge {
    @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold;
    @apply bg-gradient-to-r from-brand-500 to-brand-600 text-white;
    box-shadow: 0 4px 12px rgba(0, 200, 83, 0.25);
  }

  .status-indicator {
    @apply relative inline-flex items-center justify-center w-3 h-3 rounded-full;
  }

  .status-indicator.online {
    @apply bg-green-500;
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
    animation: pulse-status 2s ease-in-out infinite;
  }

  .notification-badge {
    @apply absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full;
    @apply flex items-center justify-center font-bold;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    animation: bounce-gentle 2s ease-in-out infinite;
  }

  .loading-skeleton {
    @apply bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded;
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  .success-state {
    @apply bg-green-50 border-2 border-green-200 text-green-800 p-4 rounded-2xl;
    @apply flex items-center space-x-3;
    animation: fade-in-scale 0.5s ease-out;
  }

  .error-state {
    @apply bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-2xl;
    @apply flex items-center space-x-3;
    animation: shake 0.5s ease-in-out;
  }

  .info-state {
    @apply bg-blue-50 border-2 border-blue-200 text-blue-800 p-4 rounded-2xl;
    @apply flex items-center space-x-3;
    animation: fade-in-up 0.5s ease-out;
  }

  /* Enhanced animations */
  @keyframes pulse-glow {
    0%, 100% { 
      box-shadow: 
        0 0 24px rgba(0, 200, 83, 0.4), 
        0 0 48px rgba(0, 200, 83, 0.25), 
        0 0 96px rgba(0, 200, 83, 0.08);
    }
    50% { 
      box-shadow: 
        0 0 32px rgba(0, 200, 83, 0.6), 
        0 0 64px rgba(0, 200, 83, 0.35), 
        0 0 128px rgba(0, 200, 83, 0.12);
    }
  }

  @keyframes pulse-status {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }

  @keyframes bounce-gentle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes fade-in-scale {
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  /* Responsive design improvements */
  @media (max-width: 768px) {
    .glass-header {
      @apply bg-white/90 backdrop-blur-lg;
    }
    
    .hero-gradient {
      background: 
        radial-gradient(800px 400px at 50% 0%, rgba(0,200,83,.06), transparent 60%),
        linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,250,250,0.98) 100%);
    }
    
    .modern-button {
      @apply px-6 py-3 text-sm;
    }
    
    .modern-input {
      @apply px-4 py-3 text-sm;
    }
    
    .floating-action {
      @apply w-14 h-14 bottom-6 right-6;
    }
    
    .search-bar {
      @apply px-4 py-3;
    }
  }

}