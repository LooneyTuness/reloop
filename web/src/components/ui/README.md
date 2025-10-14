# Shimmer Loading Components

A collection of shimmer loading components for React applications using Tailwind CSS. These components provide smooth, animated loading states that only affect data-fetching parts of your UI while keeping static content visible immediately.

## Components

### `ShimmerPlaceholder`

A basic shimmer component for text, lines, and simple shapes.

```tsx
import ShimmerPlaceholder from '@/components/ui/ShimmerPlaceholder';

// Basic usage
<ShimmerPlaceholder className="h-4 w-32" />

// Multiple lines
<ShimmerPlaceholder lines={3} />

// Custom styling
<ShimmerPlaceholder
  className="h-8 w-24 rounded-full"
  height="h-8"
  width="w-24"
  rounded={true}
/>
```

**Props:**

- `className?: string` - Additional CSS classes
- `lines?: number` - Number of lines to render (default: 1)
- `height?: string` - Height class (default: 'h-4')
- `width?: string` - Width class (default: 'w-full')
- `rounded?: boolean` - Whether to apply rounded corners (default: true)

### `ShimmerCard`

A pre-built card component with shimmer effects for common card layouts.

```tsx
import { ShimmerCard } from "@/components/ui/ShimmerPlaceholder";

<ShimmerCard className="mb-4" />;
```

### `ShimmerTable`

A table shimmer component for data tables.

```tsx
import { ShimmerTable } from "@/components/ui/ShimmerPlaceholder";

<ShimmerTable rows={5} columns={4} />;
```

**Props:**

- `rows?: number` - Number of table rows (default: 3)
- `columns?: number` - Number of table columns (default: 4)

### `ShimmerMetricCard`

A metric card shimmer for dashboard statistics.

```tsx
import { ShimmerMetricCard } from "@/components/ui/ShimmerPlaceholder";

<ShimmerMetricCard className="mb-6" />;
```

## Usage Patterns

### 1. Simple Data Loading

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then((user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, [userId]);

  return (
    <div className="p-6">
      {/* Static content - always visible */}
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      {/* Dynamic content with shimmer */}
      {isLoading ? (
        <ShimmerPlaceholder className="h-6 w-48" />
      ) : (
        <p className="text-lg">{user?.name}</p>
      )}
    </div>
  );
}
```

### 2. Mixed Static and Dynamic Content

```tsx
function ProductCard({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Static header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Product Details</h3>
        <span className="text-sm text-gray-500">ID: {productId}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Image section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Image</h4>
          {isLoading ? (
            <ShimmerPlaceholder className="h-32 w-full rounded-lg" />
          ) : (
            <img src={product?.image} alt={product?.name} />
          )}
        </div>

        {/* Details section */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Name</h4>
            {isLoading ? (
              <ShimmerPlaceholder className="h-5 w-3/4" />
            ) : (
              <p className="font-semibold">{product?.name}</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Price</h4>
            {isLoading ? (
              <ShimmerPlaceholder className="h-6 w-20" />
            ) : (
              <p className="text-xl font-bold">${product?.price}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Dashboard with Multiple Components

```tsx
function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);

  return (
    <div className="p-6 space-y-6">
      {/* Static header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Refresh
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
          metrics?.map((metric) => <MetricCard key={metric.id} data={metric} />)
        )}
      </div>

      {/* Data table */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {isLoading ? (
          <ShimmerTable rows={5} columns={4} />
        ) : (
          <DataTable data={recentActivity} />
        )}
      </div>
    </div>
  );
}
```

### 4. List with Individual Item Shimmer

```tsx
function ProductList() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  return (
    <div className="space-y-4">
      {isLoading
        ? // Show shimmer cards while loading
          Array.from({ length: 3 }, (_, index) => <ShimmerCard key={index} />)
        : // Show actual data when loaded
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
}
```

## Best Practices

### 1. Keep Static Content Visible

Always render static content (headers, structure, navigation) immediately. Only apply shimmer to dynamic, data-dependent content.

### 2. Match Content Dimensions

Make shimmer placeholders match the approximate size and shape of the actual content to prevent layout shifts.

### 3. Use Appropriate Components

- `ShimmerPlaceholder` for simple text and lines
- `ShimmerCard` for card layouts
- `ShimmerTable` for data tables
- `ShimmerMetricCard` for dashboard metrics

### 4. Consistent Styling

Use consistent shimmer styling across your application by leveraging the built-in classes and props.

### 5. Performance

Shimmer components are lightweight and don't impact performance. They're designed to be used liberally throughout your application.

## Customization

The shimmer animation is defined in `globals.css` and can be customized:

```css
.animate-shimmer {
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

You can adjust the animation duration, colors, and gradient by modifying these CSS rules.

