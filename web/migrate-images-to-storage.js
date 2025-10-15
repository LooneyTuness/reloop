/**
 * Migration script to convert base64 images to Supabase Storage
 * This script should be run in the browser console or as a Node.js script
 *
 * IMPORTANT: This script requires the Supabase Storage bucket to be set up first
 * Run the setup-image-storage.sql script in Supabase SQL Editor first
 */

import { createClient } from "@supabase/supabase-js";

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Convert base64 data URL to File object
 */
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Upload base64 image to Supabase Storage
 */
async function uploadBase64Image(base64Url, folder, userId, filename) {
  try {
    // Convert base64 to file
    const file = dataURLtoFile(base64Url, filename);

    // Generate unique file path
    const fileExt = filename.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const uniqueFilename = `${userId}/${timestamp}-${filename}`;
    const filePath = `${folder}/${uniqueFilename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error processing image:", error);
    return null;
  }
}

/**
 * Migrate product images from base64 to storage
 */
async function migrateProductImages() {
  console.log("Starting migration of product images...");

  try {
    // Get all items with images
    const { data: items, error } = await supabase
      .from("items")
      .select("id, images, user_id")
      .not("images", "is", null);

    if (error) {
      console.error("Error fetching items:", error);
      return;
    }

    console.log(`Found ${items.length} items with images`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        if (!item.images || !Array.isArray(item.images)) {
          continue;
        }

        const newImageUrls = [];

        for (let i = 0; i < item.images.length; i++) {
          const imageUrl = item.images[i];

          // Skip if already a storage URL
          if (
            imageUrl.includes("supabase.co") &&
            imageUrl.includes("/storage/")
          ) {
            newImageUrls.push(imageUrl);
            continue;
          }

          // Skip if not a base64 data URL
          if (!imageUrl.startsWith("data:")) {
            newImageUrls.push(imageUrl);
            continue;
          }

          // Upload to storage
          const storageUrl = await uploadBase64Image(
            imageUrl,
            "products",
            item.user_id,
            `product-${item.id}-${i}.jpg`
          );

          if (storageUrl) {
            newImageUrls.push(storageUrl);
            console.log(`Migrated image ${i + 1} for item ${item.id}`);
          } else {
            newImageUrls.push(imageUrl); // Keep original if upload fails
            errorCount++;
          }
        }

        // Update item with new URLs
        const { error: updateError } = await supabase
          .from("items")
          .update({ images: newImageUrls })
          .eq("id", item.id);

        if (updateError) {
          console.error(`Error updating item ${item.id}:`, updateError);
          errorCount++;
        } else {
          migratedCount++;
          console.log(
            `Updated item ${item.id} with ${newImageUrls.length} images`
          );
        }

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
        errorCount++;
      }
    }

    console.log(
      `Migration completed: ${migratedCount} items migrated, ${errorCount} errors`
    );
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

/**
 * Migrate profile images from base64 to storage
 */
async function migrateProfileImages() {
  console.log("Starting migration of profile images...");

  try {
    // Get all seller profiles with avatar_url
    const { data: profiles, error } = await supabase
      .from("seller_profiles")
      .select("id, avatar_url, user_id")
      .not("avatar_url", "is", null);

    if (error) {
      console.error("Error fetching profiles:", error);
      return;
    }

    console.log(`Found ${profiles.length} profiles with avatar images`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const profile of profiles) {
      try {
        const avatarUrl = profile.avatar_url;

        // Skip if already a storage URL
        if (
          avatarUrl.includes("supabase.co") &&
          avatarUrl.includes("/storage/")
        ) {
          continue;
        }

        // Skip if not a base64 data URL
        if (!avatarUrl.startsWith("data:")) {
          continue;
        }

        // Upload to storage
        const storageUrl = await uploadBase64Image(
          avatarUrl,
          "profiles",
          profile.user_id,
          `profile-${profile.id}.jpg`
        );

        if (storageUrl) {
          // Update profile with new URL
          const { error: updateError } = await supabase
            .from("seller_profiles")
            .update({ avatar_url: storageUrl })
            .eq("id", profile.id);

          if (updateError) {
            console.error(`Error updating profile ${profile.id}:`, updateError);
            errorCount++;
          } else {
            migratedCount++;
            console.log(`Updated profile ${profile.id} with new avatar URL`);
          }
        } else {
          errorCount++;
        }

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing profile ${profile.id}:`, error);
        errorCount++;
      }
    }

    console.log(
      `Profile migration completed: ${migratedCount} profiles migrated, ${errorCount} errors`
    );
  } catch (error) {
    console.error("Profile migration failed:", error);
  }
}

/**
 * Main migration function
 */
async function migrateImages() {
  console.log("Starting image migration...");
  console.log("Make sure to run setup-image-storage.sql first!");

  await migrateProductImages();
  await migrateProfileImages();

  console.log("Image migration completed!");
}

// Export functions for use
export { migrateImages, migrateProductImages, migrateProfileImages };

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateImages().catch(console.error);
}
