
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mnficpuywfomzrravez.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZmljcHV5d2ZvbW56cnJhdmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MjU3NzUsImV4cCI6MjA4NjAwMTc3NX0.4ercqyv26oXE7TLM-8kCtfTNUzdr5q8BaJot4QIpjQU"

if (!supabaseUrl || !supabaseKey) {
    console.error("Error: Missing environment variables.");
    console.log("URL:", supabaseUrl);
    console.log("Key:", supabaseKey ? "********" : "Missing");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBackend() {
    console.log("Checking Supabase connection...", supabaseUrl);
    
    // 1. Check Menu Items (Read)
    const { data: menu, error: menuError } = await supabase.from('menu_items').select('count', { count: 'exact', head: true });
    
    if (menuError) {
        console.error("❌ Failed to read 'menu_items':", menuError.message);
    } else {
        console.log("✅ Read 'menu_items' successful. Count:", menu);
    }

    // 2. Check Order Insert (Write)
    try {
        const dummyOrder = {
             student_id: 'TEST_BACKEND_CHECK',
             vendor_id: 'canteen_1',
             status: 'cancelled', // Immediately cancelled so it doesn't clutter
             order_time: new Date().toISOString()
        };

        const { data: insertData, error: insertError } = await supabase
            .from('orders')
            .insert(dummyOrder)
            .select()
            .single();

        if (insertError) {
             console.error("❌ Failed to insert into 'orders':", insertError.message);
        } else {
             console.log("✅ Insert into 'orders' successful. ID:", insertData.id);
             
             // Clean up
             const { error: deleteError } = await supabase.from('orders').delete().eq('id', insertData.id);
             if (deleteError) console.warn("⚠️ Failed to clean up dummy order:", deleteError.message);
             else console.log("✅ Cleaned up dummy order.");
        }

    } catch (e) {
        console.error("❌ Unexpected error during insert check:", e.message);
    }
}

checkBackend();
