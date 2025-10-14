import { Database } from '@/lib/supabase/supabase.types';

// Base category type from database
export type Category = Database['public']['Tables']['categories']['Row'];

// Category hierarchy view type
export type CategoryHierarchy = Database['public']['Views']['category_hierarchy']['Row'];

// Extended category with children for frontend use
export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  parent?: CategoryWithChildren;
  path?: string[];
}

// Category tree structure for navigation
export interface CategoryTree {
  mainCategories: CategoryWithChildren[];
  subcategories: { [parentId: string]: CategoryWithChildren[] };
  types: { [parentId: string]: CategoryWithChildren[] };
}

// Category filter options
export interface CategoryFilter {
  mainCategory?: string;
  subcategory?: string;
  type?: string;
  categoryId?: string;
  brand?: string;
}

// Brand mapping for categories
export interface BrandMapping {
  [categoryId: string]: string[];
}

// Popular brands by category - Available in North Macedonia
export const BRAND_MAPPINGS: BrandMapping = {
  // Women's Fashion
  'women': ['Zara', 'H&M', 'Bershka', 'Pull & Bear', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'U.S. Polo Assn.', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Levi\'s', 'Guess', 'Pierre Cardin', 'Bugatti', 'Other (Друго)'],
  'women-clothing': ['Zara', 'H&M', 'Bershka', 'Pull & Bear', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'U.S. Polo Assn.', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Guess', 'Pierre Cardin', 'Bugatti', 'Fashion Group Macedonia', 'Other (Друго)'],
  'women-clothing-wedding-dresses': ['Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Zara', 'H&M', 'Bershka', 'Guess', 'Pierre Cardin', 'Bugatti', 'U.S. Polo Assn.', 'Other (Друго)'],
  'women-shoes': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Clarks', 'Gabor', 'Ara', 'IMAC', 'Ciciban', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Other (Друго)'],
  'women-bags': ['Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'U.S. Polo Assn.', 'Other (Друго)'],
  'women-jewelry': ['Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'women-beauty': ['Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'U.S. Polo Assn.', 'Other (Друго)'],
  
  // Men's Fashion
  'men': ['Zara', 'H&M', 'Bershka', 'Pull & Bear', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'U.S. Polo Assn.', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Levi\'s', 'Guess', 'Pierre Cardin', 'Bugatti', 'Other (Друго)'],
  'men-clothing': ['Zara', 'H&M', 'Bershka', 'Pull & Bear', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'U.S. Polo Assn.', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Guess', 'Pierre Cardin', 'Bugatti', 'Under Armour', 'Other (Друго)'],
  'men-shoes': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Fly Flot', 'Other (Друго)'],
  'men-bags': ['Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'U.S. Polo Assn.', 'Under Armour', 'Other (Друго)'],
  'men-watches': ['Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Under Armour', 'Other (Друго)'],
  'men-grooming': ['Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Under Armour', 'Other (Друго)'],
  
  // Kids
  'kids': ['H&M Kids', 'Zara Kids', 'Nike Kids', 'Adidas Kids', 'Puma Kids', 'Reebok Kids', 'Skechers Kids', 'Levi\'s Kids', 'Guess Kids', 'Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Ciciban', 'Planika', 'Alpina', 'Valdrin Sahiti', 'Sara Fashion', 'Other (Друго)'],
  'kids-clothing': ['H&M Kids', 'Zara Kids', 'Nike Kids', 'Adidas Kids', 'Puma Kids', 'Reebok Kids', 'Levi\'s Kids', 'Guess Kids', 'Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Bastet Noir', 'Hugo Boss', 'Dolce & Gabbana', 'Other (Друго)'],
  'kids-shoes': ['Nike Kids', 'Adidas Kids', 'Puma Kids', 'Reebok Kids', 'Skechers Kids', 'Ciciban', 'Planika', 'Alpina', 'Ara', 'IMAC', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Fly Flot', 'Zen', 'Stefano', 'Other (Друго)'],
  'kids-toys': ['LEGO', 'Mattel', 'Hasbro', 'Fisher-Price', 'Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Barbie', 'Hot Wheels', 'Nerf', 'Play-Doh', 'Monopoly', 'Scrabble', 'Risk', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Other (Друго)'],
  'kids-books': ['Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Dr. Seuss', 'Eric Carle', 'Mo Willems', 'J.K. Rowling', 'Roald Dahl', 'Beatrix Potter', 'A.A. Milne', 'Maurice Sendak', 'Shel Silverstein', 'Judy Blume', 'Beverly Cleary', 'Laura Ingalls Wilder', 'L.M. Montgomery', 'C.S. Lewis', 'Other (Друго)'],
  'kids-accessories': ['H&M Kids', 'Zara Kids', 'Nike Kids', 'Adidas Kids', 'Puma Kids', 'Reebok Kids', 'Levi\'s Kids', 'Guess Kids', 'Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Bastet Noir', 'Hugo Boss', 'Dolce & Gabbana', 'Other (Друго)'],
  
  // Accessories
  'accessories': ['Zara', 'H&M', 'Bershka', 'Pull & Bear', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'U.S. Polo Assn.', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Guess', 'Pierre Cardin', 'Bugatti', 'Other (Друго)'],
  'accessories-bags': ['Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'U.S. Polo Assn.', 'Other (Друго)'],
  'accessories-jewelry': ['Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'accessories-sunglasses': ['Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'accessories-scarves': ['Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'U.S. Polo Assn.', 'Other (Друго)'],
  'accessories-belts': ['Zara', 'H&M', 'Bershka', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'U.S. Polo Assn.', 'Other (Друго)'],
  
  // Shoes
  'shoes': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Clarks', 'Gabor', 'Ara', 'IMAC', 'Ciciban', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Other (Друго)'],
  'sneakers': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Fly Flot', 'Other (Друго)'],
  'boots': ['Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Fly Flot', 'Zen', 'Stefano', 'Nicola Benson', 'Paar', 'Nike', 'Other (Друго)'],
  'sandals': ['Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Fly Flot', 'Zen', 'Stefano', 'Nicola Benson', 'Paar', 'Nike', 'Other (Друго)'],
  'heels': ['Clarks', 'Gabor', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Fly Flot', 'Zen', 'Stefano', 'Nicola Benson', 'Paar', 'Other (Друго)'],
  'flats': ['Clarks', 'Gabor', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Fly Flot', 'Zen', 'Stefano', 'Nicola Benson', 'Paar', 'Other (Друго)'],
  
  // Home
  'home': ['IKEA', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Bastet Noir', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Zara', 'H&M', 'Bershka', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'furniture': ['IKEA', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Bastet Noir', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Zara', 'H&M', 'Bershka', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'decor': ['IKEA', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Bastet Noir', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Zara', 'H&M', 'Bershka', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'kitchen': ['IKEA', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Bastet Noir', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Zara', 'H&M', 'Bershka', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'bedroom': ['IKEA', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Bastet Noir', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Zara', 'H&M', 'Bershka', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'living-room': ['IKEA', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Bastet Noir', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Zara', 'H&M', 'Bershka', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'garden': ['IKEA', 'Valdrin Sahiti', 'Sara Fashion', 'Fashion Group Macedonia', 'Bastet Noir', 'Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Zara', 'H&M', 'Bershka', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  
  // Electronics
  'electronics': ['Apple', 'Samsung', 'Google', 'Microsoft', 'Sony', 'LG', 'Panasonic', 'Canon', 'Nikon', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Motorola', 'Nokia', 'HTC', 'BlackBerry', 'TCL', 'Alcatel', 'Other (Друго)'],
  'phones': ['Apple', 'Samsung', 'Google', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Sony', 'LG', 'Motorola', 'Nokia', 'HTC', 'BlackBerry', 'TCL', 'Alcatel', 'ZTE', 'OnePlus', 'Nothing', 'Fairphone', 'Other (Друго)'],
  'laptops': ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Microsoft', 'Samsung', 'LG', 'Huawei', 'Xiaomi', 'OnePlus', 'Sony', 'Motorola', 'Nokia', 'HTC', 'BlackBerry', 'TCL', 'Alcatel', 'Other (Друго)'],
  'tablets': ['Apple', 'Samsung', 'Google', 'Microsoft', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Sony', 'LG', 'Motorola', 'Nokia', 'HTC', 'BlackBerry', 'TCL', 'Alcatel', 'OnePlus', 'Nothing', 'Fairphone', 'Other (Друго)'],
  'cameras': ['Canon', 'Nikon', 'Sony', 'Panasonic', 'Olympus', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Motorola', 'Nokia', 'HTC', 'BlackBerry', 'TCL', 'Alcatel', 'Apple', 'Samsung', 'Google', 'Microsoft', 'Other (Друго)'],
  'audio': ['Sony', 'LG', 'Panasonic', 'Canon', 'Nikon', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Motorola', 'Nokia', 'HTC', 'BlackBerry', 'TCL', 'Alcatel', 'Apple', 'Samsung', 'Google', 'Microsoft', 'Other (Друго)'],
  'gaming': ['Sony', 'Microsoft', 'Nintendo', 'Samsung', 'LG', 'Panasonic', 'Canon', 'Nikon', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Motorola', 'Nokia', 'HTC', 'BlackBerry', 'TCL', 'Alcatel', 'Apple', 'Other (Друго)'],
  
  // Books
  'books': ['Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Dr. Seuss', 'Eric Carle', 'Mo Willems', 'J.K. Rowling', 'Roald Dahl', 'Beatrix Potter', 'A.A. Milne', 'Maurice Sendak', 'Shel Silverstein', 'Judy Blume', 'Beverly Cleary', 'Laura Ingalls Wilder', 'L.M. Montgomery', 'C.S. Lewis', 'Other (Друго)'],
  'fiction': ['Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Dr. Seuss', 'Eric Carle', 'Mo Willems', 'J.K. Rowling', 'Roald Dahl', 'Beatrix Potter', 'A.A. Milne', 'Maurice Sendak', 'Shel Silverstein', 'Judy Blume', 'Beverly Cleary', 'Laura Ingalls Wilder', 'L.M. Montgomery', 'C.S. Lewis', 'Other (Друго)'],
  'non-fiction': ['Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Dr. Seuss', 'Eric Carle', 'Mo Willems', 'J.K. Rowling', 'Roald Dahl', 'Beatrix Potter', 'A.A. Milne', 'Maurice Sendak', 'Shel Silverstein', 'Judy Blume', 'Beverly Cleary', 'Laura Ingalls Wilder', 'L.M. Montgomery', 'C.S. Lewis', 'Other (Друго)'],
  'textbooks': ['Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Dr. Seuss', 'Eric Carle', 'Mo Willems', 'J.K. Rowling', 'Roald Dahl', 'Beatrix Potter', 'A.A. Milne', 'Maurice Sendak', 'Shel Silverstein', 'Judy Blume', 'Beverly Cleary', 'Laura Ingalls Wilder', 'L.M. Montgomery', 'C.S. Lewis', 'Other (Друго)'],
  'magazines': ['Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Dr. Seuss', 'Eric Carle', 'Mo Willems', 'J.K. Rowling', 'Roald Dahl', 'Beatrix Potter', 'A.A. Milne', 'Maurice Sendak', 'Shel Silverstein', 'Judy Blume', 'Beverly Cleary', 'Laura Ingalls Wilder', 'L.M. Montgomery', 'C.S. Lewis', 'Other (Друго)'],
  'comics': ['Disney', 'Marvel', 'DC Comics', 'Paw Patrol', 'Peppa Pig', 'Frozen', 'Dr. Seuss', 'Eric Carle', 'Mo Willems', 'J.K. Rowling', 'Roald Dahl', 'Beatrix Potter', 'A.A. Milne', 'Maurice Sendak', 'Shel Silverstein', 'Judy Blume', 'Beverly Cleary', 'Laura Ingalls Wilder', 'L.M. Montgomery', 'C.S. Lewis', 'Other (Друго)'],
  
  // Sports
  'sports': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Under Armour', 'Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Other (Друго)'],
  'fitness': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Under Armour', 'Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Other (Друго)'],
  'running': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Under Armour', 'Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Other (Друго)'],
  'football': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Under Armour', 'Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Other (Друго)'],
  'basketball': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Under Armour', 'Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Other (Друго)'],
  'tennis': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Under Armour', 'Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Other (Друго)'],
  'swimming': ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'Under Armour', 'Clarks', 'Ara', 'IMAC', 'Planika', 'Alpina', 'Obuća Marko', 'Urban Fly', 'Walker Flex', 'Atrai', 'Alberola', 'Girza', 'Legero', 'Fantasy', 'Mubb', 'Other (Друго)'],
  
  // Beauty
  'beauty': ['Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'makeup': ['Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'skincare': ['Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'hair': ['Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'fragrances': ['Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
  'nails': ['Hugo Boss', 'Dolce & Gabbana', 'Emporio Armani', 'Guess', 'Pierre Cardin', 'Bugatti', 'Valdrin Sahiti', 'Sara Fashion', 'Bastet Noir', 'Fashion Group Macedonia', 'Zara', 'H&M', 'Bershka', 'U.S. Polo Assn.', 'Nike', 'Adidas', 'Puma', 'Reebok', 'Levi\'s', 'Pull & Bear', 'Other (Друго)'],
};

// Helper function to get brands for a category
export function getBrandsForCategory(categoryId: string, brandMappings: BrandMapping = BRAND_MAPPINGS): string[] {
  return brandMappings[categoryId] || [];
}

// Helper function to get brands for category hierarchy
export function getBrandsForCategoryHierarchy(
  mainCategory?: string,
  subcategory?: string,
  type?: string,
  brandMappings: BrandMapping = BRAND_MAPPINGS
): string[] {
  // Priority: type > subcategory > mainCategory
  if (type && brandMappings[type]) {
    return brandMappings[type];
  }
  if (subcategory && brandMappings[subcategory]) {
    return brandMappings[subcategory];
  }
  if (mainCategory && brandMappings[mainCategory]) {
    return brandMappings[mainCategory];
  }
  return [];
}

// Category breadcrumb item
export interface CategoryBreadcrumb {
  id: string;
  name: string;
  slug: string;
  level: number;
}

// Category navigation item
export interface CategoryNavItem {
  id: string;
  name: string;
  slug: string;
  level: number;
  children?: CategoryNavItem[];
  isExpanded?: boolean;
}

// Predefined category structure for easy access
export const CATEGORY_LEVELS = {
  MAIN: 0,
  SUBCATEGORY: 1,
  TYPE: 2,
} as const;

export type CategoryLevel = typeof CATEGORY_LEVELS[keyof typeof CATEGORY_LEVELS];

// Category slugs for easy reference
export const CATEGORY_SLUGS = {
  // Main categories
  WOMEN: 'women',
  MEN: 'men',
  KIDS: 'kids',
  ACCESSORIES: 'accessories',
  
  // Women subcategories
  WOMEN_CLOTHING: 'women-clothing',
  WOMEN_SHOES: 'women-shoes',
  WOMEN_BAGS: 'women-bags',
  WOMEN_JEWELRY: 'women-jewelry',
  WOMEN_BEAUTY: 'women-beauty',
  
  // Men subcategories
  MEN_CLOTHING: 'men-clothing',
  MEN_SHOES: 'men-shoes',
  MEN_BAGS: 'men-bags',
  MEN_WATCHES: 'men-watches',
  MEN_GROOMING: 'men-grooming',
  
  // Kids subcategories
  KIDS_CLOTHING: 'kids-clothing',
  KIDS_SHOES: 'kids-shoes',
  KIDS_TOYS: 'kids-toys',
  KIDS_BOOKS: 'kids-books',
  KIDS_ACCESSORIES: 'kids-accessories',
  
  // Accessories subcategories
  ACCESSORIES_BAGS: 'accessories-bags',
  ACCESSORIES_JEWELRY: 'accessories-jewelry',
  ACCESSORIES_SUNGLASSES: 'accessories-sunglasses',
  ACCESSORIES_SCARVES: 'accessories-scarves',
  ACCESSORIES_BELTS: 'accessories-belts',
} as const;

// Helper function to build category path
export function buildCategoryPath(categories: CategoryHierarchy[], categoryId: string): CategoryBreadcrumb[] {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return [];

  const path: CategoryBreadcrumb[] = [];
  let current: CategoryHierarchy | null = category;

  // Build path from bottom to top
  while (current) {
    path.unshift({
      id: current.id,
      name: current.name,
      slug: current.slug,
      level: current.level,
    });

    // Find parent
    if (current && current.parent_id) {
      const parent = categories.find(c => c.id === current!.parent_id);
      current = parent || null;
    } else {
      current = null;
    }
  }

  return path;
}

// Helper function to get category display name with hierarchy
export function getCategoryDisplayName(categories: CategoryHierarchy[], categoryId: string): string {
  const path = buildCategoryPath(categories, categoryId);
  return path.map(c => c.name).join(' > ');
}

// Helper function to check if category is active
export function isCategoryActive(category: Category): boolean {
  return category.is_active;
}

// Helper function to sort categories by level and sort_order
export function sortCategories(categories: Category[]): Category[] {
  return categories.sort((a, b) => {
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    return a.sort_order - b.sort_order;
  });
}
