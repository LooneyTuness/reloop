import { Category, CategoryHierarchy, CategoryFilter } from '@/types/category';

export interface CategoryApiResponse {
  categories: CategoryHierarchy[];
}

export interface ItemsByCategoryResponse {
  items: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  category: CategoryHierarchy | null;
  filters: {
    minPrice: number | null;
    maxPrice: number | null;
    condition: string | null;
    brand: string | null;
    includeSubcategories: boolean;
  };
}

export class CategoryService {
  private static baseUrl = '/api/categories';

  // Get all categories
  static async getCategories(params?: {
    level?: number;
    parentId?: string;
    includeInactive?: boolean;
  }): Promise<CategoryHierarchy[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.level !== undefined) {
      searchParams.append('level', params.level.toString());
    }
    if (params?.parentId) {
      searchParams.append('parent_id', params.parentId);
    }
    if (params?.includeInactive) {
      searchParams.append('include_inactive', 'true');
    }

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data: CategoryApiResponse = await response.json();
    return data.categories;
  }

  // Get a specific category by ID
  static async getCategoryById(id: string): Promise<CategoryHierarchy> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    const data = await response.json();
    return data.category;
  }

  // Get a specific category by slug
  static async getCategoryBySlug(slug: string): Promise<CategoryHierarchy> {
    const categories = await this.getCategories();
    const category = categories.find(c => c.slug === slug);
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    return category;
  }

  // Get main categories (level 0)
  static async getMainCategories(): Promise<CategoryHierarchy[]> {
    return this.getCategories({ level: 0 });
  }

  // Get subcategories for a parent category
  static async getSubcategories(parentId: string): Promise<CategoryHierarchy[]> {
    return this.getCategories({ parentId, level: 1 });
  }

  // Get types for a parent category
  static async getTypes(parentId: string): Promise<CategoryHierarchy[]> {
    return this.getCategories({ parentId, level: 2 });
  }

  // Get items filtered by category
  static async getItemsByCategory(
    categoryId: string,
    options?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      minPrice?: number;
      maxPrice?: number;
      condition?: string;
      brand?: string;
      includeSubcategories?: boolean;
    }
  ): Promise<ItemsByCategoryResponse> {
    const searchParams = new URLSearchParams();
    
    if (options?.page) {
      searchParams.append('page', options.page.toString());
    }
    if (options?.limit) {
      searchParams.append('limit', options.limit.toString());
    }
    if (options?.sortBy) {
      searchParams.append('sort_by', options.sortBy);
    }
    if (options?.sortOrder) {
      searchParams.append('sort_order', options.sortOrder);
    }
    if (options?.minPrice !== undefined) {
      searchParams.append('min_price', options.minPrice.toString());
    }
    if (options?.maxPrice !== undefined) {
      searchParams.append('max_price', options.maxPrice.toString());
    }
    if (options?.condition) {
      searchParams.append('condition', options.condition);
    }
    if (options?.brand) {
      searchParams.append('brand', options.brand);
    }
    if (options?.includeSubcategories !== undefined) {
      searchParams.append('include_subcategories', options.includeSubcategories.toString());
    }

    const url = `/api/items/category/${categoryId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    return response.json();
  }

  // Search categories by name
  static async searchCategories(query: string): Promise<CategoryHierarchy[]> {
    const categories = await this.getCategories();
    return categories.filter(category =>
      category.name.toLowerCase().includes(query.toLowerCase()) ||
      category.slug.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Get category breadcrumb path
  static async getCategoryPath(categoryId: string): Promise<CategoryHierarchy[]> {
    const categories = await this.getCategories();
    const path: CategoryHierarchy[] = [];
    let current = categories.find(c => c.id === categoryId);

    while (current) {
      path.unshift(current);
      if (current.parent_id) {
        current = categories.find(c => c.id === current.parent_id);
      } else {
        current = undefined;
      }
    }

    return path;
  }

  // Create a new category (admin only)
  static async createCategory(categoryData: {
    name: string;
    slug: string;
    description?: string;
    parent_id?: string;
    level?: number;
    sort_order?: number;
  }): Promise<Category> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }

    const data = await response.json();
    return data.category;
  }

  // Update a category (admin only)
  static async updateCategory(
    id: string,
    updates: Partial<{
      name: string;
      slug: string;
      description: string;
      parent_id: string;
      level: number;
      sort_order: number;
      is_active: boolean;
    }>
  ): Promise<Category> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }

    const data = await response.json();
    return data.category;
  }

  // Delete a category (admin only)
  static async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }
  }
}
