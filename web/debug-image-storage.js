/**
 * Debug script to check current image storage situation
 * Run this in the browser console on your production site
 */

async function debugImageStorage() {
  console.log("🔍 Debugging image storage...");

  try {
    // Get the Supabase client
    const supabase = window.supabase || window.__supabase;

    if (!supabase) {
      console.error("❌ Supabase client not found");
      return;
    }

    // Check recent products and their images
    console.log("1. Checking recent products...");
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id, name, images, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (itemsError) {
      console.error("❌ Error fetching items:", itemsError);
      return;
    }

    console.log(`Found ${items.length} recent items:`);
    items.forEach((item, index) => {
      console.log(`\nItem ${index + 1}: ${item.name || "Unnamed"}`);
      console.log(`  ID: ${item.id}`);
      console.log(`  Created: ${item.created_at}`);
      console.log(`  Images:`, item.images);

      if (item.images && Array.isArray(item.images)) {
        item.images.forEach((img, imgIndex) => {
          if (img.startsWith("data:")) {
            console.log(
              `    Image ${imgIndex + 1}: Base64 (${img.length} chars)`
            );
          } else if (img.includes("supabase.co")) {
            console.log(`    Image ${imgIndex + 1}: Supabase Storage URL`);
          } else {
            console.log(`    Image ${imgIndex + 1}: Other URL (${img})`);
          }
        });
      }
    });

    // Check if images bucket exists
    console.log("\n2. Checking storage bucket...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ Error fetching buckets:", bucketsError);
    } else {
      const imagesBucket = buckets.find((bucket) => bucket.id === "images");
      if (imagesBucket) {
        console.log("✅ Images bucket exists:", imagesBucket);
      } else {
        console.log(
          "❌ Images bucket not found. Available buckets:",
          buckets.map((b) => b.id)
        );
      }
    }

    // Check storage objects
    console.log("\n3. Checking storage objects...");
    const { data: objects, error: objectsError } = await supabase.storage
      .from("images")
      .list("", { limit: 10 });

    if (objectsError) {
      console.log("❌ Error fetching storage objects:", objectsError);
    } else {
      console.log(`Found ${objects.length} objects in storage:`, objects);
    }
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

// Run the debug
debugImageStorage();
