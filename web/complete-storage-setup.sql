-- Complete Supabase Storage setup (run only if bucket already exists)
-- This script should be run in the Supabase SQL Editor

-- Check if bucket exists first
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images') THEN
        RAISE EXCEPTION 'Images bucket does not exist. Please create it first.';
    END IF;
END $$;

-- Create RLS policies for the images bucket (only if they don't exist)
-- Allow authenticated users to upload images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow authenticated users to upload images'
    ) THEN
        CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
        FOR INSERT WITH CHECK (
            bucket_id = 'images' 
            AND auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- Allow public read access to images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow public read access to images'
    ) THEN
        CREATE POLICY "Allow public read access to images" ON storage.objects
        FOR SELECT USING (bucket_id = 'images');
    END IF;
END $$;

-- Allow users to update their own images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow users to update their own images'
    ) THEN
        CREATE POLICY "Allow users to update their own images" ON storage.objects
        FOR UPDATE USING (
            bucket_id = 'images' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );
    END IF;
END $$;

-- Allow users to delete their own images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow users to delete their own images'
    ) THEN
        CREATE POLICY "Allow users to delete their own images" ON storage.objects
        FOR DELETE USING (
            bucket_id = 'images' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );
    END IF;
END $$;

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

-- Verify the setup
SELECT 
    'Storage setup completed successfully!' as status,
    (SELECT COUNT(*) FROM storage.buckets WHERE id = 'images') as bucket_exists,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') as policies_count;
