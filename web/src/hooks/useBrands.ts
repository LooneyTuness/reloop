import { useQuery } from '@tanstack/react-query';

interface UseBrandsParams {
  categoryId?: string;
  mainCategory?: string;
  subcategory?: string;
  type?: string;
  enabled?: boolean;
}

interface BrandsResponse {
  brands: string[];
  count: number;
}

async function fetchBrands(params: UseBrandsParams): Promise<BrandsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.mainCategory) searchParams.set('mainCategory', params.mainCategory);
  if (params.subcategory) searchParams.set('subcategory', params.subcategory);
  if (params.type) searchParams.set('type', params.type);

  const response = await fetch(`/api/brands?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch brands');
  }
  
  return response.json();
}

export function useBrands({
  categoryId,
  mainCategory,
  subcategory,
  type,
  enabled = true
}: UseBrandsParams) {
  return useQuery({
    queryKey: ['brands', { categoryId, mainCategory, subcategory, type }],
    queryFn: () => fetchBrands({ categoryId, mainCategory, subcategory, type }),
    enabled: enabled && (!!categoryId || !!mainCategory || !!subcategory || !!type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
  });
}
