"use client";

import { useState, createContext, useEffect, useContext } from "react";

const LanguageContext = createContext();
const translations = {
  mk: {
    // Navigation
    join: "Регистрирај се",
    Sell: "Продај",
    signOut: "Одјави се",
    signInOnly: "Најави се",
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
      "Додајте производи и вратете се тука за да завршите со нарачката.",
    orderSummary: "Резиме на нарачка",
    subtotal: "Субтотал",
    shipping: "Испорака",
    shippingCalculated: "Ќе се пресмета при плаќање",
    shippingDetails: "Детали за достава",
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

    // Validation Messages
    pleaseFixErrors:
      "Ве молиме поправете ги грешките подолу пред да ја завршите нарачката",
    fullNameRequired: "Името е задолжително",
    fullNameTooShort: "Името мора да има најмалку 2 карактери",
    fullNameTooLong: "Името мора да има помалку од 50 карактери",
    fullNameInvalidChars:
      "Името може да содржи само букви, празни места, цртички, апострофи и точки",
    emailRequired: "E-mail адресата е задолжителна",
    emailInvalid: "Ве молиме внесете валидна e-mail адреса",
    emailTooLong: "E-mail адресата мора да има помалку од 100 карактери",
    phoneRequired: "Телефонскиот број е задолжителен",
    phoneTooShort: "Телефонскиот број мора да има најмалку 8 цифри",
    phoneTooLong: "Телефонскиот број мора да има помалку од 15 цифри",
    phoneInvalid: "Ве молиме внесете валиден телефонски број",
    cityRequired: "Градот е задолжителен",
    cityTooShort: "Градот мора да има најмалку 2 карактери",
    cityTooLong: "Градот мора да има помалку од 50 карактери",
    cityInvalidChars:
      "Градот може да содржи само букви, празни места, цртички, апострофи и точки",
    addressRequired: "Адресата е задолжителна",
    addressTooLong: "Адресата мора да има помалку од 100 карактери",
    addressInvalidChars: "Адресата содржи невалидни карактери",
    additionalAddressTooLong:
      "Додатната адреса мора да има помалку од 100 карактери",
    additionalAddressInvalidChars:
      "Додатната адреса содржи невалидни карактери",
    postalCodeRequired: "Поштенскиот код е задолжителен",
    postalCodeTooShort: "Поштенскиот код мора да има најмалку 3 карактери",
    postalCodeTooLong: "Поштенскиот код мора да има помалку од 10 карактери",
    postalCodeInvalid: "Ве молиме внесете валиден поштенски код",
    notesTooLong: "Забелешките мора да имаат помалку од 500 карактери",
    notesInvalidChars: "Забелешките содржат невалидни карактери",
    characters: "карактери",

    // Trust Badges
    secureCheckout: "Безбедна нарачка",

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
      "Прескокни ја маката од традиционална препродажба. Листај облека инстантно и откриј уникатни парчиња без проблем.",
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
    browseCategories: "Прелистај категории",
    findYourStyle: "Најди го својот стил",
    viewAllCategories: "Види ги сите категории",
    shopByCategory: "Купувај по категорија",
    womensFashion: "Женска мода",
    womensFashionDesc: "Откриј елегантни и трендовски парчиња",
    mensFashion: "Машка мода",
    mensFashionDesc: "Стилска и удобна облека",
    accessories: "Аксесоари",
    accessoriesDesc: "Комплетирај го својот изглед со аксесоари",

    // Additional Category Translations
    allCategories: "Сите категории",
    categories: "Категории",
    filters: "Филтри",
    allProducts: "Сите производи",
    selectCategory: "Избери категорија",
    selectSubcategory: "Избери подкатегорија",
    selectType: "Избери тип",
    selectBrand: "Избери бренд",
    clearFilters: "Исчисти филтри",

    // Product Detail Page
    back: "Назад",
    browseProducts: "Прелистај производи",
    productNotFound: "Продуктот не е пронајден",
    productNotFoundDesc: "Продуктот кој го барате не постои или е отстранет.",
    whyChooseThisItem: "Зошто да го изберете овој предмет?",
    verifiedQuality: "Проверен квалитет и автентичност",
    fastSecureDelivery: "Брза и безбедна достава",

    // Navigation
    menu: "Мени",
    browseItems: "Прелистај парчиња",
    startSelling: "Започни да продаваш",
    settings: "Подесувања",
    language: "Јазик",
    loggedInUser: "Најавен корисник",
    myOrders: "Мои нарачки",
    dashboard: "Продавачки панел",
    viewYourOrderHistory:
      "Погледајте ја вашата историја на нарачки и следете ги вашите купувања",
    viewDetails: "Погледај детали",
    downloadReceipt: "Преземи потврда",
    noOrdersYet: "Сè уште немате направено нарачки",
    signOut: "Одјави се",
    contactSupport: "Контактирај поддршка",
    signIn: "Најави се",

    // Common UI text
    noImage: "Нема слика",
    unnamedProduct: "Неименуван производ",
    noDescription: "Нема опис",
    offRetail: "попуштање од малопродажни цени",
    viewProduct: "Види продукт",
    editProduct: "Уреди продукт",
    checking: "Проверува...",
    checkProfile: "Провери профил",
    clickCheckProfile:
      'Кликни "Провери профил" за да видиш дали твојот профил на продавач постои',
    videoNotSupported: "Вашиот прелистувач не поддржува видео таг.",
    close: "Затвори",
    optional: "опционално",
    cancel: "Откажи",
    tryAgain: "Обиди се повторно",
    notAvailable: "Не е достапно",
    applicationSubmitted: "Апликацијата е успешно поднесена!",
    applicationError: "Грешка при поднесување на апликацијата",
    productDescriptionLabel: "Кажи ни за вашите производи",
    productDescriptionPlaceholder:
      "Опишете што продавате и зошто сакате да се придружите",
    understandsApplicationText:
      "Разбирам дека ова е апликација и не сите барања се прифатени.",
    submittingApplication: "Се поднесува апликацијата...",
    submitApplication: "Поднеси апликација",
    thankYouForApplying: "Благодариме за апликацијата!",
    applicationReceivedMessage:
      "Добивме ја вашата апликација. Нашиот тим ќе ја прегледа вашата апликација и ќе ве контактира ако има соодветност. Следете ја вашата е-пошта!",
    optionalFollowUp: "Дополнителни информации:",
    contactUsIfNoResponse:
      "Ако не слушнете од нас во рок од 7 дена, слободно контактирајте не на",
    browseProducts: "Прегледај производи",
    followUsForLatest: "Следете не за најнови парчиња:",
    collection2025: "Колекција есен - зима 2025",
    collection2025Short: "Колекција 2025",
    sellItems: "Продај парчиња",
    sell: "Продај",
    searchItems: "Пребарај парчиња...",
    applyToSellTitle: "Аплицирај за продавање на vtoraraka.mk",
    yourName: "Вашето име",
    emailPlaceholder: "ваша@е-пошта.com",
    storeNameLabel: "Име на продавница или бренд",
    storeNamePlaceholder: "Име на вашата продавница",
    websiteSocialLabel: "Веб-сајт / Социјални мрежи",
    websiteSocialPlaceholder: "Instagram, веб-сајт, итн.",
    alreadyInvited: "Веќе поканет за продавање?",
    loginToSellerAccount: "Најави се на твојата продавачка сметка тука",
    sellerApplicationDescription:
      "Работиме со селектирани продавачи кои се усогласуваат со нашите вредности и квалитет на производи. Пополни ја формата подолу, и ќе те контактираме ако има соодветност.",

    // Seller Application Form - Additional translations
    sellerApplicationForm: "Форма за апликација за продавач",
    personalInformation: "Лични информации",
    businessInformation: "Бизнис информации",
    productInformation: "Информации за производи",
    fullNameRequired: "Име и презиме *",
    emailAddressRequired: "E-mail адреса *",
    homeNameOrBrand: "Име на продавница или бренд",
    websiteSocialMedia: "Веб-сајт / Социјални мрежи",
    tellUsAboutProducts: "Кажете ни за вашите производи *",
    yourFullName: "Вашето име и презиме",
    yourStoreName: "Име на вашата продавница",
    instagramWebsiteEtc: "Instagram, веб-сајт, итн.",
    describeProductsPlaceholder:
      "Кратко опишете што продавате и зошто сакате да се приклучите на нашата платформа...",
    termsAndConditions:
      "Разбирам дека ова е апликација и не сите барања се прифатени. Се согласувам со условите за користење.",
    submittingApplication: "Се поднесува апликацијата...",
    submitApplication: "Поднеси апликација",
    alreadyInvitedToSell: "Веќе сте поканети за продавање?",
    logInToSellerAccount: "Најави се на твојата продавачка сметка тука",

    loadingProducts: "Се вчитуваат продукти...",
    unableToLoadProducts: "Не можам да ги вчитам продуктите",
    productsLoadError:
      "Има проблем со вчитувањето на продуктите. Ве молиме обидете се повторно.",
    viewAllItems: "Прегледај ги сите парчиња",
    discoverCompleteCollection: "Откриј ја целата колекција",

    // Main Categories
    shoes: "Обувки",
    shoesDesc: "Обувки за секоја прилика",
    home: "Дом",
    homeDesc: "Домашен декор и мебел",
    electronics: "Електроника",
    electronicsDesc: "Телефони, лаптопи и техника",
    books: "Книги",
    booksDesc: "Книги и списанија",
    sports: "Спорт",
    sportsDesc: "Спортска опрема и облека",
    beauty: "Убавина",
    beautyDesc: "Козметика и парфеми",
    kids: "Деца",
    kidsDesc: "Облека и играчки за деца",

    // Common category names that might be in database
    women: "Жени",
    men: "Мажи",
    womens: "Жени",
    mens: "Мажи",
    womensfashion: "Женска мода",
    mensfashion: "Машка мода",
    children: "Деца",
    childrens: "Деца",
    childrensfashion: "Мода за деца",
    kidsfashion: "Мода за деца",
    womenswear: "Женска облека",
    menswear: "Машка облека",
    childrenswear: "Облека за деца",
    kidswear: "Облека за деца",
    womensfashionandaccessories: "Женска мода и аксесоари",
    womensfashionaccessories: "Женска мода и аксесоари",

    // Additional category translations
    clothing: "Облека",
    womensclothing: "Женска облека",
    mensclothing: "Машка облека",
    kidsclothing: "Облека за деца",
    womensshoes: "Обувки за жени",
    mensshoes: "Обувки за мажи",
    kidsshoes: "Обувки за деца",

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
    kidsShoes: "Обувки за деца",
    womensbags: "Торби за жени",
    mensbags: "Торби за мажи",
    womensjewelry: "Накит за жени",
    menswatches: "Часовници за мажи",
    mensgrooming: "Машки козметички производи",
    grooming: "Козметички производи",

    // Subcategories - Women's Fashion
    womensTops: "Топови за жени",
    womensDresses: "Фустани",
    womensBottoms: "Долни делови",
    womensOuterwear: "Надворешна облека",
    womensSwimwear: "Пливачка облека",
    womensActivewear: "Спортска облека за жени",
    womensWeddingDresses: "Свадбени фустани",
    weddingDresses: "Свадбени фустани",
    weddingdresses: "Свадбени фустани",
    womensJackets: "Јакни и палта",

    // Subcategories - Men's Fashion
    mensShirts: "Кошули за мажи",
    mensTshirts: "Т-кошули за мажи",
    mensTops: "Топови за мажи",
    mensPants: "Панталони за мажи",
    mensShorts: "Шорцеви за мажи",
    mensBottoms: "Панталони",
    mensJackets: "Јакни и палта за мажи",
    mensSuits: "Одела за мажи",
    mensOuterwear: "Јакни и палта",
    mensUnderwear: "Долна облека",
    mensSwimwear: "Пливачка облека",

    // Subcategories - Accessories
    bags: "Торби",
    watches: "Часовници",
    jewelry: "Накит",
    sunglasses: "Очила за сонце",
    belts: "Ремени",
    scarves: "Марами и шалови",
    hats: "Капи",

    // Subcategories - Shoes
    womensShoes: "Обувки за жени",
    mensShoes: "Обувки за мажи",
    sneakers: "Патики",
    boots: "Чизми",
    sandals: "Сандали",
    heels: "Штикли",
    flats: "Рамни обувки",
    loafers: "Лофери",
    dressShoes: "Официјални обувки",
    dressshoes: "Официјални обувки",

    // Subcategories - Home
    furniture: "Мебел",
    decor: "Декор",
    kitchen: "Кујна",
    bedroom: "Спална соба",
    livingRoom: "Дневна соба",
    garden: "Градина",

    // Subcategories - Electronics
    phones: "Телефони",
    laptops: "Лаптопи",
    tablets: "Таблети",
    cameras: "Камери",
    audio: "Аудио",
    gaming: "Игри",

    // Subcategories - Books
    fiction: "Фантастика",
    nonFiction: "Документарни",
    textbooks: "Учебници",
    magazines: "Списанија",
    comics: "Стрипови",

    // Subcategories - Sports
    fitness: "Фитнес",
    running: "Трчање",
    football: "Фудбал",
    basketball: "Кошарка",
    tennis: "Тенис",
    swimming: "Пливање",

    // Subcategories - Beauty
    makeup: "Шминка",
    skincare: "Нега на кожа",
    hair: "Коса",
    fragrances: "Парфеми",
    nails: "Нокти",

    // Subcategories - Kids
    babyClothes: "Облека за бебиња",
    kidsClothes: "Облека за деца",
    toys: "Играчки",
    kidsBooks: "Книги за деца",
    kidsShoes: "Обувки за деца",

    // General Fashion Items
    exploreNow: "Истражи сега",
    dresses: "Фустани",
    tops: "Топови",
    bottoms: "Панталони",
    sizes: "Големини",
    styles: "Стилови",
    trends: "Трендови",
    shirts: "Кошули",
    pants: "Панталони",
    jackets: "Јакни",
    casual: "Кежуал",
    formal: "Формално",
    sporty: "Спортски",

    // Additional Fashion Subcategories
    clothing: "Облека",
    skirts: "Сукњи",
    blouses: "Блузи",
    jeans: "Фармерки",
    shorts: "Шорцеви",
    sweaters: "Џемпери",
    hoodies: "Дуксери",
    coats: "Палта",
    blazers: "Блејзери",
    suits: "Одела",
    tshirts: "Маици",
    tanktops: "Топови без ракави",
    leggings: "Леггинси",
    cardigans: "Кардигани",
    polos: "Поло маици",
    chinos: "Чино панталони",
    cargo: "Карго панталони",
    joggers: "Џогери",
    overalls: "Комбинезони",
    activewear: "Спортска облека",
    wedding: "Свадба",
    weddingDresses: "Свадбени фустани",
    formalwear: "Формална облека",
    readyToExplore: "Готови да истражите?",
    discoverAllCategories:
      "Откријте ги сите категории и најдете го совршениот стил",
    browseAllProducts: "Прелистај сите продукти",
    noCategoriesAvailable: "Нема достапни категории",
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
    contactSupport: "Контактирај поддршка",
    alreadyHaveAccount: "Веќе имаш сметка?",
    logInHere: "Најави се тука",
    startSelling: "Започни со продавање",
    createAccountToStartSelling: "Креирај сметка за да започнеш со продавање",
    signInToContinue: "Најави се за да продолжиш",
    signInRequired: "Потребна е најава",
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
    trackOrderStatus: "Следи го статусот на твојата нарачка",
    saveShippingDetails: "Зачувај ги деталите за достава",
    getNotified: "Добивај известувања за нови парчиња",
    // Auth Success Messages
    youreNowSignedIn:
      "Сега сте најавени! Започнете го вашето патување кон одржлива мода.",
    emailConfirmed:
      "Вашата е-пошта е успешно потврдена. Започнете го вашето патување кон одржлива мода сега.",
    readyToMakeDifference: "Спремни сте да направите разлика",
    checkYourEmail: "Провери ја твојата е-пошта",
    magicLinkSent:
      "Испративме магичен линк. Кликнете на него за да се најавите и да започнете.",
    confirmationLinkSent:
      "Испративме потврден мејл. Проверете го вашиот мејл за да ја активирате вашата сметка и да започнете.",
    cantFindEmail: "Не можете да ја најдете е-поштата?",
    cantFindMagicLink: "Не можете да го најдете магичниот линк?",
    checkSpamFolder: "Проверете ја папката за спам",
    waitFewMinutes: "Почекајте неколку минути и обидете се повторно",
    makeSureEmailCorrect: "Проверете дали е-поштата е точна",
    magicLinksExpire: "Магичните линкови истекуваат по 1 час за безбедност",
    browseProductsMeantime: "Разгледајте ги производите во меѓувреме",
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
    footerLocation: "Локација",
    footerLocationText: "Скопје, Македонија",
    footerFollowUs: "Следете не:",
    footerBrandTagline: "Втора рака. Прв избор.",
    footerContactUs: "Контактирајте не",
    footerAboutUs: "За нас",
    footerHelp: "Помош",
    footerPrivacy: "Приватност",
    footerTerms: "Услови",
    footerEmail: "Е-пошта",
    footerPhone: "Телефон",

    // Video Error Messages
    videoUnavailable: "Видео недостижно",
    continueBrowsing: "Продолжете со преглед на содржината",
    pullToRefresh: "Повлечете за освежување",
    backgroundVideoLabel: "Позадинско видео за модна платформа",

    // Home Page
    featuredItems: "Избрани парчиња",
    discoverUniqueFinds: "Откриј уникатни парчиња",
    handpickedSustainable:
      "Рачно избрани одржливи модни парчиња кои заслужуваат втор живот. Секое парче раскажува приказна и помага да се намали модниот отпад.",
    viewAllProducts: "Види ги сите производи",
    noFeaturedProducts: "Моментално нема избрани производи.",
    sustainable: "Одржливо",
    affordable: "Достапно",
    unique: "Уникатно",
    shopSmarter: "Купувај паметно,",
    wasteLess: "троши помалку",
    buyAndSell:
      "Купувај и продавај уникатна облека од втора рака – заработи од твојот плакар и поддржи одржлива мода.",
    saveMoney: "Заштеди пари",
    andThePlanet: "и планетата со секоја нарачка.",
    sustainableFashionMarketplace: "Новите парчиња пристигнаа",
    loadingVideo: "Се вчитува видеото...",

    // Dashboard Status - REMOVED (moved to seller dashboard)

    // Order Completion Messages - REMOVED (moved to seller dashboard)
  },
  en: {
    // Navigation
    join: "Join",
    Sell: "Sell",
    signOut: "Sign Out",
    signInOnly: "Sign In",
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
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    shippingCalculated: "Will be calculated at checkout",
    shippingDetails: "Shipping Details",
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

    // Validation Messages
    pleaseFixErrors: "Please fix the errors below before placing your order",
    fullNameRequired: "Full name is required",
    fullNameTooShort: "Name must be at least 2 characters",
    fullNameTooLong: "Name must be less than 50 characters",
    fullNameInvalidChars:
      "Name can only contain letters, spaces, hyphens, apostrophes, and periods",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    emailTooLong: "Email must be less than 100 characters",
    phoneRequired: "Phone number is required",
    phoneTooShort: "Phone number must be at least 8 digits",
    phoneTooLong: "Phone number must be less than 15 digits",
    phoneInvalid: "Please enter a valid phone number",
    cityRequired: "City is required",
    cityTooShort: "City must be at least 2 characters",
    cityTooLong: "City must be less than 50 characters",
    cityInvalidChars:
      "City can only contain letters, spaces, hyphens, apostrophes, and periods",
    addressRequired: "Address is required",
    addressTooLong: "Address must be less than 100 characters",
    addressInvalidChars: "Address contains invalid characters",
    additionalAddressTooLong:
      "Additional address must be less than 100 characters",
    additionalAddressInvalidChars:
      "Additional address contains invalid characters",
    postalCodeRequired: "Postal code is required",
    postalCodeTooShort: "Postal code must be at least 3 characters",
    postalCodeTooLong: "Postal code must be less than 10 characters",
    postalCodeInvalid: "Please enter a valid postal code",
    notesTooLong: "Notes must be less than 500 characters",
    notesInvalidChars: "Notes contain invalid characters",
    characters: "characters",

    // Trust Badges
    secureCheckout: "Secure Checkout",

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
      "Skip the hassle of traditional resale. Browse clothing instantly and discover unique pieces without problems.",
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
    browseCategories: "Browse Categories",
    findYourStyle: "Find Your Style",
    viewAllCategories: "View All Categories",
    shopByCategory: "Shop by Category",
    womensFashion: "Women's Fashion",
    womensFashionDesc: "Discover elegant and trendy pieces",
    mensFashion: "Men's Fashion",
    mensFashionDesc: "Stylish and comfortable clothing",
    accessories: "Accessories",
    accessoriesDesc: "Complete your look with accessories",

    // Additional Category Translations
    allCategories: "All Categories",
    categories: "Categories",
    filters: "Filters",
    allProducts: "All Products",
    selectCategory: "Select Category",
    selectSubcategory: "Select Subcategory",
    selectType: "Select Type",
    selectBrand: "Select Brand",
    clearFilters: "Clear Filters",

    // Product Detail Page
    back: "Back",
    browseProducts: "Browse Products",
    productNotFound: "Product Not Found",
    productNotFoundDesc:
      "The product you're looking for doesn't exist or has been removed.",
    whyChooseThisItem: "Why choose this item?",
    verifiedQuality: "Verified quality and authenticity",
    fastSecureDelivery: "Fast and secure delivery",

    // Navigation
    menu: "Menu",
    browseItems: "Browse Items",
    startSelling: "Start Selling",
    settings: "Settings",
    language: "Language",
    loggedInUser: "Logged in user",
    myOrders: "My Orders",
    dashboard: "Dashboard",
    viewYourOrderHistory: "View your order history and track your purchases",
    viewDetails: "View Details",
    downloadReceipt: "Download Receipt",
    noOrdersYet: "You haven't placed any orders yet.",
    signOut: "Sign Out",
    contactSupport: "Contact Support",
    signIn: "Sign In",

    // Common UI text
    noImage: "No Image",
    unnamedProduct: "Unnamed Product",
    noDescription: "No Description",
    offRetail: "off retail",
    viewProduct: "View Product",
    editProduct: "Edit Product",
    checking: "Checking...",
    checkProfile: "Check Profile",
    clickCheckProfile:
      'Click "Check Profile" to see if your seller profile exists',
    videoNotSupported: "Your browser does not support the video tag.",
    close: "Close",
    optional: "optional",
    cancel: "Cancel",
    tryAgain: "Try Again",
    notAvailable: "Not Available",
    applicationSubmitted: "Application submitted successfully!",
    applicationError: "Error submitting application",
    productDescriptionLabel: "Tell us about your products",
    productDescriptionPlaceholder:
      "Briefly describe what you sell and why you want to join",
    understandsApplicationText:
      "I understand this is an application and not all requests are accepted.",
    submittingApplication: "Submitting Application...",
    submitApplication: "Submit Application",
    thankYouForApplying: "Thank you for applying!",
    applicationReceivedMessage:
      "We've received your request. Our team will review your application and reach out if there's a fit. Keep an eye on your inbox!",
    optionalFollowUp: "Optional follow-up:",
    contactUsIfNoResponse:
      "If you don't hear from us within 7 days, feel free to contact us at",
    browseProducts: "Browse Products",
    followUsForLatest: "Follow us for the latest pieces:",
    collection2025: "Fall-Winter 2025 Collection",
    collection2025Short: "Collection 2025",
    sellItems: "Sell Items",
    sell: "Sell",
    searchItems: "Search items...",
    applyToSellTitle: "Apply to Sell on vtoraraka.mk",
    yourName: "Your name",
    emailPlaceholder: "you@example.com",
    storeNameLabel: "Store Name or Brand Name",
    storeNamePlaceholder: "Your store name",
    websiteSocialLabel: "Website / Social Media",
    websiteSocialPlaceholder: "Instagram, Website, etc.",
    alreadyInvited: "Already invited to sell?",
    loginToSellerAccount: "Log in to your seller account here",
    sellerApplicationDescription:
      "We work with selected sellers who align with our values and product quality. Fill out the form below, and we'll get in touch if it's a good fit.",

    // Seller Application Form - Additional translations
    sellerApplicationForm: "Seller Application Form",
    personalInformation: "Personal Information",
    businessInformation: "Business Information",
    productInformation: "Product Information",
    fullNameRequired: "Full Name *",
    emailAddressRequired: "Email Address *",
    homeNameOrBrand: "Home Name or Brand Name",
    websiteSocialMedia: "Website / Social Media",
    tellUsAboutProducts: "Tell us about your products *",
    yourFullName: "Your full name",
    yourStoreName: "Your store name",
    instagramWebsiteEtc: "Instagram, Website, etc.",
    describeProductsPlaceholder:
      "Briefly describe what you sell and why you want to join our platform...",
    termsAndConditions:
      "I understand this is an application and not all requests are accepted. I agree to the terms and conditions.",
    submittingApplication: "Submitting Application...",
    submitApplication: "Submit Application",
    alreadyInvitedToSell: "Already invited to sell?",
    logInToSellerAccount: "Log in to your seller account here",

    loadingProducts: "Loading products...",
    unableToLoadProducts: "Unable to load products",
    productsLoadError:
      "There's an issue loading the products. Please try again.",
    viewAllItems: "View All Items",
    discoverCompleteCollection: "Discover our complete collection",

    // Main Categories
    shoes: "Shoes",
    shoesDesc: "Shoes for every occasion",
    home: "Home",
    homeDesc: "Home decor and furniture",
    electronics: "Electronics",
    electronicsDesc: "Phones, laptops and tech",
    books: "Books",
    booksDesc: "Books and magazines",
    sports: "Sports",
    sportsDesc: "Sports equipment and clothing",
    beauty: "Beauty",
    beautyDesc: "Cosmetics and fragrances",
    kids: "Kids",
    kidsDesc: "Clothing and toys for kids",

    // Common category names that might be in database
    women: "Women",
    men: "Men",
    womens: "Women",
    mens: "Men",
    womensfashion: "Women's Fashion",
    mensfashion: "Men's Fashion",
    children: "Children",
    childrens: "Children",
    childrensfashion: "Children's Fashion",
    kidsfashion: "Kids' Fashion",
    womenswear: "Women's Wear",
    menswear: "Men's Wear",
    childrenswear: "Children's Wear",
    kidswear: "Kids' Wear",
    womensfashionandaccessories: "Women's Fashion and Accessories",
    womensfashionaccessories: "Women's Fashion and Accessories",

    // Additional category translations
    clothing: "Clothing",
    womensclothing: "Women's Clothing",
    mensclothing: "Men's Clothing",
    kidsclothing: "Kids' Clothing",
    womensshoes: "Women's Shoes",
    mensshoes: "Men's Shoes",
    kidsShoes: "Kids' Shoes",

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
    womensbags: "Women's Bags",
    mensbags: "Men's Bags",
    womensjewelry: "Women's Jewelry",
    menswatches: "Men's Watches",
    mensgrooming: "Men's Grooming",
    grooming: "Grooming",

    // Subcategories - Women's Fashion
    womensTops: "Women's Tops",
    womensDresses: "Dresses",
    womensBottoms: "Bottoms",
    womensOuterwear: "Outerwear",
    womensSwimwear: "Swimwear",
    womensActivewear: "Women's Activewear",
    womensWeddingDresses: "Wedding Dresses",
    womensJackets: "Jackets & Coats",

    // Subcategories - Men's Fashion
    mensShirts: "Men's Shirts",
    mensTshirts: "Men's T-Shirts",
    mensTops: "Men's Tops",
    mensPants: "Men's Pants",
    mensShorts: "Men's Shorts",
    mensBottoms: "Pants",
    mensJackets: "Men's Jackets",
    mensSuits: "Men's Suits",
    mensOuterwear: "Jackets & Coats",
    mensUnderwear: "Underwear",
    mensSwimwear: "Swimwear",

    // Subcategories - Accessories
    bags: "Bags",
    watches: "Watches",
    jewelry: "Jewelry",
    sunglasses: "Sunglasses",
    belts: "Belts",
    scarves: "Scarves",
    hats: "Hats",

    // Subcategories - Shoes
    womensShoes: "Women's Shoes",
    mensShoes: "Men's Shoes",
    sneakers: "Sneakers",
    boots: "Boots",
    sandals: "Sandals",
    heels: "Heels",
    flats: "Flats",
    loafers: "Loafers",
    dressShoes: "Dress Shoes",
    dressshoes: "Dress Shoes",

    // Subcategories - Home
    furniture: "Furniture",
    decor: "Decor",
    kitchen: "Kitchen",
    bedroom: "Bedroom",
    livingRoom: "Living Room",
    garden: "Garden",

    // Subcategories - Electronics
    phones: "Phones",
    laptops: "Laptops",
    tablets: "Tablets",
    cameras: "Cameras",
    audio: "Audio",
    gaming: "Gaming",

    // Subcategories - Books
    fiction: "Fiction",
    nonFiction: "Non-Fiction",
    textbooks: "Textbooks",
    magazines: "Magazines",
    comics: "Comics",

    // Subcategories - Sports
    fitness: "Fitness",
    running: "Running",
    football: "Football",
    basketball: "Basketball",
    tennis: "Tennis",
    swimming: "Swimming",

    // Subcategories - Beauty
    makeup: "Makeup",
    skincare: "Skincare",
    hair: "Hair",
    fragrances: "Fragrances",
    nails: "Nails",

    // Subcategories - Kids
    babyClothes: "Baby Clothes",
    kidsClothes: "Kids Clothes",
    toys: "Toys",
    kidsBooks: "Kids Books",
    kidsShoes: "Kids Shoes",

    // General Fashion Items
    exploreNow: "Explore Now",
    dresses: "Dresses",
    tops: "Tops",
    bottoms: "Bottoms",
    sizes: "Sizes",
    styles: "Styles",
    trends: "Trends",
    shirts: "Shirts",
    pants: "Pants",
    jackets: "Jackets",
    casual: "Casual",
    formal: "Formal",
    sporty: "Sporty",

    // Additional Fashion Subcategories
    clothing: "Clothing",
    skirts: "Skirts",
    blouses: "Blouses",
    jeans: "Jeans",
    shorts: "Shorts",
    sweaters: "Sweaters",
    hoodies: "Hoodies",
    coats: "Coats",
    blazers: "Blazers",
    suits: "Suits",
    tshirts: "T-Shirts",
    tanktops: "Tank Tops",
    leggings: "Leggings",
    cardigans: "Cardigans",
    polos: "Polo Shirts",
    chinos: "Chinos",
    cargo: "Cargo Pants",
    joggers: "Joggers",
    overalls: "Overalls",
    activewear: "Activewear",
    wedding: "Wedding",
    weddingDresses: "Wedding Dresses",
    weddingdresses: "Wedding Dresses",
    formalwear: "Formal Wear",
    readyToExplore: "Ready to Explore?",
    discoverAllCategories:
      "Discover all categories and find your perfect style",
    browseAllProducts: "Browse All Products",
    noCategoriesAvailable: "No categories available",
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

    // Home Page
    featuredItems: "Featured Items",
    discoverUniqueFinds: "Discover Unique Finds",
    handpickedSustainable:
      "Hand-picked sustainable fashion pieces that deserve a second life. Every piece tells a story and helps reduce fashion waste.",
    viewAllProducts: "View All Products",
    noFeaturedProducts: "No featured products at the moment.",
    sustainable: "Sustainable",
    affordable: "Affordable",
    unique: "Unique",
    shopSmarter: "Shop smart,",
    wasteLess: "waste less",

    buyAndSell:
      "Buy and sell unique second-hand clothing – make money from your closet and support sustainable fashion.",
    saveMoney: "Save money",
    andThePlanet: "and the planet with every purchase.",
    sustainableFashionMarketplace: "The new pieces have arrived",
    loadingVideo: "Loading video...",

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

    contactSupport: "Contact Support",
    alreadyHaveAccount: "Already have an account?",
    logInHere: "Log in here",
    startSelling: "Start Selling",
    createAccountToStartSelling: "Create an account to start selling",
    signInToContinue: "Sign in to continue",
    signInRequired: "Sign In Required",
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
    footerLocation: "Location",
    footerLocationText: "Skopje, Macedonia",
    footerFollowUs: "Follow us:",
    footerBrandTagline: "Second-hand. First choice.",
    footerContactUs: "Contact Us",
    footerAboutUs: "About Us",
    footerHelp: "Help",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerEmail: "Email",
    footerPhone: "Phone",

    // Video Error Messages
    videoUnavailable: "Video unavailable",
    continueBrowsing: "Continue browsing our content",
    pullToRefresh: "Pull to refresh",
    backgroundVideoLabel: "Background video for fashion platform",

    // Home Page
    featuredItems: "Featured Items",
    discoverUniqueFinds: "Discover Unique Finds",
    handpickedSustainable:
      "Hand-picked sustainable fashion pieces that deserve a second life. Every piece tells a story and helps reduce fashion waste.",
    viewAllProducts: "View All Products",
    noFeaturedProducts: "No featured products at the moment.",
    sustainable: "Sustainable",
    affordable: "Affordable",
    unique: "Unique",
    shopSmarter: "Shop smart,",
    wasteLess: "waste less",

    buyAndSell:
      "Buy and sell unique second-hand clothing – make money from your closet and support sustainable fashion.",
    saveMoney: "Save money",
    andThePlanet: "and the planet with every purchase.",
    sustainableFashionMarketplace: "The new pieces have arrived",
    loadingVideo: "Loading video...",

    // Dashboard Status - REMOVED (moved to seller dashboard)

    // Order Completion Messages - REMOVED (moved to seller dashboard)
  },
};

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("mk");

  const toggleLanguage = () => {
    const newLanguage = language === "mk" ? "en" : "mk";
    console.log("Toggling language from", language, "to", newLanguage);
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    // Force a page refresh to ensure all components update
    window.location.reload();
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "mk")) {
      setLanguage(savedLanguage);
    } else {
      // Ensure default is Macedonian
      setLanguage("mk");
      localStorage.setItem("language", "mk");
    }
  }, []);

  const t = (key) => {
    return translations[language][key] || key;
  };

  // Helper function to translate category names
  const translateCategory = (categoryName) => {
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

    return translations[language][translationKey] || categoryName;
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
