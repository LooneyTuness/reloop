-- Update existing notifications to use translated messages
-- This script updates notifications that were created with hardcoded English text

-- Step 1: First, let's check the structure of the notifications table
-- This will show us what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;

-- Step 2: Update existing "Order Completed" notifications to use translated messages
-- Extract order ID from the message text since we don't know the exact column structure
UPDATE notifications 
SET 
  title = CASE 
    WHEN user_id IN (
      SELECT user_id FROM user_preferences WHERE language_preference = 'en'
    ) THEN 'Order Completed'
    ELSE 'Нарачката е завршена'
  END,
  message = CASE 
    WHEN user_id IN (
      SELECT user_id FROM user_preferences WHERE language_preference = 'en'
    ) THEN message  -- Keep original English message for EN users
    ELSE 'Вашата нарачка ' || SUBSTRING(message FROM 'Your order #(\d+)') || ' е завршена.'
  END
WHERE 
  type = 'order_completed' 
  AND title = 'Order Completed'
  AND message LIKE 'Your order #% has been completed.';

-- Step 3: For users without language preference, default to Macedonian
UPDATE notifications 
SET 
  title = 'Нарачката е завршена',
  message = 'Вашата нарачка ' || SUBSTRING(message FROM 'Your order #(\d+)') || ' е завршена.'
WHERE 
  type = 'order_completed' 
  AND title = 'Order Completed'
  AND message LIKE 'Your order #% has been completed.'
  AND user_id NOT IN (
    SELECT user_id FROM user_preferences WHERE language_preference = 'en'
  );

-- Step 3: Show how many notifications were updated
SELECT 
  'Updated ' || COUNT(*) || ' order completion notifications' as result
FROM notifications 
WHERE 
  type = 'order_completed' 
  AND title IN ('Нарачката е завршена', 'Order Completed');

-- Step 4: Show current notification languages
SELECT 
  title,
  COUNT(*) as count,
  CASE 
    WHEN title = 'Order Completed' THEN 'English'
    WHEN title = 'Нарачката е завршена' THEN 'Macedonian'
    ELSE 'Other'
  END as language
FROM notifications 
WHERE type = 'order_completed'
GROUP BY title
ORDER BY count DESC;
