# Category System Implementation

This document describes the comprehensive category system implemented for the Reloop e-commerce platform.

## Overview

The category system provides a hierarchical structure for organizing products with three levels:

- **Main Categories** (Level 0): Women, Men, Kids, Accessories
- **Subcategories** (Level 1): Clothing, Shoes, Bags, etc.
- **Types** (Level 2): Dresses, Jackets, Sneakers, etc.

## Database Schema

### Categories Table

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Items Table Updates

- Added `category_id` column linking to categories table
- Maintains backward compatibility with existing `category` string field

## File Structure

```
web/
├── category-migration.sql              # Database migration script
├── run-category-migration.js           # Migration runner script
├── src/
│   ├── types/
│   │   └── category.ts                 # TypeScript types and interfaces
│   ├── contexts/
│   │   └── CategoryContext.tsx         # React context for category state
│   ├── lib/
│   │   └── services/
│   │       └── categoryService.ts      # API service functions
│   ├── components/
│   │   └── category/
│   │       ├── CategoryNavigation.tsx  # Navigation components
│   │       ├── CategoryBreadcrumbs.tsx # Breadcrumb components
│   │       └── CategoryFilter.tsx      # Filter components
│   └── app/
│       ├── api/
│       │   ├── categories/
│       │   │   ├── route.ts            # Categories API endpoints
│       │   │   └── [id]/route.ts       # Individual category endpoints
│       │   └── items/
│       │       └── category/
│       │           └── [categoryId]/
│       │               └── route.ts    # Items by category API
│       ├── catalog/
│       │   ├── page.tsx                # Main catalog page
│       │   └── [slug]/
│       │       └── page.tsx            # Category-specific pages
│       └── seller-dashboard/
│           └── add-product/
│               └── page.tsx            # Updated with category selection
```

## Setup Instructions

### 1. Run Database Migration

```bash
# Navigate to web directory
cd web

# Run the migration helper
node run-category-migration.js

# Copy the SQL from category-migration.sql
# Paste and run in Supabase SQL Editor
```

### 2. Update Supabase Types

The `supabase.types.ts` file has been updated to include:

- `categories` table types
- `category_hierarchy` view types
- Updated `items` table with `category_id` field

### 3. Deploy and Test

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Test the category system
# - Visit /catalog to see all categories
# - Visit /catalog/women to see women's products
# - Try adding a product with category selection
```

## Features

### 1. Category Navigation

- **CategoryNavigation**: Full hierarchical navigation with expand/collapse
- **CategoryNavigationCompact**: Simplified version for mobile
- **CategoryDropdown**: Dropdown version for headers

### 2. Category Filtering

- **CategoryFilter**: Full filtering with main/subcategory/type selection
- **CategoryFilterCompact**: Mobile-optimized single dropdown

### 3. Breadcrumb Navigation

- **CategoryBreadcrumbs**: Full breadcrumb trail
- **CategoryBreadcrumbsCompact**: Mobile version with truncation
- **CategoryBreadcrumbsText**: Simple text version

### 4. API Endpoints

#### Categories API

- `GET /api/categories` - Get all categories
- `GET /api/categories?level=0` - Get main categories only
- `GET /api/categories?parent_id=xxx` - Get subcategories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/[id]` - Update category (admin only)
- `DELETE /api/categories/[id]` - Delete category (admin only)

#### Items by Category API

- `GET /api/items/category/[categoryId]` - Get items filtered by category
- Supports pagination, sorting, and additional filters
- Includes subcategory filtering when requested

### 5. Frontend Pages

#### Catalog Pages

- `/catalog` - Main catalog with all categories
- `/catalog/[slug]` - Category-specific pages (e.g., `/catalog/women`)

#### Product Management

- Updated add product form with hierarchical category selection
- Category context integration

## Usage Examples

### Using Category Context

```tsx
import { useCategory } from "@/contexts/CategoryContext";

function MyComponent() {
  const { categories, categoryTree, getCategoryById, buildCategoryPath } =
    useCategory();

  // Get a specific category
  const womenCategory = getCategoryById("women-category-id");

  // Build breadcrumb path
  const breadcrumbs = buildCategoryPath("dress-category-id");

  return <div>{/* Your component content */}</div>;
}
```

### Using Category Service

```tsx
import { CategoryService } from "@/lib/services/categoryService";

// Get all main categories
const mainCategories = await CategoryService.getMainCategories();

// Get items by category
const items = await CategoryService.getItemsByCategory("category-id", {
  page: 1,
  limit: 20,
  sortBy: "price",
  sortOrder: "asc",
});

// Search categories
const searchResults = await CategoryService.searchCategories("dress");
```

