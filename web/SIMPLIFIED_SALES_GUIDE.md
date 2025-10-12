# Simplified Sales Tracking System

## Overview

This simplified system replaces the complex multi-table approach with **ONE easy-to-understand table** for tracking all sales by vendor.

## Single Table: `vendor_sales`

### What it tracks:

- **Every item sold** with complete details
- **Vendor information** (who sold it)
- **Customer information** (who bought it)
- **Sale details** (price, quantity, total amount)
- **Item snapshot** (what was sold at the time)

### Key Fields:

- `vendor_id` - Which vendor made the sale
- `item_title` - What was sold
- `total_amount` - How much money was made
- `sale_date` - When it was sold
- `customer_name` - Who bought it

## Simple View: `vendor_sales_summary`

### What it shows:

- **Total sales count** for each vendor
- **Total revenue** earned
- **Total items sold**
- **Average sale value**
- **First and last sale dates**
- **Number of categories sold**

## How to Use

### 1. View All Sales for a Vendor

```sql
SELECT * FROM vendor_sales
WHERE vendor_id = 'your-vendor-id'
ORDER BY sale_date DESC;
```

### 2. Get Sales Summary

```sql
SELECT * FROM vendor_sales_summary
WHERE vendor_id = 'your-vendor-id';
```

### 3. View Recent Sales

```sql
SELECT * FROM vendor_sales
WHERE vendor_id = 'your-vendor-id'
AND sale_date >= NOW() - INTERVAL '30 days';
```

### 4. Top Selling Items

```sql
SELECT item_title, COUNT(*) as times_sold, SUM(total_amount) as total_revenue
FROM vendor_sales
WHERE vendor_id = 'your-vendor-id'
GROUP BY item_title
ORDER BY total_revenue DESC;
```

## Automatic Features

- ✅ **Auto-records sales** when orders are completed
- ✅ **Secure access** - vendors only see their own sales
- ✅ **Complete history** - never lose track of what was sold
- ✅ **Easy queries** - simple table structure

## Benefits of Simplification

- 🎯 **One table to rule them all** - No confusion about which table to use
- 📊 **Easy reporting** - Simple queries for sales data
- 🔒 **Secure** - Row-level security protects vendor data
- ⚡ **Fast** - Optimized indexes for quick queries
- 🧹 **Clean** - No complex relationships or triggers

## Installation

1. Run `simplified-sales-tracking.sql` in Supabase SQL Editor
2. The system automatically starts tracking new sales
3. Use the `vendor_sales` table for all sales-related queries

This simplified approach gives you everything you need to track sales without the complexity!
