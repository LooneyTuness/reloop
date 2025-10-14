// Test script to verify category translations
// This simulates the translateCategory function logic

const translations = {
  mk: {
    weddingdresses: "Свадбени фустани",
    dressshoes: "Официјални обувки",
    loafers: "Лофери",
    grooming: "Козметички производи"
  },
  en: {
    weddingdresses: "Wedding Dresses", 
    dressshoes: "Dress Shoes",
    loafers: "Loafers",
    grooming: "Grooming"
  }
};

function translateCategory(categoryName, language = 'mk') {
  if (!categoryName) return categoryName;

  // Convert category name to translation key (same logic as in LanguageContext)
  const translationKey = categoryName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  return translations[language][translationKey] || categoryName;
}

// Test cases
console.log('Testing category translations:');
console.log('Wedding Dresses (mk):', translateCategory('Wedding Dresses', 'mk'));
console.log('Dress Shoes (mk):', translateCategory('Dress Shoes', 'mk'));
console.log('Loafers (mk):', translateCategory('Loafers', 'mk'));
console.log('Grooming (mk):', translateCategory('Grooming', 'mk'));

console.log('\nEnglish versions:');
console.log('Wedding Dresses (en):', translateCategory('Wedding Dresses', 'en'));
console.log('Dress Shoes (en):', translateCategory('Dress Shoes', 'en'));
console.log('Loafers (en):', translateCategory('Loafers', 'en'));
console.log('Grooming (en):', translateCategory('Grooming', 'en'));