### Using Category Components

```tsx
import CategoryNavigation from "@/components/category/CategoryNavigation";
import CategoryBreadcrumbs from "@/components/category/CategoryBreadcrumbs";
import CategoryFilter from "@/components/category/CategoryFilter";

function ProductPage() {
  const [filter, setFilter] = useState({});

  return (
    <div>
      <CategoryNavigation onCategorySelect={handleCategorySelect} />
      <CategoryBreadcrumbs breadcrumbs={breadcrumbs} />
      <CategoryFilter onFilterChange={setFilter} currentFilter={filter} />
    </div>
  );
}
```

## Predefined Categories

The migration script creates the following category structure:

### Women

- Clothing → Dresses, Tops, Bottoms, Jackets, Activewear, Lingerie
- Shoes → Heels, Flats, Sneakers, Boots, Sandals
- Bags → Handbags, Purses, Totes
- Jewelry → Necklaces, Earrings, Bracelets
- Beauty → Cosmetics, Skincare

### Men

- Clothing → Shirts, T-Shirts, Pants, Shorts, Jackets, Suits
- Shoes → Sneakers, Dress Shoes, Boots, Loafers, Sandals
- Bags → Briefcases, Backpacks, Wallets
- Watches → Digital, Analog, Smartwatches
- Grooming → Shaving, Skincare, Fragrances

### Kids

- Clothing → Tops, Bottoms, Dresses, Outerwear
- Shoes → Sneakers, Boots, Sandals, Dress Shoes
- Toys → Educational, Outdoor, Electronic
- Books → Picture Books, Chapter Books, Educational
- Accessories → Hats, Gloves, Backpacks

### Accessories

- Bags → Handbags, Purses, Totes, Crossbody
- Jewelry → Necklaces, Earrings, Bracelets, Rings
- Sunglasses → Designer, Sport, Prescription
- Scarves → Silk, Wool, Cotton, Infinity
- Belts → Leather, Fabric, Chain, Studded

## Performance Considerations

### Database Indexes

- `idx_categories_parent_id` - For hierarchical queries
- `idx_categories_level` - For level-based filtering
- `idx_categories_slug` - For slug lookups
- `idx_categories_is_active` - For active category filtering
- `idx_items_category_id` - For category-based item queries

### Caching

- Category data is cached in React context
- Consider implementing Redis caching for high-traffic scenarios
- Use Supabase's built-in caching for API responses

### Pagination

- Items are paginated with configurable page sizes
- Default page size: 20 items
- Supports sorting by multiple fields

## Security

### API Security

- Category creation/update/deletion requires admin role
- User authentication required for protected endpoints
- Input validation and sanitization

### Data Validation

- Category slugs must be unique
- Parent-child relationships are validated
- Level constraints prevent invalid hierarchies

## Future Enhancements

### Potential Improvements

1. **Category Images**: Add image support for categories
2. **Category SEO**: Meta descriptions and keywords
3. **Category Analytics**: Track category performance
4. **Dynamic Categories**: Admin interface for category management
5. **Category Recommendations**: AI-powered category suggestions
6. **Multi-language Support**: Localized category names
7. **Category Attributes**: Custom attributes per category
8. **Category Templates**: Predefined category structures

### Performance Optimizations

1. **Lazy Loading**: Load subcategories on demand
2. **Virtual Scrolling**: For large category lists
3. **Search Indexing**: Full-text search on categories
4. **CDN Integration**: Cache category images globally

## Troubleshooting

### Common Issues

1. **Categories not loading**

   - Check if migration was run successfully
   - Verify Supabase connection
   - Check browser console for errors

2. **Category selection not working**

   - Ensure CategoryProvider wraps the component
   - Check if category context is properly initialized
   - Verify category IDs are valid

3. **Items not filtering by category**

   - Check if items have valid category_id values
   - Verify API endpoints are working
   - Check network requests in browser dev tools

4. **Breadcrumbs not showing**
   - Ensure category hierarchy is properly built
   - Check if parent_id relationships are correct
   - Verify category path building logic

### Debug Tools

```tsx
// Enable debug logging
const { categories, categoryTree } = useCategory();
console.log("Categories:", categories);
console.log("Category Tree:", categoryTree);

// Check category hierarchy
const path = buildCategoryPath("category-id");
console.log("Category Path:", path);
```

## Support

For issues or questions about the category system:

1. Check this documentation first
2. Review the code comments
3. Test with the provided examples
4. Check browser console for errors
5. Verify database migration was successful

The category system is designed to be flexible and extensible, allowing for future enhancements while maintaining backward compatibility with existing product data.
