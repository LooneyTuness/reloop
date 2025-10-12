# E-commerce Product Lifecycle Workflow Example

# Complete workflow from listing to sale completion

## 🛍️ **Scenario: Customer Buys a Vintage Jacket**

### **Step 1: Vendor Lists Product**

```sql
-- Vendor creates a new product listing
INSERT INTO items (
  id,
  title,
  price,
  photos,
  description,
  user_id,
  status,
  quantity,
  is_active
) VALUES (
  gen_random_uuid(),
  'Vintage Leather Jacket',
  2500,
  '["jacket1.jpg", "jacket2.jpg"]',
  'Beautiful vintage leather jacket in excellent condition',
  'vendor-user-id-123',
  'active',
  1,
  true
);
```

**Result**: Product appears in marketplace with status 'active' and quantity 1

---

### **Step 2: Customer Browses Products**

```sql
-- Customer sees available products
SELECT
  id,
  title,
  price,
  photos,
  status,
  quantity
FROM items
WHERE status = 'active'
  AND quantity > 0
  AND deleted_at IS NULL
ORDER BY created_at DESC;
```

**Frontend Display**:

- ✅ Product shows as "Available" with green badge
- ✅ "Add to Cart" button is enabled
- ✅ Quantity shows "1 available"

---

### **Step 3: Customer Adds to Cart**

```sql
-- System reserves the item (prevents overselling)
SELECT reserve_item('jacket-item-id', 'customer-user-id', 15);
```

**What Happens**:

- Item status changes to 'reserved'
- Quantity decreases to 0
- Reserved until: NOW() + 15 minutes
- Reserved by: customer-user-id

**Frontend Display**:

- 🟡 Product shows as "Reserved" with yellow badge
- ❌ "Add to Cart" button disabled for other customers
- ⏰ Reservation expires in 15 minutes

---

### **Step 4: Customer Completes Checkout**

```sql
-- Order is created
INSERT INTO orders (
  id,
  user_id,
  total_amount,
  payment_method,
  status,
  full_name,
  email,
  phone,
  address_line1,
  city
) VALUES (
  gen_random_uuid(),
  'customer-user-id',
  2500,
  'card',
  'pending',
  'John Doe',
  'john@example.com',
  '+38970123456',
  'Main Street 123',
  'Skopje'
);

-- Order items are created
INSERT INTO order_items (
  order_id,
  item_id,
  quantity,
  price,
  vendor_id
) VALUES (
  'order-id-123',
  'jacket-item-id',
  1,
  2500,
  'vendor-user-id-123'
);
```

**What Happens**:

- Order created with 'pending' status
- Item remains 'reserved' until order completion
- Vendor gets notification of new order

---

### **Step 5: Vendor Marks Order as Completed**

```sql
-- Vendor clicks "Mark as Completed" button
UPDATE orders
SET
  status = 'completed',
  updated_at = NOW()
WHERE id = 'order-id-123';
```

**Automatic Trigger Fires**:

```sql
-- The handle_order_completion() function automatically runs
UPDATE items
SET
  status = 'sold',
  sold_at = NOW(),
  buyer_id = 'customer-user-id',
  reserved_until = NULL,
  reserved_by = NULL,
  is_active = false
WHERE id = 'jacket-item-id';
```

**What Happens**:

- ✅ Order status changes to 'completed'
- ✅ Item status automatically changes to 'sold'
- ✅ Item disappears from marketplace
- ✅ Customer gets completion notification
- ✅ Vendor sees item in "Sold Items" section

---

### **Step 6: Product Lifecycle Complete**

```sql
-- Check final product status
SELECT
  title,
  status,
  quantity,
  sold_at,
  buyer_id,
  is_active
FROM items
WHERE id = 'jacket-item-id';
```

**Result**:

```
title: "Vintage Leather Jacket"
status: "sold"
quantity: 0
sold_at: "2024-01-15 14:30:00"
buyer_id: "customer-user-id"
is_active: false
```

---

## 🔄 **Alternative Scenarios**

### **Scenario A: Customer Abandons Cart**

```sql
-- After 15 minutes, reservation expires
SELECT cleanup_expired_reservations();
```

**What Happens**:

- Item status returns to 'active'
- Quantity returns to 1
- Item becomes available again
- Other customers can purchase

### **Scenario B: Manual Sale (Offline)**

```sql
-- Vendor sells item offline and marks manually
SELECT mark_item_sold('jacket-item-id', 'offline-buyer-id');
```

**What Happens**:

- Item immediately marked as 'sold'
- Disappears from marketplace
- Vendor can track offline sales

### **Scenario C: Vendor Deactivates Item**

```sql
-- Vendor temporarily removes item
UPDATE items
SET
  status = 'inactive',
  is_active = false
WHERE id = 'jacket-item-id';
```

**What Happens**:

- Item disappears from customer view
- Vendor can reactivate later
- Preserves all data and history

---

## 📊 **Vendor Dashboard Views**

### **Active Items**

```sql
SELECT
  title,
  price,
  status,
  quantity,
  created_at
FROM items
WHERE user_id = 'vendor-user-id-123'
  AND status = 'active'
  AND deleted_at IS NULL;
```

### **Sold Items**

```sql
SELECT
  title,
  price,
  sold_at,
  buyer_id
FROM items
WHERE user_id = 'vendor-user-id-123'
  AND status = 'sold';
```

### **Order Management**

```sql
SELECT
  oi.order_id,
  i.title,
  oi.quantity,
  oi.price,
  o.status as order_status,
  o.created_at as order_date
FROM vendor_orders vo
JOIN order_items oi ON vo.order_item_id = oi.id
JOIN items i ON oi.item_id = i.id
JOIN orders o ON oi.order_id = o.id
WHERE vo.vendor_id = 'vendor-user-id-123'
ORDER BY o.created_at DESC;
```

---

## 🎯 **Key Benefits Demonstrated**

✅ **No Overselling**: Quantity tracking prevents selling more than available  
✅ **Automatic Workflow**: Status changes happen automatically  
✅ **Data Integrity**: Complete transaction history preserved  
✅ **Better UX**: Clear status indicators for customers  
✅ **Vendor Control**: Manual override options available  
✅ **Performance**: Efficient queries with proper indexing

This workflow ensures a smooth, professional e-commerce experience that scales with your business! 🚀
