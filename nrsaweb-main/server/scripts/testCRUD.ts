import { supabase } from "../lib/supabase.js";
import 'dotenv/config';

async function testCRUD() {
  if (!supabase) {
    console.error("❌ Supabase not configured");
    process.exit(1);
  }

  console.log("🧪 Testing CRUD Operations...\n");

  // Test 1: INSERT (CREATE)
  console.log("1️⃣ Testing INSERT operation on 'news' table...");
  const { data: insertData, error: insertError } = await supabase
    .from('news')
    .insert({
      title: 'Test Article',
      content: 'This is a test article to verify CRUD operations work.',
      excerpt: 'Test excerpt',
      image_url: 'https://example.com/test.jpg',
      is_featured: false
    })
    .select()
    .single();

  if (insertError) {
    console.error("❌ INSERT failed:", insertError.message);
    console.error("Details:", insertError);
  } else {
    console.log("✅ INSERT successful:", insertData?.id);
    
    const testId = insertData.id;

    // Test 2: SELECT (READ)
    console.log("\n2️⃣ Testing SELECT operation...");
    const { data: selectData, error: selectError } = await supabase
      .from('news')
      .select('*')
      .eq('id', testId)
      .single();

    if (selectError) {
      console.error("❌ SELECT failed:", selectError.message);
    } else {
      console.log("✅ SELECT successful:", selectData?.title);
    }

    // Test 3: UPDATE
    console.log("\n3️⃣ Testing UPDATE operation...");
    const { data: updateData, error: updateError } = await supabase
      .from('news')
      .update({ title: 'Updated Test Article' })
      .eq('id', testId)
      .select()
      .single();

    if (updateError) {
      console.error("❌ UPDATE failed:", updateError.message);
      console.error("Details:", updateError);
    } else {
      console.log("✅ UPDATE successful:", updateData?.title);
    }

    // Test 4: DELETE
    console.log("\n4️⃣ Testing DELETE operation...");
    const { error: deleteError } = await supabase
      .from('news')
      .delete()
      .eq('id', testId);

    if (deleteError) {
      console.error("❌ DELETE failed:", deleteError.message);
      console.error("Details:", deleteError);
    } else {
      console.log("✅ DELETE successful");
    }
  }

  console.log("\n📊 Test Summary:");
  console.log("If you see errors above, RLS is likely blocking operations.");
  console.log("Solution: Run the SQL script in URGENT_RLS_FIX.md");
  
  process.exit(0);
}

testCRUD().catch(console.error);
