-- Create a test user manually (if needed)
-- This is for testing purposes only

-- Insert a test user into auth.users (you'll need to do this through Supabase Auth or use the signup function)
-- The trigger will automatically create the corresponding public.users record

-- To test, you can also create a test user directly in the public.users table:
INSERT INTO public.users (id, email, username, full_name)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'testuser',
  'Test User'
) ON CONFLICT (email) DO NOTHING;

-- Insert some test items
INSERT INTO public.items (name, title, description, price, old_price, condition, size, brand, category, photos, seller_id)
VALUES 
  ('Test Item 1', 'Vintage T-Shirt', 'A cool vintage t-shirt in great condition', 25.00, 40.00, 'Good', 'M', 'Nike', 'Tops', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], (SELECT id FROM public.users WHERE email = 'test@example.com' LIMIT 1)),
  ('Test Item 2', 'Denim Jeans', 'Classic blue jeans, perfect fit', 35.00, 60.00, 'Excellent', '32', 'Levi''s', 'Bottoms', ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'], (SELECT id FROM public.users WHERE email = 'test@example.com' LIMIT 1))
ON CONFLICT DO NOTHING;
