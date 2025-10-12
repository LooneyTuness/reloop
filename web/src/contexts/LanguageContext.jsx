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
    currency: "MKD",
    ecoChoice: "Еко избор",
    productNotFound: "Продуктот не е најден",
    errorLoadingProduct: "Грешка при вчитување на продукт",
    addedToCart: "Додадено во кошничка",
    alreadyInCart: "Веќе во кошничка",
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
    orderConfirmation: "Нова нарачка",
    orderConfirmationMessage:
      "Некој нарача ваши производи! Нарачка #{orderId} - контактирајте го купувачот за испорака.",

    // Notifications
    notifications: "Известувања",
    noNotifications: "Нема известувања",
    noNotificationsDescription:
      "Кога некој ќе нарача ваши производи, ќе добиете известување тука.",
    markAsRead: "Означи како прочитано",
    dismiss: "Отфрли",
    dismissAll: "Отфрли ги сите",
    orderNumber: "Број на нарачка",
    items: "Производи",
    orderDeleted: "Нарачката е избришана",

    // Vendor Orders
    vendorOrders: "Нарачки за моите производи",
    totalOrders: "Вкупно нарачки",
    totalItems: "Вкупно парчиња",
    totalRevenue: "Вкупен приход",
    pendingOrders: "Нерешени нарачки",
    allOrders: "Сите нарачки",
    pending: "Нерешени",
    completed: "Завршени",
    markCompleted: "Означи како завршена",
    buyerInfo: "Информации за купувачот",
    deliveryInfo: "Информации за испорака",
    notes: "Забелешки",

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
    becomeSeller: "Стани продавач",
    applyToSell: "Аплицирај за продавање",

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
    price: "Цена (MKD)",
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

    // Dashboard - REMOVED (moved to seller dashboard)

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
    // Auth Success Messages
    youreNowSignedIn:
      "Сега сте најавени! Започнете ја вашата одржлива модна патување.",
    emailConfirmed:
      "Вашата е-пошта е успешно потврдена. Започнете ја вашата одржлива модна патување сега.",
    startShopping: "Започни купување",
    readyToMakeDifference: "Готови да направите разлика",
    checkYourEmail: "Провери ја твојата е-пошта",
    magicLinkSent:
      "Испративме магичен линк. Кликнете на него за да се најавите и да започнете.",
    confirmationLinkSent:
      "Испративме потврдна врска. Кликнете на неа за да ја активирате вашата сметка и да започнете ја вашата одржлива модна патување.",
    cantFindEmail: "Не можете да ја најдете е-поштата?",
    cantFindMagicLink: "Не можете да го најдете магичниот линк?",
    checkSpamFolder: "Проверете ја папката за спам/непожелни",
    waitFewMinutes: "Почекајте неколку минути и обидете се повторно",
    makeSureEmailCorrect: "Проверете дали е-поштата е точна",
    magicLinksExpire: "Магичните линкови истекуваат по 1 час за безбедност",
    browseProductsMeantime: "Прегледајте производи во меѓувреме",
    alreadyConfirmedEmail: "Веќе ја потврдив мојата е-пошта",
    magicLinkFailed:
      "Неуспешно испраќање на магичниот линк. Обидете се повторно.",
    confirmingYourEmail: "Ја потврдуваме вашата е-пошта...",
    confirmationError: "Грешка при потврда",
    thereWasAnError: "Имаше грешка при потврдувањето на вашата е-пошта.",
    tryAgain: "Обиди се повторно",
    goToHomepage: "Оди на почетна страница",
    error: "Грешка:",

    // Waitlist Component
    waitlistTitle: "Досадно ти е од скапата брза мода?",
    waitlistSubtitle: "Добредојде во кружниот стил",
    waitlistBadge: "Кружна мода.",
    waitlistStats: {
      secondsToSell: "секунди за продавање",
      offRetailPrices: "попуштање од малопродажни цени",
      sustainableImpact: "одржлив влијание",
    },
    waitlistForm: {
      nameLabel: "Име",
      nameOptional: "(опционално)",
      namePlaceholder: "Твоето име",
      emailLabel: "Е-пошта",
      emailPlaceholder: "твоја@е-пошта.com",
      interestsLabel: "Што те интересира најмногу?",
      interestsOptional: "(избери сите што се однесуваат)",
      submitButton: "Придружи се на листата за чекање",
      submittingButton: "Се придружува на листата...",
      alreadyOnWaitlist:
        "Веќе си на нашата листа за чекање! Ќе те контактираме наскоро.",
      somethingWentWrong: "Нешто не е во ред. Обиди се повторно.",
      pleaseEnterEmail: "Ве молиме внесете ја вашата е-пошта",
    },
    waitlistInterests: {
      selling: {
        label: "Продавање на мојата облека",
        description: "Претвори го гардеробата во пари",
      },
      buying: {
        label: "Купување одржлива мода",
        description: "Откриј уникатни претходно сакани парчиња",
      },
      community: {
        label: "Придружување на еко заедница",
        description: "Поврзи се со луѓе со слични интереси",
      },
      impact: {
        label: "Следење на мојот еко влијание",
        description: "Види ја твојата еколошка разлика",
      },
    },
    waitlistSuccess: {
      title: "Си на листата!",
      description:
        "Добредојде во револуцијата за одржлива мода! Ќе те известиме штом vtoraraka се лансира.",
      whatHappensNext: "Што се случува следно?",
      earlyAccess: "Ќе добиеш рано пристап кога ќе се лансираме",
      exclusiveUpdates: "Ексклузивни ажурирања за нашиот напредок",
      specialPerks: "Специјални придобивки и попусти на денот на лансирање",
      backToHome: "Назад кон почетна",
      followUs: "Следете не за ажурирања:",
    },
    waitlistTrust: {
      noSpam: "🔒 Никаков спам, никогаш. Отпиши се со еден клик.",
      gdprCompliant: "✓ GDPR усогласен",
      secureData: "✓ Безбедни податоци",
      privacyFirst: "✓ Приватност на прво место",
    },

    // Footer
    footerDescription:
      "Прескокни ја маката од традиционална препродажба. Листај облека инстантно, откриј уникатни парчиња без проблем.",
    footerEmail: "vtoraraka.mk",

    // Video Error Messages
    videoUnavailable: "Видео недостижно",
    continueBrowsing: "Продолжете со преглед на содржината",
    pullToRefresh: "Повлечете за освежување",
    backgroundVideoLabel: "Позадинско видео за модна платформа",

    // Dashboard Status - REMOVED (moved to seller dashboard)

    // Order Completion Messages - REMOVED (moved to seller dashboard)
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
    alreadyInCart: "Already in cart",
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
    orderConfirmation: "New Order",
    orderConfirmationMessage:
      "Someone ordered your products! Order #{orderId} - contact the buyer for delivery.",

    // Notifications
    notifications: "Notifications",
    noNotifications: "No notifications",
    noNotificationsDescription:
      "When someone orders your products, you'll receive a notification here.",
    markAsRead: "Mark as read",
    dismiss: "Dismiss",
    dismissAll: "Dismiss all",
    orderNumber: "Order number",
    items: "Items",
    orderDeleted: "Order deleted",

    // Vendor Orders
    vendorOrders: "Orders for My Products",
    totalOrders: "Total Orders",
    totalItems: "Total Items",
    totalRevenue: "Total Revenue",
    pendingOrders: "Pending Orders",
    allOrders: "All Orders",
    pending: "Pending",
    completed: "Completed",
    markCompleted: "Mark as Completed",
    buyerInfo: "Buyer Information",
    deliveryInfo: "Delivery Information",
    notes: "Notes",

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
    becomeSeller: "Become a Seller",
    applyToSell: "Apply to Sell",

    // Sell Item Page - REMOVED (moved to seller dashboard)

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

    // Dashboard - REMOVED (moved to seller dashboard)

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

    // Auth Success Messages
    youreNowSignedIn:
      "You're now signed in! Start your sustainable fashion journey.",
    emailConfirmed:
      "Your email has been successfully confirmed. Start your sustainable fashion journey now.",
    startShopping: "Start Shopping",
    readyToMakeDifference: "Ready to make a difference",
    checkYourEmail: "Check your email",
    magicLinkSent:
      "We've sent you a magic link. Click it to sign in and start your sustainable fashion journey.",
    confirmationLinkSent:
      "We've sent you a confirmation link. Click it to activate your account and start your sustainable fashion journey.",
    cantFindEmail: "Can't find the email?",
    cantFindMagicLink: "Can't find the magic link?",
    checkSpamFolder: "Check your spam/junk folder",
    waitFewMinutes: "Wait a few minutes and try again",
    makeSureEmailCorrect: "Make sure the email address is correct",
    magicLinksExpire: "Magic links expire after 1 hour for security",
    browseProductsMeantime: "Browse products in the meantime",
    magicLinkFailed: "Failed to send magic link. Please try again.",
    confirmingYourEmail: "Confirming your email...",
    confirmationError: "Confirmation Error",
    thereWasAnError: "There was an error confirming your email address.",
    tryAgain: "Try Again",
    goToHomepage: "Go to Homepage",
    error: "Error:",

    // Waitlist Component
    waitlistTitle: "Tired of Overpriced Fast Fashion?",
    waitlistSubtitle: "Welcome to Circular Style",
    waitlistBadge: "Кружна мода.",
    waitlistStats: {
      secondsToSell: "seconds to sell",
      offRetailPrices: "off retail prices",
      sustainableImpact: "sustainable impact",
    },
    waitlistForm: {
      nameLabel: "Name",
      nameOptional: "(optional)",
      namePlaceholder: "Your name",
      emailLabel: "Email address",
      emailPlaceholder: "your@email.com",
      interestsLabel: "What interests you most?",
      interestsOptional: "(select all that apply)",
      submitButton: "Join the Waitlist",
      submittingButton: "Joining waitlist...",
      alreadyOnWaitlist:
        "You're already on our waitlist! We'll be in touch soon.",
      somethingWentWrong: "Something went wrong. Please try again.",
      pleaseEnterEmail: "Please enter your email address",
    },
    waitlistInterests: {
      selling: {
        label: "Selling my clothes",
        description: "Turn your closet into cash",
      },
      buying: {
        label: "Buying sustainable fashion",
        description: "Discover unique pre-loved pieces",
      },
      community: {
        label: "Joining eco community",
        description: "Connect with like-minded people",
      },
      impact: {
        label: "Tracking my eco impact",
        description: "See your environmental difference",
      },
    },
    waitlistSuccess: {
      title: "You're on the list!",
      description:
        "Welcome to the sustainable fashion revolution! We'll notify you as soon as vtoraraka launches.",
      whatHappensNext: "What happens next?",
      earlyAccess: "You'll get early access when we launch",
      exclusiveUpdates: "Exclusive updates on our progress",
      specialPerks: "Special launch day perks and discounts",
      backToHome: "Back to Home",
      followUs: "Follow us for updates:",
    },
    waitlistTrust: {
      noSpam: "🔒 No spam, ever. Unsubscribe with one click.",
      gdprCompliant: "✓ GDPR Compliant",
      secureData: "✓ Secure Data",
      privacyFirst: "✓ Privacy First",
    },

    // Footer
    footerDescription:
      "Skip the hassle of traditional resale. Browse clothing instantly, discover unique pieces without the trouble.",
    footerEmail: "vtoraraka.mk",

    // Video Error Messages
    videoUnavailable: "Video unavailable",
    continueBrowsing: "Continue browsing our content",
    pullToRefresh: "Pull to refresh",
    backgroundVideoLabel: "Background video for fashion platform",

    // Dashboard Status - REMOVED (moved to seller dashboard)

    // Order Completion Messages - REMOVED (moved to seller dashboard)
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
