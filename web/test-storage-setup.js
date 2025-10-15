/**
 * Test script to check if Supabase Storage is properly set up
 * Run this in the browser console on your production site
 */

// Test if the images bucket exists and is accessible
async function testStorageSetup() {
  console.log("Testing Supabase Storage setup...");

  try {
    // Get the Supabase client (assuming it's available globally)
    const supabase = window.supabase || window.__supabase;

    if (!supabase) {
      console.error(
        "❌ Supabase client not found. Make sure you are on the production site."
      );
      return;
    }

    // Test 1: Check if images bucket exists
    console.log("1. Checking if images bucket exists...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ Error fetching buckets:", bucketsError);
      return;
    }

    const imagesBucket = buckets.find((bucket) => bucket.id === "images");
    if (!imagesBucket) {
      console.error(
        "❌ Images bucket not found. Please run setup-image-storage.sql first."
      );
      console.log(
        "Available buckets:",
        buckets.map((b) => b.id)
      );
      return;
    }

    console.log("✅ Images bucket exists:", imagesBucket);

    // Test 2: Check bucket policies
    console.log("2. Checking bucket policies...");
    const { data: policies, error: policiesError } = await supabase
      .from("pg_policies")
      .select("*")
      .eq("tablename", "objects")
      .eq("schemaname", "storage");

    if (policiesError) {
      console.log(
        "⚠️ Could not check policies (this is normal):",
        policiesError.message
      );
    } else {
      console.log("✅ Storage policies found:", policies.length);
    }

    // Test 3: Try to upload a test file
    console.log("3. Testing file upload...");
    const testFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });
    const testPath = "test/test-file.txt";

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(testPath, testFile);

    if (uploadError) {
      console.error("❌ Upload test failed:", uploadError);
      return;
    }

    console.log("✅ Upload test successful:", uploadData);

    // Test 4: Try to get public URL
    console.log("4. Testing public URL generation...");
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(testPath);

    console.log("✅ Public URL generated:", urlData.publicUrl);

    // Test 5: Clean up test file
    console.log("5. Cleaning up test file...");
    const { error: deleteError } = await supabase.storage
      .from("images")
      .remove([testPath]);

    if (deleteError) {
      console.log("⚠️ Could not delete test file:", deleteError);
    } else {
      console.log("✅ Test file cleaned up");
    }

    console.log("🎉 Storage setup test completed successfully!");
    console.log("Your Supabase Storage is properly configured.");
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

// Run the test
testStorageSetup();
