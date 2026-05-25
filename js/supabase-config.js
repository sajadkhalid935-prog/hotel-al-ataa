// ==========================================
// SUPABASE CLOUD DATABASE CONFIGURATION
// ==========================================
// يرجى ملء البيانات التالية بعد إنشاء مشروع Supabase مجاني.
// إذا تركت الحقول فارغة، سيعمل الموقع تلقائياً على الذاكرة المحلية (localStorage) دون أي مشاكل.

const SUPABASE_URL = "https://jbrghywaucvdhfmtmnji.supabase.co"; // ضع هنا رابط مشروعك (مثال: https://xxxx.supabase.co)
const SUPABASE_ANON_KEY = "sb_publishable_Tipjoqt0T_v0V5IPKNChoA_hbKXJ_SS"; // ضع هنا مفتاح Anon Key الخاص بمشروعك

let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log("Supabase Cloud Database initialized successfully! 🚀");
        } else {
            console.error("Supabase library not loaded. Make sure to include the CDN script.");
        }
    } catch (error) {
        console.error("Error initializing Supabase client:", error);
    }
} else {
    console.warn("Supabase credentials not configured. Running in LocalStorage (offline) fallback mode. 💾");
}

// تصدير الكلاينت للعمل على النطاق العام للموقع واللوحة
window.supabaseClient = supabaseClient;
