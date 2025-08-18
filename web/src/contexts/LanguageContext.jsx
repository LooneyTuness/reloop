"use client";

import { useState, createContext, useEffect, useContext } from "react";

const LanguageContext = createContext();
const translations = {
  mk: {
    // Navigation
    join: "Регистрирај се",
    startFreeNow: "Започни бесплатно сега",
    signOut: "Одјави се",
    welcomeBack: "Добредојде повторно",
    saveNature: "Зачувај ја природата: Одбери претходно сакано",

    // Products
    preLoved: "Парчиња со приказна кои штедат ресурси и го намалуваат отпадот",
    viewAll: "Види сè",
    quickView: "Брз преглед",

    // Home & Landing
    heroTitle: "Купувај и продавај претходно сакана мода",
    heroSubtitle: "за минути, не за часови",
    heroDescription:
      "Прескокни ја комплицираната препродажба. Листај веднаш, откривај уникатни парчиња лесно и заработувај од гардеробата.",
    heroStartFree: "Започни бесплатно — без кредитна картичка.",

    // Sell Item Page
    listItemTitle: "Листај предмет – штеди ресурси",
    listItemWelcome: "Подари втор живот на облеката и намали го отпадот.",
    uploadPhotos: "Фотографии",
    clickToUpload: "Кликни за прикачување или повлечи и пушти",
    maxPhotosInfo: "PNG, JPG до 5MB (макс. 5 фотографии)",
    itemTitle: "Наслов на предметот",
    itemTitlePlaceholder: "пр. Винтиџ кожна јакна",
    category: "Категорија",
    selectCategory: "Избери категорија",
    categoryClothing: "Облека",
    categoryBags: "Торби",
    categoryShoes: "Обувки",
    categoryWatches: "Часовници",
    categoryHome: "Дом",
    categoryBooks: "Книги",
    price: "Цена (ден)",
    description: "Опис",
    descriptionPlaceholder: "Опиши состојба, големина, карактеристики...",
    required: "*",
    steps: {
      photos: "Фотографии",
      details: "Детали",
      pricing: "Цена",
    },
    uploadingPhotos: "Се прикачуваат фотографии...",
    listItemButton: "Објави",

    // Login & Auth
    loginTitle: "Добредојде повторно",
    loginSubtitle: "Најави се и придружи се на кружната мода",
    email: "Е-пошта",
    password: "Лозинка",
    confirmPassword: "Потврди лозинка",
    fullName: "Име и презиме",
    enterEmail: "Внеси е-пошта",
    enterPassword: "Внеси лозинка",
    confirmPasswordPlaceholder: "Потврди лозинка",
    enterFullName: "Внеси име и презиме",
    signingIn: "Се најавува...",
    signIn: "Најави се",
    createAccount: "Креирај сметка",
    createAccountTitle: "Креирај сметка",
    cancel: "Откажи",
    dontHaveAccount: "Немаш сметка?",
    signUpHere: "Регистрирај се тука",
    alreadyHaveAccount: "Веќе имаш сметка?",
    logInHere: "Најави се тука",

    // Error Messages
    fillAllFields: "Внеси ги сите полиња",
    passwordsNotMatch: "Лозинките не се совпаѓаат",
    passwordTooShort: "Лозинката мора да има најмалку 8 карактери",
    accountExists: "Оваа е-пошта веќе е регистрирана. Најави се.",
    accountCreated:
      "Сметката е креирана успешно! Провери ја е-поштата за верификација.",
    errorOccurred: "Се случи грешка. Обиди се повторно.",
    onlyImages: "Дозволени се само слики",
    fileTooLarge: "Датотеката мора да е помала од 5MB",
    maxPhotos: "Можеш да прикачиш до 5 фотографии",
    addPhotos: "Додај барем една фотографија",
    listingSuccess:
      'Фала за листањето! "{title}" сега е дел од кружната економија.',

    // 404 Page
    pageNotFound: "Страницата не е пронајдена",
    pageNotFoundDesc:
      "Изгледа дека ја напуштивме патеката. Ајде да те вратиме на еко-шопинг.",
    goBackHome: "Назад кон почетна",

    // Header Catalog
    browse: "Прелистај",
    latestFinds: "Најнови наоди",
    freshPreLoved: "Свежи претходно сакани предмети",
    viewAllItems: "Види сите предмети",
    noItemsYet: "Сè уште нема предмети",
    beFirstToList: "Биди првиот што ќе листа предмет!",
    listItem: "Листај предмет",

    // Common
    loading: "Се вчитува...",
    welcomeBackUser: "Добредојде повторно!",
  },
  en: {
    // Navigation
    join: "Join",
    startFreeNow: "Start Free Now",
    signOut: "Sign Out",
    welcomeBack: "Welcome Back",
    saveNature: "Save Nature: Choose Pre-Loved",

    // Products
    preLoved: "Story pieces that save resources and reduce waste",
    viewAll: "View All",
    quickView: "Quick View",

    // Home & Landing
    heroTitle: "Buy and sell pre-loved fashion",
    heroSubtitle: "in minutes, not hours",
    heroDescription:
      "Skip the complicated resale. List instantly, discover unique pieces easily and earn from your wardrobe.",
    heroStartFree: "Start free — no credit card required.",

    // Sell Item Page
    listItemTitle: "List Item – Save Resources",
    listItemWelcome: "Give clothing a second life and reduce waste.",
    uploadPhotos: "Photos",
    clickToUpload: "Click to upload or drag and drop",
    maxPhotosInfo: "PNG, JPG up to 5MB (max 5 photos)",
    itemTitle: "Item Title",
    itemTitlePlaceholder: "e.g. Vintage leather jacket",
    category: "Category",
    selectCategory: "Select category",
    categoryClothing: "Clothing",
    categoryBags: "Bags",
    categoryShoes: "Shoes",
    categoryWatches: "Watches",
    categoryHome: "Home",
    categoryBooks: "Books",
    price: "Price (MKD)",
    description: "Description",
    descriptionPlaceholder: "Describe condition, size, features...",
    required: "*",
    steps: {
      photos: "Photos",
      details: "Details",
      pricing: "Pricing",
    },
    uploadingPhotos: "Uploading photos...",
    listItemButton: "List Item",

    // Login & Auth
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in and join the circular fashion",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    enterEmail: "Enter email",
    enterPassword: "Enter password",
    confirmPasswordPlaceholder: "Confirm password",
    enterFullName: "Enter full name",
    signingIn: "Signing in...",
    signIn: "Sign In",
    createAccount: "Create Account",
    createAccountTitle: "Create Account",
    cancel: "Cancel",
    dontHaveAccount: "Don't have an account?",
    signUpHere: "Sign up here",
    alreadyHaveAccount: "Already have an account?",
    logInHere: "Log in here",

    // Error Messages
    fillAllFields: "Please fill all fields",
    passwordsNotMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 8 characters",
    accountExists: "This email is already registered. Please sign in.",
    accountCreated:
      "Account created successfully! Please check your email for verification.",
    errorOccurred: "An error occurred. Please try again.",
    onlyImages: "Only images are allowed",
    fileTooLarge: "File must be smaller than 5MB",
    maxPhotos: "You can upload up to 5 photos",
    addPhotos: "Add at least one photo",
    listingSuccess:
      'Thanks for listing! "{title}" is now part of the circular economy.',

    // 404 Page
    pageNotFound: "Page Not Found",
    pageNotFoundDesc:
      "Looks like we've wandered off the path. Let's get you back to eco-shopping.",
    goBackHome: "Go Back Home",

    // Header Catalog
    browse: "Browse",
    latestFinds: "Latest Finds",
    freshPreLoved: "Fresh pre-loved items",
    viewAllItems: "View all items",
    noItemsYet: "No items yet",
    beFirstToList: "Be the first to list an item!",
    listItem: "List Item",

    // Common
    loading: "Loading...",
    welcomeBackUser: "Welcome back!",
  },
};

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("mk");

  const toggleLanguage = () => {
    const newLanguage = language === "mk" ? "en" : "mk";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "mk")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
