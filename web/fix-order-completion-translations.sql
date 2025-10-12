-- Fix Order Completion Translations
-- This script updates the order completion functions to use translated messages

-- Step 1: Create a function to get translated messages based on user language
CREATE OR REPLACE FUNCTION get_translated_message(message_key TEXT, user_language TEXT DEFAULT 'mk')
RETURNS TEXT AS $$
BEGIN
  CASE message_key
    WHEN 'order_completed_title' THEN
      CASE user_language
        WHEN 'en' THEN RETURN 'Order Completed';
        ELSE RETURN 'Нарачката е завршена';
      END CASE;
    WHEN 'order_completed_message' THEN
      CASE user_language
        WHEN 'en' THEN RETURN 'Your order #';
        ELSE RETURN 'Вашата нарачка #';
      END CASE;
    WHEN 'order_completed_suffix' THEN
      CASE user_language
        WHEN 'en' THEN RETURN ' has been completed.';
        ELSE RETURN ' е завршена.';
      END CASE;
    ELSE
      RETURN message_key;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Update the complete_order_manually function to use translations
CREATE OR REPLACE FUNCTION complete_order_manually(order_id_param TEXT)
RETURNS JSON AS $$
DECLARE
  order_record RECORD;
  user_language TEXT;
  result JSON;
BEGIN
  -- Get order details
  SELECT o.*
  INTO order_record
  FROM orders o
  WHERE o.id = order_id_param::bigint;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', order_id_param;
  END IF;
  
  user_language := get_user_language_preference(order_record.user_id);
  
  -- Update order status
  UPDATE orders 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = order_id_param::bigint;
  
  -- Update items status to sold
  UPDATE items 
  SET 
    status = 'sold',
    sold_at = NOW()
  WHERE id IN (
    SELECT item_id 
    FROM order_items 
    WHERE order_id = order_id_param::bigint
  );
  
  -- Create translated notification
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    order_record.user_id,
    'order_completed',
    get_translated_message('order_completed_title', user_language),
    get_translated_message('order_completed_message', user_language) || order_record.id || get_translated_message('order_completed_suffix', user_language),
    json_build_object('order_id', order_record.id, 'status', 'completed')
  );
  
  -- Return the updated order data
  SELECT to_json(o) INTO result
  FROM (
    SELECT 
      id,
      status,
      full_name,
      email,
      updated_at,
      created_at
    FROM orders 
    WHERE id = order_id_param::bigint
  ) o;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Drop existing trigger and function with translations (if they exist)
DROP TRIGGER IF EXISTS trigger_order_completion ON orders;
DROP TRIGGER IF EXISTS order_completion_trigger ON orders;
DROP FUNCTION IF EXISTS handle_order_completion() CASCADE;

-- Create the trigger function with translations
CREATE OR REPLACE FUNCTION handle_order_completion()
RETURNS TRIGGER AS $$
DECLARE
  user_language TEXT;
BEGIN
  -- Only proceed if status changed to completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Get user language preference
    user_language := get_user_language_preference(NEW.user_id);
    
    -- Update items status to sold
    UPDATE items 
    SET 
      status = 'sold',
      sold_at = NOW()
    WHERE id IN (
      SELECT item_id 
      FROM order_items 
      WHERE order_id = NEW.id
    );
    
    -- Create translated notification
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      data
    ) VALUES (
      NEW.user_id,
      'order_completed',
      get_translated_message('order_completed_title', user_language),
      get_translated_message('order_completed_message', user_language) || NEW.id || get_translated_message('order_completed_suffix', user_language),
      json_build_object('order_id', NEW.id, 'status', 'completed')
    );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS order_completion_trigger ON orders;
CREATE TRIGGER order_completion_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_order_completion();

-- Step 4: Create a user preferences table to store language preference
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  language_preference TEXT DEFAULT 'mk',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the table
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access their own preferences
DROP POLICY IF EXISTS "Users can access their own preferences" ON user_preferences;
CREATE POLICY "Users can access their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create function to get user language preference
CREATE OR REPLACE FUNCTION get_user_language_preference(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_language TEXT;
BEGIN
  -- Try to get from user_preferences table first
  SELECT language_preference INTO user_language
  FROM user_preferences
  WHERE user_id = user_uuid;
  
  -- If not found, default to Macedonian
  IF user_language IS NULL THEN
    user_language := 'mk';
  END IF;
  
  RETURN user_language;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Grant permissions
GRANT EXECUTE ON FUNCTION complete_order_manually(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_translated_message(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_language_preference(UUID) TO authenticated;

-- Step 6: Test the function with a sample order
-- Uncomment the line below to test with order #50
-- SELECT complete_order_manually('50');

-- Success message
SELECT 'Order completion translations fixed! All notifications will now be properly translated.' as message;
