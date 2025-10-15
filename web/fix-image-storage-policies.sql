-- Fix image storage policies to prevent images from disappearing
-- This script should be run in the Supabase SQL Editor

-- First, ensure the images bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  52428800, -- 50MB limit (increased from 5MB)
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;

-- Create more permissive policies for images
-- Allow anyone to read images (public access)
CREATE POLICY "Public read access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own images
CREATE POLICY "Users can update their own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create a function to refresh image URLs (add cache-busting)
CREATE OR REPLACE FUNCTION refresh_image_url(image_url text)
RETURNS text AS $$
BEGIN
  -- If it's a Supabase storage URL, add a timestamp parameter
  IF image_url LIKE '%supabase.co/storage/v1/object/public/images/%' THEN
    RETURN image_url || '?t=' || extract(epoch from now())::text;
  END IF;
  
  -- For other URLs, add timestamp parameter
  IF image_url LIKE '%?%' THEN
    RETURN image_url || '&t=' || extract(epoch from now())::text;
  ELSE
    RETURN image_url || '?t=' || extract(epoch from now())::text;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if an image exists in storage
CREATE OR REPLACE FUNCTION image_exists_in_storage(image_url text)
RETURNS boolean AS $$
DECLARE
  storage_path text;
BEGIN
  -- Extract storage path from Supabase URL
  IF image_url LIKE '%supabase.co/storage/v1/object/public/images/%' THEN
    storage_path := substring(image_url from '.*/images/(.*)');
    storage_path := split_part(storage_path, '?', 1); -- Remove query parameters
    
    -- Check if the file exists in storage
    RETURN EXISTS (
      SELECT 1 FROM storage.objects 
      WHERE bucket_id = 'images' 
      AND name = storage_path
    );
  END IF;
  
  RETURN true; -- Assume non-Supabase URLs are valid
END;
$$ LANGUAGE plpgsql;

-- Create a function to clean up broken image references
CREATE OR REPLACE FUNCTION cleanup_broken_image_references()
RETURNS void AS $$
BEGIN
  -- Update items with broken image references to use placeholder
  UPDATE items 
  SET images = ARRAY['/api/placeholder/400/400']
  WHERE images IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM unnest(images) AS img 
    WHERE img LIKE '%supabase.co/storage/v1/object/public/images/%'
    AND NOT image_exists_in_storage(img)
  );
  
  -- Log the cleanup
  RAISE NOTICE 'Cleaned up broken image references in items table';
END;
$$ LANGUAGE plpgsql;

-- Verify the setup
SELECT 
    'Image storage policies updated successfully!' as status,
    (SELECT COUNT(*) FROM storage.buckets WHERE id = 'images') as bucket_exists,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') as policies_count,
    (SELECT public FROM storage.buckets WHERE id = 'images') as bucket_is_public;
