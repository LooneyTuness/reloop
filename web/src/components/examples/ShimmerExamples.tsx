import React, { useState, useEffect } from 'react';
import ShimmerPlaceholder, { ShimmerCard, ShimmerTable, ShimmerMetricCard } from '@/components/ui/ShimmerPlaceholder';

// Example 1: Simple data loading with shimmer
export function SimpleDataLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData('Hello, World!');
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Simple Data Loader</h2>
      
      {/* Static content - renders immediately */}
      <p className="text-gray-600 mb-4">This text appears immediately</p>
      
      {/* Dynamic content with shimmer */}
      <div className="bg-gray-50 p-4 rounded">
        {isLoading ? (
          <ShimmerPlaceholder className="h-6 w-48" />
        ) : (
          <p className="text-lg font-semibold">{data}</p>
        )}
      </div>
    </div>
  );
}

// Example 2: Card with mixed static and dynamic content
export function ProductCard({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    description: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct({
        name: 'Amazing Product',
        price: 99.99,
        description: 'This is a great product with many features.',
        image: '/placeholder.svg'
      });
      setIsLoading(false);
    }, 1500);
  }, [productId]);

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      {/* Static header - always visible */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Product Details</h3>
        <span className="text-sm text-gray-500">ID: {productId}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Product Image</h4>
          {isLoading ? (
            <ShimmerPlaceholder className="h-48 w-full rounded-lg" />
          ) : (
            <img 
              src={product?.image} 
              alt={product?.name}
              className="h-48 w-full object-cover rounded-lg"
            />
          )}
        </div>

        {/* Details section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Product Name</h4>
            {isLoading ? (
              <ShimmerPlaceholder className="h-6 w-3/4" />
            ) : (
              <p className="text-lg font-semibold">{product?.name}</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Price</h4>
            {isLoading ? (
              <ShimmerPlaceholder className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold text-green-600">${product?.price}</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            {isLoading ? (
              <ShimmerPlaceholder lines={3} />
            ) : (
              <p className="text-gray-600">{product?.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 3: Dashboard with multiple shimmer components
export function DashboardExample() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<{
    totalSales: number;
    totalViews: number;
    conversionRate: number;
  } | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setMetrics({
        totalSales: 12500,
        totalViews: 45000,
        conversionRate: 2.8
      });
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Static header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Refresh Data
        </button>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <ShimmerMetricCard />
            <ShimmerMetricCard />
            <ShimmerMetricCard />
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">💰</span>
                </div>
                <span className="text-sm text-gray-500">Total Sales</span>
              </div>
              <div className="text-2xl font-bold">${metrics?.totalSales.toLocaleString()}</div>
              <div className="text-sm text-green-600">+12% from last month</div>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">👁️</span>
                </div>
                <span className="text-sm text-gray-500">Total Views</span>
              </div>
              <div className="text-2xl font-bold">{metrics?.totalViews.toLocaleString()}</div>
              <div className="text-sm text-blue-600">+8% from last month</div>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">📊</span>
                </div>
                <span className="text-sm text-gray-500">Conversion Rate</span>
              </div>
              <div className="text-2xl font-bold">{metrics?.conversionRate}%</div>
              <div className="text-sm text-purple-600">+0.3% from last month</div>
            </div>
          </>
        )}
      </div>

      {/* Recent activity table */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {isLoading ? (
          <ShimmerTable rows={5} columns={4} />
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Order #12345</span>
              <span className="text-green-600">Completed</span>
              <span className="text-gray-500">2 hours ago</span>
              <span className="font-semibold">$99.99</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Order #12344</span>
              <span className="text-blue-600">Processing</span>
              <span className="text-gray-500">4 hours ago</span>
              <span className="font-semibold">$149.99</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Example 4: List with shimmer for individual items
export function ProductList() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Array<{
    id: string;
    name: string;
    price: number;
    status: string;
  }>>([]);

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: '1', name: 'Product A', price: 29.99, status: 'Active' },
        { id: '2', name: 'Product B', price: 49.99, status: 'Active' },
        { id: '3', name: 'Product C', price: 19.99, status: 'Inactive' },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      
      <div className="space-y-4">
        {isLoading ? (
          // Show shimmer cards while loading
          Array.from({ length: 3 }, (_, index) => (
            <ShimmerCard key={index} />
          ))
        ) : (
          // Show actual data when loaded
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                product.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {product.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

