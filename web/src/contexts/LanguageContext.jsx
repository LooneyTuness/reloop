"use client";

import { useState, createContext, useEffect, useContext } from "react";

const LanguageContext = createContext();
const translations = {
  mk: {
    // Navigation
    join: "Регистрирај се",
    Sell: "Продај",
    signOut: "Одјави се",
    signUpOrLogin: "Регистрирај се | Најави се",
    welcomeBack: "Добредојде повторно",
    saveNature: "Зачувај ја природата: Одбери претходно сакано",

    // Sign-in & Auth
    continueJourney: "Продолжи го твоето патување кон одржлива мода",
    enterEmailAddress: "Внесете ја вашата е-пошта",
    sendingMagicLink: "Се испраќа магичен линк...",
    sendMagicLink: "Испрати магичен линк",
    oneClickAndYoureIn: "Еден клик и внатре си",
    secure: "Безбедно",
    private: "Приватно",
    fast: "Брзо",

    // Products
    quickView: "Брз преглед",
    discoverProducts: "Откриј парчиња",
    viewAll: "Види ги сите",
    condition: "Состојба",
    size: "Големина",
    seller: "Продавач",
    addToCart: "Додади во кошничка",
    Used: "Претходно користено",
    currency: "ден",
    ecoChoice: "Еко избор",
    productNotFound: "Продуктот не е најден",
    errorLoadingProduct: "Грешка при вчитување на продукт",
    addedToCart: "Додадено во кошничка",
    errorAddingToCart: "Грешка при додавање во кошничка",
    anonymousSeller: "Анонимен продавач",
    sustainability: "Одржливост",
    resourceSavings: "Заштеда на ресурси споредено со нов производ",
    extendedUse: "Производот е задржан во употреба подолго",
    minimalPackaging: "Испорака во минимално пакување без пластика",

    // Cart & Checkout
    cart: "Кошничка",
    cartEmpty: "Вашата кошничка е празна",
    cartEmptyDescription:
      "Додајте производи и вратете се овде за да завршите со нарачката.",
    startShopping: "Почни со купување",
    orderSummary: "Резиме на нарачка",
    subtotal: "Субтотал",
    shipping: "Испорака",
    shippingCalculated: "Ќе се пресмета при плаќање",
    total: "Вкупно",
    fullName: "Име и презиме",
    email: "E-mail",
    phone: "Телефон",
    city: "Град",
    address: "Адреса (улица и број)",
    additionalAddress: "Додатна адреса (опционално)",
    postalCode: "Поштенски код",
    notes: "Забелешка (опционално)",
    dataUsageNote: "Вашите податоци се користат само за испорака на нарачката.",
    remove: "Избриши",
    continueShopping: "Продолжи со купување",
    clearCart: "Избриши кошничка",
    processing: "Се процесира...",
    completeOrder: "Заврши нарачка (плаќање при преземање)",
    orderCreated: "Нарачката е креирана. Плаќање при преземање!",
    orderError: "Настана грешка при креирање на нарачка. Обидете се повторно.",

    // Home & Landing
    heroTitle: "Купувај и продавај претходно сакана мода",
    heroSubtitle: "за минути, не за часови",
    heroDescription:
      "Прескокни ја комплицираната препродажба. Листај веднаш, откривај уникатни парчиња лесно и заработувај од гардеробата.",
    heroStartFree: "Започни бесплатно — без кредитна картичка.",
    newArrivals: "Новите парчиња стигнаа • Избрани со љубов",
    secondHand: "Втора рака.",
    firstPick: "Прв избор.",
    whyPayMore:
      "Прескокни ја маката од традиционална препродажба. Листај облека инстантно и откриј уникатни парчиња без проблем.",
    startShopping: "Започни купување",
    addYourStory: "Додади ја својата приказна",
    securePayments: "Безбедни плаќања",
    verifiedSellers: "Проверени продавачи",
    fastDelivery: "Брза достава",
    curatedCollection: "Избрани парчиња",
    discoverUniquePieces: "Откриј уникатни парчиња од нашата селекција",
    shop: "Продавница",
    allProducts: "Сите продукти",
    sellWithUs: "Продај со нас",
    shoppingCart: "Кошничка",
    support: "Поддршка",
    helpSupport: "Помош и поддршка",
    privacyPolicy: "Политика за приватност",
    termsOfService: "Услови за користење",
    followUs: "Следете не",
    followUsDescription: "Следете не за најновите парчиња и специјални понуди",
    sustainableFashion: "Одржлива мода за подобро утре",
    videoUnavailable: "Видео недостижно",
    continueBrowsing: "Продолжете со преглед на содржината",
    refreshing: "Се освежува...",
    pullToRefresh: "Повлечете за освежување",
    backgroundVideoLabel: "Позадинско видео за модна платформа",
    startShoppingLabel: "Започни купување - прегледај ги сите продукти",
    addStoryLabel: "Додади ја својата приказна - започни продавање",

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
    sizeLabel: "Големина",
    selectSize: "Избери големина (опционално)",
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
    loginTitle: "Добредојде назад",
    loginSubtitle: "Најави се и се придружи на кружната мода",
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
    createAccountButton: "Креирај сметка",
    signUpTitle: "Креирај ја твојата vtoraraka.mk сметка",
    signUpSubtitle: "Почни да продаваш претходно сакани парчиња",
    cancel: "Откажи",
    dontHaveAccount: "Немаш сметка?",
    signUpHere: "Регистрирај се тука",
    alreadyHaveAccount: "Веќе имаш сметка?",
    logInHere: "Најави се тука",
    startSelling: "Започни со продавање",
    createAccountToStartSelling: "Креирај сметка за да започнеш со продавање",
    signInToContinue: "Најави се за да продолжиш",
    backToHome: "Назад кон почетна",
    circularFashion: "Кружна Мода",

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

    // Dashboard
    dashboard: "Табла",
    loadingDashboard: "Се вчитува таблата...",
    pleaseWait: "Ве молиме почекајте",
    totalItems: "Вкупно производи",
    activeItems: "Активни производи",
    inactiveItems: "Неактивни производи",
    yourItems: "Ваши производи",
    welcomeBack: "Добредојде повторно",
    addNewProduct: "Додади нов производ",
    noProductsYet: "Сè уште нема производи",
    startByAdding: "Почнете со додавање на вашиот прв производ за продажба",
    addYourFirstProduct: "Додади го твојот прв производ",
    active: "Активен",
    inactive: "Неактивен",
    deactivate: "Деактивирај",
    activate: "Активирај",
    delete: "Избриши",
    deleteConfirm:
      "Дали сте сигурни дека сакате да го избришете овој производ? Оваа акција не може да се врати.",
    itemActivated: "Производот е активиран успешно",
    itemDeactivated: "Производот е деактивиран успешно",
    itemDeleted: "Производот е избришан успешно",
    failedToLoadItems: "Неуспешно вчитување на производите",
    failedToUpdateItem: "Неуспешно ажурирање на производот",
    failedToDeleteItem: "Неуспешно бришење на производот",

    // Sign-up & Registration
    welcomeToVtoraraka: "Добредојде на vtoraraka.mk",
    startSustainableJourney: "Почни го твоето патување кон одржлива мода денес",
    fullName: "Име и презиме",
    emailAddress: "Е-пошта",
    createPassword: "Креирај лозинка",
    confirmPassword: "Потврди лозинка",
    creatingAccount: "Се креира сметка...",
    createAccount: "Креирај сметка",
    joinThousands: "Придружи се на илјадници љубители на одржлива мода",
    byContinuing:
      "Со продолжување, потврдуваш дека разбираш и се согласуваш со нашите",
    termsOfService: "Услови за користење",
    and: "и",
    privacyPolicy: "Политика за приватност",

    // Magic Link Modal
    checkYourEmail: "Провери ја твојата е-пошта!",
    createYourAccount: "Креирај ја твојата сметка",
    magicLinkSent: "Испративме магичен линк за најава и следење на нарачките.",
    magicLinkDescription:
      "Добиј магичен линк на твојата е-пошта за лесна најава и следење на нарачките.",
    skipForNow: "Прескокни за сега",
    continueShopping: "Продолжи со купување",
    whyCreateAccount: "Зошто да креираш сметка?",
    trackOrderStatus: "• Следи го статусот на твојата нарачка",
    saveShippingDetails: "• Зачувај ги деталите за достава",
    getNotified: "• Добивај известувања за нови парчиња",
    easyCheckout: "• Лесна наплата за идни нарачки",
  },
  en: {
    // Navigation
    join: "Join",
    Sell: "Sell",
    signOut: "Sign Out",
    signUpOrLogin: "Sign Up | Log In",
    welcomeBack: "Welcome Back",
    saveNature: "Save Nature: Choose Pre-Loved",

    // Sign-in & Auth
    continueJourney: "Continue your sustainable fashion journey",
    enterEmailAddress: "Enter your email address",
    sendingMagicLink: "Sending magic link...",
    sendMagicLink: "Send Magic Link",
    oneClickAndYoureIn: "One click and you're in",
    secure: "Secure",
    private: "Private",
    fast: "Fast",

    // Products
    quickView: "Quick View",
    discoverProducts: "Discover the pieces",
    viewAll: "View all",
    condition: "Condition",
    size: "Size",
    seller: "Seller",
    addToCart: "Add to Cart",
    Used: "Used",
    currency: "MKD",
    ecoChoice: "Eco Choice",
    productNotFound: "Product not found",
    errorLoadingProduct: "Error loading product",
    addedToCart: "Added to cart",
    errorAddingToCart: "Error adding to cart",
    anonymousSeller: "Anonymous seller",
    sustainability: "Sustainability",
    resourceSavings: "Resource savings compared to new product",
    extendedUse: "Product kept in use longer",
    minimalPackaging: "Delivery in minimal packaging without plastic",

    // Cart & Checkout
    cart: "Cart",
    cartEmpty: "Your cart is empty",
    cartEmptyDescription:
      "Add products and return here to complete your order.",
    startShopping: "Start Shopping",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    shippingCalculated: "Will be calculated at checkout",
    total: "Total",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    city: "City",
    address: "Address (street and number)",
    additionalAddress: "Additional address (optional)",
    postalCode: "Postal Code",
    notes: "Notes (optional)",
    dataUsageNote: "Your data is used only for order delivery.",
    remove: "Remove",
    continueShopping: "Continue Shopping",
    clearCart: "Clear Cart",
    processing: "Processing...",
    completeOrder: "Complete Order (Cash on Delivery)",
    orderCreated: "Order created. Payment on delivery!",
    orderError: "An error occurred while creating the order. Please try again.",

    // Home & Landing
    heroTitle: "Buy and sell pre-loved fashion",
    heroSubtitle: "in minutes, not hours",
    heroDescription:
      "Skip the complicated resale. List instantly, discover unique pieces easily and earn from your wardrobe.",
    heroStartFree: "Start free — no credit card required.",
    newArrivals: "New arrivals • Curated with love",
    secondHand: "Second-hand.",
    firstPick: "First Pick.",
    whyPayMore:
      "Skip the hassle of traditional resale. Browse clothing instantly and discover unique pieces without trouble.",
    startShopping: "Start Shopping",
    addYourStory: "Add Your Story",
    securePayments: "Secure Payments",
    verifiedSellers: "Verified Sellers",
    fastDelivery: "Fast Delivery",
    curatedCollection: "Curated Collection",
    discoverUniquePieces:
      "Discover unique pieces from our carefully curated selection",
    shop: "Shop",
    allProducts: "All Products",
    sellWithUs: "Sell With Us",
    shoppingCart: "Shopping Cart",
    support: "Support",
    helpSupport: "Help & Support",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    followUs: "Follow Us",
    followUsDescription: "Follow us for the latest pieces and special offers",
    sustainableFashion: "Sustainable fashion for a better tomorrow",
    videoUnavailable: "Video unavailable",
    continueBrowsing: "Continue browsing our content",
    refreshing: "Refreshing...",
    pullToRefresh: "Pull to refresh",
    backgroundVideoLabel: "Background video for fashion platform",
    startShoppingLabel: "Start shopping - browse all products",
    addStoryLabel: "Add your story - start selling",

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
    sizeLabel: "Size",
    selectSize: "Select size (optional)",
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
    createAccountButton: "Create Account",
    signUpTitle: "Create your vtoraraka.mk account",
    signUpSubtitle: "Start selling your pre-loved items",
    cancel: "Cancel",
    dontHaveAccount: "Don't have an account?",
    signUpHere: "Sign up here",
    alreadyHaveAccount: "Already have an account?",
    logInHere: "Log in here",
    startSelling: "Start Selling",
    createAccountToStartSelling: "Create an account to start selling",
    signInToContinue: "Sign in to continue",
    backToHome: "Back to Home",
    circularFashion: "Circular Fashion",

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

    // Dashboard
    dashboard: "Dashboard",
    loadingDashboard: "Loading dashboard...",
    pleaseWait: "Please wait a moment",
    totalItems: "Total Items",
    activeItems: "Active Items",
    inactiveItems: "Inactive Items",
    yourItems: "Your Items",
    welcomeBack: "Welcome back",
    addNewProduct: "Add New Product",
    noProductsYet: "No products yet",
    startByAdding: "Start by adding your first item to sell",
    addYourFirstProduct: "Add Your First Product",
    active: "Active",
    inactive: "Inactive",
    deactivate: "Deactivate",
    activate: "Activate",
    delete: "Delete",
    deleteConfirm:
      "Are you sure you want to delete this item? This action cannot be undone.",
    itemActivated: "Item activated successfully",
    itemDeactivated: "Item deactivated successfully",
    itemDeleted: "Item deleted successfully",
    failedToLoadItems: "Failed to load items",
    failedToUpdateItem: "Failed to update item",
    failedToDeleteItem: "Failed to delete item",

    // Sign-up & Registration
    welcomeToVtoraraka: "Welcome to vtoraraka.mk",
    startSustainableJourney: "Start your sustainable fashion journey today",
    fullName: "Full Name",
    emailAddress: "Email Address",
    createPassword: "Create Password",
    confirmPassword: "Confirm Password",
    creatingAccount: "Creating account...",
    createAccount: "Create Account",
    joinThousands: "Join thousands of sustainable fashion lovers",
    byContinuing:
      "By continuing, you acknowledge that you understand and agree to our",
    termsOfService: "Terms of Service",
    and: "and",
    privacyPolicy: "Privacy Policy",

    // Magic Link Modal
    checkYourEmail: "Check your email!",
    createYourAccount: "Create your account",
    magicLinkSent:
      "We've sent you a magic link to sign in and track your orders.",
    magicLinkDescription:
      "Get a magic link sent to your email for easy sign-in and order tracking.",
    skipForNow: "Skip for now",
    continueShopping: "Continue Shopping",
    whyCreateAccount: "Why create an account?",
    trackOrderStatus: "• Track your order status",
    saveShippingDetails: "• Save your shipping details",
    getNotified: "• Get notified about new items",
    easyCheckout: "• Easy checkout for future orders",
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
