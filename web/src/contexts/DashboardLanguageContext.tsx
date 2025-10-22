"use client";

import { useState, createContext, useEffect, useContext } from "react";

interface DashboardLanguageContextType {
  language: string;
  toggleLanguage: () => void;
  t: (key: string) => string;
  translateCategory: (categoryName: string) => string;
  languageKey: string;
  forceUpdate: number;
}

const DashboardLanguageContext = createContext<DashboardLanguageContextType | undefined>(undefined);

const dashboardTranslations = {
  mk: {
    // Navigation
    dashboard: "Контролна табла",
    myListings: "Мои листинзи",
    addProduct: "Додај продукт",
    orders: "Нарачки",
    payouts: "Плаќања",
    settings: "Подесувања",
    logout: "Одјави се",
    
    // Roles
    seller: "Продавач",
    admin: "Администратор",
    
    // Back button
    back: "Назад",
    backToDashboard: "Назад кон контролната табла",
    
    // Common messages
    pleaseWait: "Ве молиме почекајте...",
    
    // Save states
    saved: "Зачувано",
    
    // Sidebar specific
    sellerDashboard: "Продавачки панел",
    navigation: "Навигација",
    mainMenu: "Главно мени",
    account: "Сметка",
    mobileMenu: "Мобилно мени",
    closeMenu: "Затвори мени",
    quickActions: "Брзи акции",
    manageStore: "Управувај со продавницата",
    
    // Dashboard Overview
    storeOverview: "Преглед на продавницата",
    keyMetrics: "Клучни метрики за перформансите на вашата продавница",
    totalListings: "Вкупно листинзи",
    itemsSoldThisMonth: "Продадени парчиња (овој месец)",
    totalEarnings: "Вкупен приход",
    totalOrders: "Вкупно нарачки",
    totalProducts: "Вкупно производи",
    conversion: "конверзија",
    fromLastPeriod: "од последниот период",
    noChange: "Нема промена",
    thisWeek: "оваа недела",
    fromLastMonth: "од последниот месец",
    thisMonth: "овој месец",
    
    // Greetings
    goodMorning: "Здраво",
    goodAfternoon: "Здраво",
    goodEvening: "Здраво",
    welcomeBack: "Добредојде назад",
    manageYourStore: "Управувајте со вашата продавница",
    
    // Recent Orders
    recentOrders: "Неодамнешни нарачки",
    latestCustomerOrders: "Последни нарачки од купувачи и нивниот статус",
    markAsProcessing: "Означи како процесирано",
    markAsShipped: "Означи како испорачано",
    markAsDelivered: "Означи како доставено",
    viewAllOrders: "Види ги сите нарачки",
    
    // Order Status
    pending: "Нерешени",
    processing: "Процесирани",
    shipped: "Испорачани",
    delivered: "Доставени",
    cancelled: "Откажани",
    
    
    // Settings
    sellerProfile: "Профил на продавачот",
    manageSellerProfile: "Управувајте со вашиот профил и бизнис информации",
    profilePicture: "Слика на профилот",
    clickCameraIcon: "Кликнете на иконата на камерата за да прикачите нова слика",
    personalInformation: "Лични информации",
    fullName: "Име и презиме",
    enterFullName: "Внесете го вашето име и презиме",
    email: "Е-пошта",
    enterEmail: "Внесете ја вашата е-пошта",
    phone: "Телефон",
    enterPhoneNumber: "Внесете го вашиот телефонски број",
    location: "Локација",
    enterLocation: "Внесете ја вашата локација",
    bio: "Биографија",
    tellCustomersAboutYourself: "Кажете им на купувачите за себе...",
    website: "Веб-сајт",
    businessInformation: "Бизнис информации",
    businessName: "Име на бизнисот",
    enterBusinessName: "Внесете го името на бизнисот",
    businessType: "Тип на бизнис",
    selectBusinessType: "Изберете тип на бизнис",
    individualSeller: "Индивидуален продавач",
    smallBusiness: "Мал бизнис",
    retailer: "Малопродажба",
    wholesaler: "Големопродажба",
    other: "Друго",
    taxId: "Даночен број (опционално)",
    enterTaxId: "Внесете го даночниот број",
    bankAccount: "Банкарска сметка (опционално)",
    enterBankAccountInfo: "Внесете ги информациите за банкарската сметка",
    saveProfile: "Зачувај профил",
    saving: "Се зачувува...",
    
    // Success/Error Messages
    profileUpdatedSuccessfully: "Профилот е успешно ажуриран!",
    profilePictureUpdated: "Сликата на профилот е ажурирана!",
    failedToLoadProfile: "Неуспешно вчитување на профилот",
    failedToUpdateProfile: "Неуспешно ажурирање на профилот",
    failedToUpdateProfilePicture: "Неуспешно ажурирање на сликата на профилот",
    pleaseSelectValidImage: "Ве молиме изберете валидна слика",
    imageSizeMustBeLess: "Големината на сликата мора да биде помала од 5MB",
    
    // Dashboard Guide
    howToUseDashboard: "Подготвена за нови успеси?",
    followTheseSteps: "Еве како брзо и ефикасно да го водиш твојот бизнис на vtoraraka.mk – чекор по чекор:",
    yourPathToSuccess: "Твојот пат до успешна продажба:",
    addNewProductDescription: "Додај нов производ – Што побрзо го објавиш, побрзо ќе стигне до вистинскиот купувач.",
    manageOrdersDescription: "Управувај со нарачки – Следи ги, одговори брзо и гради доверба со секој клиент.",
    trackProductsDescription: "Управувај со листинзи",
    updateProducts: "Ажурирај производи",
    checkNewOrders: "Провери нови нарачки",
    sendPackages: "Испрати пратки",
    reviewEarnings: "Прегледај заработка",
    expertAdvice: "Совет од експерт:",
    expertAdviceText: "Најуспешните продавачи се тие што постојано тестираат, ги слушаат клиентите и ги оптимизираат производите според податоци. Секој клик значи можност за подобрување.",
    clickToStart: "Кликни за да започнеш",
    clickToManage: "Кликни за да управуваш",
    clickToTrack: "Кликни за да следиш",
    step1AddProducts: "Чекор 1: Додајте производи",
    uploadImagesSetPrices: "Прикачете слики, поставете цени, напишете описи",
    step2ManageListings: "Чекор 2: Управувајте со листинзите",
    editDeleteManage: "Уредувајте, бришете или управувајте со вашите производи",
    step3TrackOrders: "Чекор 3: Следете ги нарачките",
    trackCustomerPurchases: "Следете ги купувањата на купувачите и ажурирајте го статусот",
    step4TrackPerformance: "Чекор 4: Следете ги перформансите",
    trackPerformanceAnalytics: "Следете ги вашите перформанси и аналитики",
    step5UpdateSettings: "Чекор 5: Ажурирајте ги подесувањата",
    updateProfileBusiness: "Ажурирајте го вашиот профил и бизнис информации",
    privacySettings: "Подесувања за приватност",
    
    // Essential Pages
    essentialPages: "Основни страници:",
    uploadImagesSetPricesWrite: "Прикачи слики, постави цени, напиши описи",
    editDeleteManageProducts: "Уреди, избриши или управувај со производите",
    trackCustomerPurchasesUpdate: "Следи ги купувањата на купувачите и ажурирај го статусот",
    updateProfileBusinessInfo: "Ажурирај го твојот профил и бизнис информации",
    
    // Pro Tips
    proTips: "Про совети:",
    uploadMultipleHighQuality: "Прикачи повеќе висококвалитетни слики на производите",
    writeDetailedHonest: "Напиши детални, искрени описи на производите",
    respondQuicklyToInquiries: "Одговори брзо на прашањата на купувачите",
    keepProductListingsUpdated: "Држи ги листинзите на производите редовно ажурирани",
    setCompetitivePrices: "Постави конкурентни цени",
    chooseAppropriateCategories: "Избери соодветни категории",
    checkOrdersPageRegularly: "Проверувај ја страницата за нарачки редовно",
    updateOrderStatus: "Ажурирај го статусот на нарачката (Процесирано → Испорачано → Доставено)",
    communicateWithCustomers: "Комуницирај со купувачите",
    trackShippingAndDelivery: "Следи ја испораката и доставката",
    handleReturnsIfNeeded: "Управувај со враќањата ако е потребно",
    viewSalesStatistics: "Види ги статистиките за продажба погоре",
    checkProductPerformance: "Провери ги перформансите на производите",
    monitorCustomerFeedback: "Следи го фидбекот од купувачите",
    updateProductListings: "Ажурирај ги листинзите на производите",
    adjustPricingStrategies: "Прилагоди ги стратегиите за цени",
    
    // Quick Reference Guide
    quickReferenceGuide: "📚 Брз водич за референца",
    quickReferenceDescription: "Ви треба помош за да започнете? Еве ги најважните работи што треба да ги знаете за вашата продавачка контролна табла:",
    quickReferenceKeyPoints: "Клучни точки:",
    quickReferenceOrders: "Нарачки - Проверете ги вашите нарачки и ажурирајте го статусот",
    quickReferenceProducts: "Производи - Додавајте и управувајте со вашите листинзи",
    quickReferenceAnalytics: "Аналитика - Следете ги вашите продажби и перформанси",
    quickReferenceSettings: "Подесувања - Конфигурирајте го вашиот профил и претпочитанија",
    quickReferenceSupport: "Поддршка - Достигнете до нашата екипа за помош",
    quickReferenceDocumentation: "Документација - Прочитајте ги нашите водичи и туторијали",
    addProductDescription: "Додај продукт - Прикачи слики, постави цени, напиши описи",
    myListingsDescription: "Мои листинзи - Уреди, избриши или управувај со производите",
    ordersDescription: "Нарачки - Следи ги купувањата на купувачите и ажурирај го статусот",
    settingsDescription: "Подесувања - Ажурирај го профилот и бизнис информациите",
    
    // Notifications
    notifications: "Известувања",
    clearAll: "Исчисти ги сите",
    markAllRead: "Означи ги сите како прочитани",
    noNotifications: "Нема известувања",
    youreAllCaughtUp: "Сите сте во тек! Нови известувања ќе се појават тука.",
    markAsRead: "Означи како прочитано",
    newOrder: "Нова нарачка",
    orderUpdated: "Нарачката е ажурирана",
    productSold: "Продаден продукт",
    paymentReceived: "Плаќањето е примено",
    orderCancelled: "Нарачката е откажана",
    lowStock: "Низок залиха",
    newMessage: "Нова порака",
    systemUpdate: "Системско ажурирање",
    
    // Search Panel
    searchPlaceholder: "Пребарај...",
    searchInProducts: "Пребарај во производи",
    searchInOrders: "Пребарај во нарачки",
    noResultsFound: "Нема резултати",
    tryDifferentKeywords: "Обиди се со различни клучни зборови",
    
    // Zero State Messages
    noProductsListedYet: "Сè уште нема листирани производи",
    startBuildingStore: "Започнете со градење на вашата продавница со додавање на вашиот прв продукт. Листирајте предмети за да започнете со продавање и да достигнете купувачи.",
    noRecentOrders: "Нема неодамнешни нарачки",
    ordersWillAppear: "Нарачките ќе се појават тука кога купувачите ќе започнат да ги купуваат вашите производи. Фокусирајте се на создавање одлични листинзи за да привлечете купувачи.",
    promoteProducts: "Промовирај производи",
    analyticsDataComingSoon: "Аналитички податоци наскоро",
    onceYouStartSelling: "Кога ќе започнете со продавање, ќе видите детални аналитики за вашите перформанси, трендови на продажба и увид за купувачите.",
    addProducts: "Додај производи",
    noEarningsYet: "Сè уште нема заработка",
    earningsWillAppear: "Вашата заработка ќе се појави тука кога ќе ја направите вашата прва продажба. Започнете со листирање производи и привлекување купувачи.",
    viewEarnings: "Види заработка",
    startSelling: "Започни со продавање",
    noViewsYet: "Сè уште нема прегледи",
    productViewsWillAppear: "Прегледите на производите ќе се појават тука кога купувачите ќе започнат да ги прегледуваат вашите листинзи. Оптимизирајте ги описите и фотографиите на производите за да привлечете повеќе посетители.",
    optimizeListings: "Оптимизирај листинзи",
    addMoreProducts: "Додај повеќе производи",
    trackProductsThroughSalesFunnel: "Следете ги вашите производи низ продажниот процес",
    manageListings: "Управувај со листинзи",
    
    // Quick Actions
    addNewProduct: "Додај нов продукт",
    viewAllListings: "Види ги сите листинзи",
    manageOrders: "Управувај со нарачки",
    updateProfile: "Ажурирај профил",
    
    // Dashboard Zero State
    welcomeToSellerDashboard: "Добредојдовте во вашиот продавачки панел",
    readyToStart: "Подготвени сте! Започнете да ја градите вашата продавница со додавање на вашиот прв производ. Откако ќе ги наведете производите, ќе ги видите нарачките тука.",
    quickStartChecklist: "Листа за брзо започнување:",
    addFirstProduct: "Додајте го вашиот прв производ",
    setupPaymentMethods: "Поставете методи за плаќање",
    promoteYourStore: "Започнете да ја промовирате вашата продавница",
    addYourFirstProduct: "Додајте Го Вашиот Прв Производ",
    
    // Orders Empty State
    noOrdersFound: "Не се пронајдени нарачки",
    tryAdjustingFilters: "Обидете се да ги прилагодите критериумите за пребарување или филтер",
    noOrdersYetMessage: "Сè уште немате нарачки",
    
    // Zero States
    noOrdersYet: "Сè уште нема нарачки",
    noProductsYet: "Сè уште нема производи",
    getStartedByAdding: "Започнете со додавање на вашиот прв продукт",
    
    // Common Actions
    viewAll: "Види ги сите",
    edit: "Уреди",
    delete: "Избриши",
    save: "Зачувај",
    cancel: "Откажи",
    loading: "Се вчитува...",
    error: "Грешка",
    success: "Успех",
    
    // Brand dropdown
    searchBrands: "Пребарај брендови...",
    addCustomBrand: "Додај сопствен бренд",
    brandNameRules: "Името на брендот ќе биде автоматски форматирано со правилна капитализација.",
    addBrand: "Додај бренд",
    adding: "Се додава...",
    noBrandsFound: "Не се пронајдени брендови",
    noBrandsAvailable: "Нема достапни брендови",
    
    // Time references
    today: "Денес",
    yesterday: "Вчера",
    lastMonth: "Последниот месец",
    lastWeek: "Последната недела",
    
    // Currency
    currency: "MKD",
    price: "Цена",
    subtotal: "Субтотал",
    
    // Status indicators
    published: "Објавено",
    
    // Form validation
    required: "Задолжително",
    optional: "Опционално",
    invalidEmail: "Невалидна е-пошта",
    invalidPhone: "Невалиден телефон",
    minLength: "Минимална должина",
    maxLength: "Максимална должина",
    
    // My Listings page
    productListings: "Листинзи на производи",
    manageProductInventory: "Управувај со инвентарот на производите",
    searchProducts: "Пребарај производи...",
    newestFirst: "Најнови први",
    oldestFirst: "Најстари први",
    priceHighToLow: "Цена: Висока до ниска",
    priceLowToHigh: "Цена: Ниска до висока",
    mostViewed: "Најгледани",
    noImage: "Нема слика",
    editProduct: "Уреди продукт",
    noProductsFound: "Не се пронајдени производи",
    tryAdjustingSearch: "Обиди се да ги прилагодиш критериумите за пребарување",
    views: "прегледи",
    uncategorized: "Без категорија",
    confirmDeleteProduct: "Дали сте сигурни дека сакате да го избришете овој продукт?",
    
    // Add Product page
    createNewProductListing: "Создај нов листинг на продукт",
    productDetails: "Детали за производот",
    enterProductName: "Внеси име на продукт",
    describeYourProduct: "Опиши го твојот продукт",
    productImages: "Слики на производот",
    uploadUpToImages: "Прикачи до {count} слики. Кликни за да избереш датотеки.",
    clickToUpload: "Кликни за да прикачиш",
    uploading: "Се прикачува...",
    pngJpgGifUpTo5MB: "PNG, JPG, GIF до 5MB секоја",
    noImagesUploadedYet: "Сè уште нема прикачени слики",
    atLeastOneImageRequired: "Потребна е најмалку една слика",
    priceMKD: "Цена (МКД)",
    category: "Категорија",
    selectCategory: "Избери категорија за твојот продукт",
    excellent: "Одлично",
    good: "Добро",
    fair: "Пристојно",
    poor: "Со мали траги",
    sizePlaceholder: "на пр. M, L, XL, 42",
    brandPlaceholder: "на пр. Nike, Zara, Calvin Klein, Друго",
    creating: "Се објавува...",
    createProduct: "Објави продукт",
    pleaseUploadAtLeastOneImage: "Ве молиме прикачете најмалку една слика за вашиот продукт",
    pleaseProvideBrand: "Ве молиме наведете бренд за вашиот продукт",
    productCreatedSuccessfully: "Продуктот е успешно објавен!",
    failedToCreateProduct: "Неуспешно објавување на продукт. Обидете се повторно.",
    
    // Form field labels
    productName: "Име на продукт",
    description: "Опис",
    condition: "Состојба",
    size: "Големина",
    brand: "Бренд",
    requestNewBrand: "Побарај нов бренд",
    enterBrandName: "Внесете име на бренд",
    request: "Побарај",
    quantity: "Количина",
    status: "Статус",
    active: "Достапен",
    draft: "Драфт",
    inactive: "Скриен",
    sold: "Продаден",
    
    // User-friendly status labels
    statusAvailable: "Достапен",
    statusDraft: "Драфт",
    statusHidden: "Скриен", 
    statusSold: "Продаден",
    allStatus: "Сите статуси",
    
    // Category selector labels
    mainCategory: "Главна категорија",
    subcategory: "Подкатегорија",
    type: "Тип",
    selectMainCategory: "Избери главна категорија",
    selectSubcategory: "Избери подкатегорија (опционално)",
    selectType: "Избери тип (опционално)",
    none: "Нема",
    selected: "Избрано",
    
    // Shoe types - Women's
    heels: "Петици",
    flats: "Равни обувки",
    sneakers: "Патики",
    boots: "Чизми",
    sandals: "Сандали",
    
    // Shoe types - Men's
    dressshoes: "Формални обувки",
    loafers: "Лофери",
    
    // Shoe types - General
    shoes: "Обувки",
    
    // Orders page
    manageCustomerOrders: "Управувај со нарачките на купувачите",
    trackFulfillment: "Следи ги испораките",
    manageAndTrackOrders: "Управувај и следи ги нарачките на купувачите",
    ordersCount: "нарачки",
    itemsSold: "продадени предмети",
    searchOrders: "Пребарај нарачки...",
    allOrders: "Сите нарачки",
    orderId: "ID на нарачка",
    customer: "Купувач",
    product: "Производ",
    total: "Вкупно",
    date: "Датум",
    actions: "Акции",
    viewDetails: "Види детали",
    updateStatus: "Ажурирај статус",
    downloadInvoice: "Преземи фактура",
    orderDetails: "Детали за нарачката",
    orderDate: "Датум на нарачката",
    customerInformation: "Информации за купувачот",
    shippingAddress: "Адреса за испорака",
    orderNotes: "Белешки за нарачката",
    productsInThisOrder: "Производи во оваа нарачка",
    unitPrice: "Цена по единица",
    totalPrice: "Вкупна цена",
    orderSummary: "Резиме на нарачката",
    numberOfItems: "Број на предмети",
    paymentMethod: "Начин на плаќање",
    totalAmount: "Вкупна сума",
    generatedOn: "Генерирано на",
    errorGeneratingPDF: "Грешка при генерирање на PDF. Обидете се повторно.",
    address: "Адреса",
    cityPostalCode: "Град и поштенски код",
    unknownProduct: "Непознат продукт",
    unknown: "Непознато",
    
    // Payouts page
    manageEarnings: "Управувај со заработката",
    paymentSettings: "Подесувања за плаќање",
    payoutsComingSoon: "Исплатите доаѓаат наскоро",
    workingOnPayoutSystem: "Работиме на целосно нов систем кој ќе ви овозможи целосна контрола и транспарентност врз вашите приходи. Без повеќе неизвесности - сè што ви е потребно за управување со исплати ќе биде на едно место.",
    whatsComing: "Што следи:",
    realTimeEarningsTracking: "Следење на заработката во реално време",
    multiplePaymentMethods: "Повеќе начини на плаќање",
    automatedPayoutScheduling: "Автоматско закажување на исплати",
    detailedTransactionHistory: "Детална историја на трансакции",
    taxReportingTools: "Алатки за даночно пријавување",

  },
  en: {
    // Navigation
    dashboard: "Dashboard",
    myListings: "My Listings",
    addProduct: "Add Product",
    orders: "Orders",
    payouts: "Payouts",
    settings: "Settings",
    logout: "Logout",
    
    // Roles
    seller: "Seller",
    admin: "Admin",
    
    // Back button
    back: "Back",
    backToDashboard: "Back to Dashboard",
    
    // Common messages
    pleaseWait: "Please wait...",
    
    // Save states
    saved: "Saved",
    
    // Sidebar specific
    sellerDashboard: "Seller Dashboard",
    navigation: "Navigation",
    mainMenu: "Main Menu",
    account: "Account",
    mobileMenu: "Mobile Menu",
    closeMenu: "Close Menu",
    quickActions: "Quick Actions",
    manageStore: "Manage Store",
    
    // Dashboard Overview
    storeOverview: "Store Overview",
    keyMetrics: "Key metrics for your store performance",
    totalListings: "Total Listings",
    itemsSoldThisMonth: "Items Sold (This Month)",
    totalEarnings: "Total Earnings",
    totalOrders: "Total Orders",
    totalProducts: "Total Products",
    conversion: "conversion",
    fromLastPeriod: "from last period",
    noChange: "No change",
    thisWeek: "this week",
    fromLastMonth: "from last month",
    thisMonth: "this month",
    
    // Greetings
    goodMorning: "Hello",
    goodAfternoon: "Hello",
    goodEvening: "Hello",
    welcomeBack: "Welcome back",
    manageYourStore: "Manage your store",
    
    // Recent Orders
    recentOrders: "Recent Orders",
    latestCustomerOrders: "Latest customer orders and their status",
    markAsProcessing: "Mark as Processing",
    markAsShipped: "Mark as Shipped",
    markAsDelivered: "Mark as Delivered",
    viewAllOrders: "View all orders",
    
    // Order Status
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    
    
    // Settings
    sellerProfile: "Seller Profile",
    manageSellerProfile: "Manage your seller profile and business information",
    profilePicture: "Profile Picture",
    clickCameraIcon: "Click the camera icon to upload a new picture",
    personalInformation: "Personal Information",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    email: "Email",
    enterEmail: "Enter your email",
    phone: "Phone",
    enterPhoneNumber: "Enter your phone number",
    location: "Location",
    enterLocation: "Enter your location",
    bio: "Bio",
    tellCustomersAboutYourself: "Tell customers about yourself...",
    website: "Website",
    businessInformation: "Business Information",
    businessName: "Business Name",
    enterBusinessName: "Enter business name",
    businessType: "Business Type",
    selectBusinessType: "Select business type",
    individualSeller: "Individual Seller",
    smallBusiness: "Small Business",
    retailer: "Retailer",
    wholesaler: "Wholesaler",
    other: "Other",
    taxId: "Tax ID (Optional)",
    enterTaxId: "Enter tax ID",
    bankAccount: "Bank Account (Optional)",
    enterBankAccountInfo: "Enter bank account info",
    saveProfile: "Save Profile",
    saving: "Saving...",
    
    // Success/Error Messages
    profileUpdatedSuccessfully: "Profile updated successfully!",
    profilePictureUpdated: "Profile picture updated!",
    failedToLoadProfile: "Failed to load profile",
    failedToUpdateProfile: "Failed to update profile",
    failedToUpdateProfilePicture: "Failed to update profile picture",
    pleaseSelectValidImage: "Please select a valid image file",
    imageSizeMustBeLess: "Image size must be less than 5MB",
    
    // Dashboard Guide
    howToUseDashboard: "Ready for new successes?",
    followTheseSteps: "Here's how to quickly and efficiently manage your business on vtoraraka.mk – step by step:",
    yourPathToSuccess: "Your path to successful sales:",
    addNewProductDescription: "Add new product – The faster you publish it, the faster it reaches the right buyer.",
    manageOrdersDescription: "Manage orders – Track them, respond quickly and build trust with every client.",
    trackProductsDescription: "Manage listings – Edit, update and optimize your products for maximum sales.",
    updateProducts: "Update products",
    checkNewOrders: "Check new orders",
    sendPackages: "Send packages",
    reviewEarnings: "Review earnings",
    expertAdvice: "Expert advice:",
    expertAdviceText: "The most successful sellers are those who constantly test, listen to customers and optimize products based on data. Every click means an opportunity for improvement.",
    clickToStart: "Click to start",
    clickToManage: "Click to manage",
    clickToTrack: "Click to track",
    step1AddProducts: "Step 1: Add Products",
    uploadImagesSetPrices: "Upload images, set prices, write descriptions",
    step2ManageListings: "Step 2: Manage Listings",
    editDeleteManage: "Edit, delete, or manage your products",
    step3TrackOrders: "Step 3: Track Orders",
    trackCustomerPurchases: "Track customer purchases and update status",
    step4TrackPerformance: "Step 4: Track Performance",
    trackPerformanceAnalytics: "Track your performance and analytics",
    step5UpdateSettings: "Step 5: Update Settings",
    updateProfileBusiness: "Update your profile and business information",
    privacySettings: "Privacy settings",
    

    // Pro Tips
    proTips: "Pro Tips:",
    uploadMultipleHighQuality: "Upload multiple high-quality product images",
    writeDetailedHonest: "Write detailed, honest product descriptions",
    respondQuicklyToInquiries: "Respond quickly to customer inquiries",
    keepProductListingsUpdated: "Keep your product listings updated regularly",
    setCompetitivePrices: "Set competitive prices",
    chooseAppropriateCategories: "Choose appropriate categories",
    checkOrdersPageRegularly: "Check the Orders page regularly",
    updateOrderStatus: "Update order status (Processing → Shipped → Delivered)",
    communicateWithCustomers: "Communicate with customers",
    trackShippingAndDelivery: "Track shipping and delivery",
    handleReturnsIfNeeded: "Handle returns if needed",
    viewSalesStatistics: "View sales statistics above",
    checkProductPerformance: "Check product performance",
    monitorCustomerFeedback: "Monitor customer feedback",
    updateProductListings: "Update product listings",
    adjustPricingStrategies: "Adjust pricing strategies",
    
    // Quick Reference Guide
    quickReferenceGuide: "📚 Quick Reference Guide",
    quickReferenceDescription: "Need help getting started? Here are the most important things to know about your seller dashboard:",
    quickReferenceKeyPoints: "Key Points:",
    quickReferenceOrders: "Orders - Check your orders and update status",
    quickReferenceProducts: "Products - Add and manage your listings",
    quickReferenceAnalytics: "Analytics - Track your sales and performance",
    quickReferenceSettings: "Settings - Configure your profile and preferences",
    quickReferenceSupport: "Support - Reach out to our team for help",
    quickReferenceDocumentation: "Documentation - Read our guides and tutorials",
    addProductDescription: "Add Product - Upload images, set prices, write descriptions",
    myListingsDescription: "My Listings - Edit, delete, or manage your products",
    ordersDescription: "Orders - Track customer purchases and update status",
    settingsDescription: "Settings - Update your profile and business information",
    
    // Notifications
    notifications: "Notifications",
    clearAll: "Clear all",
    markAllRead: "Mark all read",
    noNotifications: "No notifications",
    youreAllCaughtUp: "You're all caught up! New notifications will appear here.",
    markAsRead: "Mark as read",
    newOrder: "New order",
    orderUpdated: "Order updated",
    productSold: "Product sold",
    paymentReceived: "Payment received",
    orderCancelled: "Order cancelled",
    lowStock: "Low stock",
    newMessage: "New message",
    systemUpdate: "System update",
    
    // Search Panel
    searchPlaceholder: "Search...",
    searchInProducts: "Search in Products",
    searchInOrders: "Search in Orders",
    noResultsFound: "No results found",
    tryDifferentKeywords: "Try different keywords",
    
    // Zero State Messages
    noProductsListedYet: "No products listed yet",
    startBuildingStore: "Start building your store by adding your first product. List items to begin selling and reach customers.",
    noRecentOrders: "No recent orders",
    ordersWillAppear: "Orders will appear here once customers start purchasing your products. Focus on creating great listings to attract buyers.",
    promoteProducts: "Promote Products",
    analyticsDataComingSoon: "Analytics data coming soon",
    onceYouStartSelling: "Once you start selling, you'll see detailed analytics about your performance, sales trends, and customer insights.",
    addProducts: "Add Products",
    noEarningsYet: "No earnings yet",
    earningsWillAppear: "Your earnings will appear here once you make your first sale. Start by listing products and attracting customers.",
    viewEarnings: "View Earnings",
    startSelling: "Start Selling",
    noViewsYet: "No views yet",
    productViewsWillAppear: "Product views will appear here once customers start browsing your listings. Optimize your product descriptions and photos to attract more visitors.",
    optimizeListings: "Optimize Listings",
    addMoreProducts: "Add More Products",
    trackProductsThroughSalesFunnel: "Track your products through the sales funnel",
    manageListings: "Manage Listings",
    
    // Quick Actions
    addNewProduct: "Add New Product",
    viewAllListings: "View All Listings",
    manageOrders: "Manage Orders",
    updateProfile: "Update Profile",
    
    // Dashboard Zero State
    welcomeToSellerDashboard: "Welcome to your Seller Dashboard",
    readyToStart: "You're all set! Start building your store by adding your first product. Once you list products, you'll see orders come in here.",
    quickStartChecklist: "Quick Start Checklist:",
    addFirstProduct: "Add your first product",
    setupPaymentMethods: "Set up payment methods",
    promoteYourStore: "Start promoting your store",
    addYourFirstProduct: "Add Your First Product",
    
    // Orders Empty State
    noOrdersFound: "No orders found",
    tryAdjustingFilters: "Try adjusting your search or filter criteria",
    noOrdersYetMessage: "You don't have any orders yet",
    
    // Zero States
    noOrdersYet: "No orders yet",
    noProductsYet: "No products yet",
    getStartedByAdding: "Get started by adding your first product",
    
    // Common Actions
    viewAll: "View All",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    
    // Brand dropdown
    searchBrands: "Search brands...",
    addCustomBrand: "Add Custom Brand",
    brandNameRules: "Brand name will be automatically formatted with proper capitalization.",
    addBrand: "Add Brand",
    adding: "Adding...",
    noBrandsFound: "No brands found",
    noBrandsAvailable: "No brands available",
    
    // Time references
    today: "Today",
    yesterday: "Yesterday",
    lastMonth: "Last Month",
    lastWeek: "Last Week",
    
    // Currency
    currency: "MKD",
    price: "Price",
    subtotal: "Subtotal",
    
    // Status indicators
    published: "Published",
    
    // Form validation
    required: "Required",
    optional: "Optional",
    invalidEmail: "Invalid email",
    invalidPhone: "Invalid phone",
    minLength: "Minimum length",
    maxLength: "Maximum length",
    
    // My Listings page
    productListings: "Product Listings",
    manageProductInventory: "Manage your product inventory and listings",
    searchProducts: "Search products...",
    newestFirst: "Newest First",
    oldestFirst: "Oldest First",
    priceHighToLow: "Price: High to Low",
    priceLowToHigh: "Price: Low to High",
    mostViewed: "Most Viewed",
    noImage: "No Image",
    editProduct: "Edit Product",
    noProductsFound: "No products found",
    tryAdjustingSearch: "Try adjusting your search or filter criteria",
    views: "views",
    uncategorized: "Uncategorized",
    confirmDeleteProduct: "Are you sure you want to delete this product?",
    
    // Add Product page
    createNewProductListing: "Create a new product listing",
    productDetails: "Product Details",
    enterProductName: "Enter product name",
    describeYourProduct: "Describe your product",
    productImages: "Product Images",
    uploadUpToImages: "Upload up to {count} images. Click to select files.",
    clickToUpload: "Click to upload",
    uploading: "Uploading...",
    pngJpgGifUpTo5MB: "PNG, JPG, GIF up to 5MB each",
    noImagesUploadedYet: "No images uploaded yet",
    atLeastOneImageRequired: "At least one image is required",
    priceMKD: "Price (MKD)",
    category: "Category",
    selectCategory: "Select a category for your product",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    sizePlaceholder: "e.g., M, L, XL, 42",
    brandPlaceholder: "e.g., Nike, Apple, Samsung, Other",
    creating: "Creating...",
    createProduct: "Create Product",
    pleaseUploadAtLeastOneImage: "Please upload at least one image for your product",
    pleaseProvideBrand: "Please provide a brand for your product",
    productCreatedSuccessfully: "Product created successfully!",
    failedToCreateProduct: "Failed to create product. Please try again.",
    
    // Form field labels
    productName: "Product Name",
    description: "Description",
    condition: "Condition",
    size: "Size",
    brand: "Brand",
    requestNewBrand: "Request new brand",
    enterBrandName: "Enter brand name",
    request: "Request",
    quantity: "Quantity",
    status: "Status",
    active: "Available",
    draft: "Draft",
    inactive: "Hidden",
    sold: "Sold",
    
    // User-friendly status labels
    statusAvailable: "Available",
    statusDraft: "Draft",
    statusHidden: "Hidden", 
    statusSold: "Sold",
    allStatus: "All Status",
    
    // Category selector labels
    mainCategory: "Main Category",
    subcategory: "Subcategory",
    type: "Type",
    selectMainCategory: "Select main category",
    selectSubcategory: "Select subcategory (optional)",
    selectType: "Select type (optional)",
    none: "None",
    selected: "Selected",
    
    // Shoe types - Women's
    heels: "Heels",
    flats: "Flats",
    sneakers: "Sneakers",
    boots: "Boots",
    sandals: "Sandals",
    
    // Shoe types - Men's
    dressshoes: "Dress Shoes",
    loafers: "Loafers",
    
    // Shoe types - General
    shoes: "Shoes",
    
    // Orders page
    manageCustomerOrders: "Manage customer orders and track fulfillment",
    trackFulfillment: "Track fulfillment",
    manageAndTrackOrders: "Manage and track your customer orders",
    ordersCount: "orders",
    itemsSold: "items sold",
    searchOrders: "Search orders...",
    allOrders: "All Orders",
    orderId: "Order ID",
    customer: "Customer",
    product: "Product",
    total: "Total",
    date: "Date",
    actions: "Actions",
    viewDetails: "View Details",
    updateStatus: "Update Status",
    downloadInvoice: "Download Invoice",
    orderDetails: "Order Details",
    orderDate: "Order Date",
    customerInformation: "Customer Information",
    shippingAddress: "Shipping Address",
    orderNotes: "Order Notes",
    productsInThisOrder: "Products in this Order",
    unitPrice: "Unit Price",
    totalPrice: "Total Price",
    orderSummary: "Order Summary",
    numberOfItems: "Number of Items",
    paymentMethod: "Payment Method",
    totalAmount: "Total Amount",
    generatedOn: "Generated on",
    errorGeneratingPDF: "Error generating PDF. Please try again.",
    address: "Address",
    cityPostalCode: "City & Postal Code",
    unknownProduct: "Unknown Product",
    unknown: "Unknown",
    
    // Payouts page
    manageEarnings: "Manage your earnings and payment settings",
    paymentSettings: "Payment settings",
    payoutsComingSoon: "Payouts Coming Soon",
    workingOnPayoutSystem: "We're working on a completely new system that will give you full control and transparency over your income. No more uncertainties - everything you need to manage payouts will be in one place.",
    whatsComing: "What's Coming:",
    realTimeEarningsTracking: "Real-time earnings tracking",
    multiplePaymentMethods: "Multiple payment methods",
    automatedPayoutScheduling: "Automated payout scheduling",
    detailedTransactionHistory: "Detailed transaction history",
  }
};

