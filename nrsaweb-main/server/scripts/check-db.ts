
import dotenv from "dotenv";
dotenv.config(); // Load .env file
import { storage } from "../storage";
import { supabase } from "../lib/supabase";

console.log("Checking DB connection and News query...");

async function check() {
    if (!supabase) {
        console.error("❌ Supabase client not initialized (check .env)");
        return;
    }

    try {
        console.log("1. Testing simple query...");
        const { count, error } = await supabase.from('news').select('*', { count: 'exact', head: true });
        if (error) throw error;
        console.log(`✅ Supabase connected. News count: ${count}`);

        console.log("2. Testing storage.getAllNews()...");
        const news = await storage.getAllNews(5);
        console.log(`✅ getAllNews returned ${news.length} items.`);
        if (news.length > 0) {
            console.log("Sample item:", news[0].title);
        }
    } catch (error) {
        console.error("❌ Database check failed:", error);
    }
}

check().catch(console.error);
