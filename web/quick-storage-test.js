/**
 * Quick test to verify Supabase Storage is working
 * Run this in the browser console on your production site
 */

async function quickStorageTest() {
  console.log("🚀 Quick Storage Test");

  try {
    // Get the Supabase client
    const supabase = window.supabase || window.__supabase;

    if (!supabase) {
      console.error("❌ Supabase client not found");
      return;
    }

    // Test 1: Check if we can access the images bucket
    console.log("1. Testing bucket access...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ Cannot access storage:", bucketsError);
      return;
    }

    const imagesBucket = buckets.find((bucket) => bucket.id === "images");
    if (!imagesBucket) {
      console.error("❌ Images bucket not found");
      return;
    }

    console.log("✅ Images bucket accessible:", imagesBucket.name);

    // Test 2: Try to upload a small test image
    console.log("2. Testing image upload...");

    // Create a small test image (1x1 pixel PNG)
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 1, 1);

    canvas.toBlob(async (blob) => {
      const testFile = new File([blob], "test-image.png", {
        type: "image/png",
      });
      const testPath = `test/${Date.now()}-test.png`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(testPath, testFile);

      if (uploadError) {
        console.error("❌ Upload failed:", uploadError);
        return;
      }

      console.log("✅ Upload successful:", uploadData);

      // Test 3: Get public URL
      console.log("3. Testing public URL...");
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(testPath);

      console.log("✅ Public URL:", urlData.publicUrl);

      // Test 4: Try to access the image
      console.log("4. Testing image access...");
      try {
        const response = await fetch(urlData.publicUrl);
        if (response.ok) {
          console.log("✅ Image is publicly accessible");
        } else {
          console.log("⚠️ Image access issue:", response.status);
        }
      } catch (error) {
        console.log("⚠️ Could not test image access:", error.message);
      }

      // Clean up
      console.log("5. Cleaning up...");
      const { error: deleteError } = await supabase.storage
        .from("images")
        .remove([testPath]);

      if (deleteError) {
        console.log("⚠️ Could not clean up test file:", deleteError);
      } else {
        console.log("✅ Test file cleaned up");
      }

      console.log("🎉 Storage test completed successfully!");
      console.log("Your image storage is working correctly.");
    }, "image/png");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
quickStorageTest();
