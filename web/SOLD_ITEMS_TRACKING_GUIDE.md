# Sold Items Tracking System

## Overview

This system creates comprehensive tables to track sold out items by vendor, providing detailed sales analytics and inventory management capabilities.

## Tables Created

### 1. `sold_items`

Tracks every item sold with complete details:

- Item information at time of sale (snapshot)
- Vendor and buyer details
- Sale metrics (price, quantity, total amount)
- Order and payment information

### 2. `vendor_sales_summary`

Aggregated sales data by time periods:

- Daily, weekly, monthly, yearly summaries
- Total items sold, revenue, orders
- Top selling categories
- Performance metrics

### 3. `inventory_tracking`

Real-time inventory management:

- Current stock levels
- Sold out status tracking
- Price history
- Stock alerts

## Key Features

### Automatic Data Population

- **Triggers**: Automatically populate `sold_items` when orders are completed
- **Inventory Updates**: Real-time stock level adjustments
- **New Item Tracking**: Automatic inventory initialization for new items

### Views for Easy Querying

- `vendor_sales_report`: Comprehensive sales analytics
- `sold_items_detailed`: Detailed sales with customer info
- `vendor_inventory_status`: Current inventory with stock status

### Security

- **Row Level Security (RLS)**: Vendors can only see their own data
- **Proper Permissions**: Authenticated users have appropriate access

## Usage Examples

### Get Vendor Sales Statistics

```sql
SELECT * FROM get_vendor_sales_stats('vendor-uuid-here', 30);
```

### View Vendor Sales Report

```sql
SELECT * FROM vendor_sales_report
WHERE vendor_id = 'vendor-uuid-here'
ORDER BY period_start DESC;
```

### Check Inventory Status

```sql
SELECT * FROM vendor_inventory_status
WHERE vendor_id = 'vendor-uuid-here'
AND stock_status = 'Sold Out';
```

### Update Sales Summary

```sql
SELECT update_vendor_sales_summary('vendor-uuid-here', 'monthly');
```

## Installation

1. Run the SQL script `create-sold-items-tracking-fixed.sql` in your Supabase SQL Editor
2. The system will automatically start tracking new sales
3. Optionally uncomment the migration section to populate historical data

## Benefits

- **Complete Sales History**: Never lose track of what was sold
- **Vendor Analytics**: Detailed performance metrics
- **Inventory Management**: Real-time stock tracking
- **Customer Insights**: Buyer behavior analysis
- **Financial Reporting**: Revenue and profit tracking

## Data Types Fixed

The system properly handles the UUID/BIGINT type mismatches in your existing database by using TEXT columns with proper casting (`::text`) in all queries and joins.