export default function DashboardLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("mk");

  const toggleLanguage = () => {
    const newLanguage = language === "mk" ? "en" : "mk";
    console.log("Toggling dashboard language from", language, "to", newLanguage);
    setLanguage(newLanguage);
    localStorage.setItem("dashboardLanguage", newLanguage);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("dashboardLanguage");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "mk")) {
      setLanguage(savedLanguage);
    } else {
      // Default to Macedonian
      setLanguage("mk");
      localStorage.setItem("dashboardLanguage", "mk");
    }
  }, []);

  const t = (key: string) => {
    return (dashboardTranslations as Record<string, Record<string, string>>)[language][key] || key;
  };

  // Helper function to translate category names
  const translateCategory = (categoryName: string) => {
    if (!categoryName) return categoryName;

    // Force translation for Women category - this should always work
    if (categoryName === "Women" && language === "mk") {
      return "Жени";
    }

    // Convert category name to translation key
    const translationKey = categoryName
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");

    return (dashboardTranslations as Record<string, Record<string, string>>)[language][translationKey] || categoryName;
  };

  const value = {
    language,
    toggleLanguage,
    t,
    translateCategory,
    // Add a key to force re-render when language changes
    languageKey: `${language}-${Date.now()}`,
    // Force re-render trigger
    forceUpdate: Date.now(),
  };

  return (
    <DashboardLanguageContext.Provider value={value}>
      {children}
    </DashboardLanguageContext.Provider>
  );
}

export function useDashboardLanguage() {
  const context = useContext(DashboardLanguageContext);
  if (!context) {
    throw new Error("useDashboardLanguage must be used within a DashboardLanguageProvider");
  }
  return context;
}
