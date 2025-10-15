-- Setup Supabase Storage for images
-- This script should be run in the Supabase SQL Editor

-- Create the images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create RLS policies for the images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to images
CREATE POLICY "Allow public read access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow users to update their own images
CREATE POLICY "Allow users to update their own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create a function to clean up orphaned images
CREATE OR REPLACE FUNCTION cleanup_orphaned_images()
RETURNS void AS $$
BEGIN
  -- Delete images that are not referenced in the items table
  DELETE FROM storage.objects
  WHERE bucket_id = 'images'
  AND name LIKE 'products/%'
  AND NOT EXISTS (
    SELECT 1 FROM items 
    WHERE images::text LIKE '%' || storage.objects.name || '%'
  );
  
  -- Delete images that are not referenced in the seller_profiles table
  DELETE FROM storage.objects
  WHERE bucket_id = 'images'
  AND name LIKE 'profiles/%'
  AND NOT EXISTS (
    SELECT 1 FROM seller_profiles 
    WHERE avatar_url LIKE '%' || storage.objects.name || '%'
  );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get image URL from storage path
CREATE OR REPLACE FUNCTION get_image_url(storage_path text)
RETURNS text AS $$
BEGIN
  RETURN 'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/images/' || storage_path;
END;
$$ LANGUAGE plpgsql;
