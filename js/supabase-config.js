// ===================================================
// GOOGLE SHEETS CLOUD DATABASE CONFIGURATION (API)
// ===================================================
// يرجى ملء الرابط أدناه بعد نشر كود Google Apps Script كتطبيق ويب (Web App).
// إذا تركت الرابط فارغاً، سيعمل الموقع تلقائياً على الذاكرة المحلية (localStorage) دون أي مشاكل.

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw8oopbYE509F45UywoH8Ve3Cm4HuIn4xxAc3CQkdjxvollPX58mSktPX5XpPSz-6lq/exec"; // ضع هنا رابط ويب تطبيق Apps Script الخاص بك

const googleSheetsClient = {
    // التحقق من تفعيل الاتصال بـ Google Sheets
    isEnabled: function() {
        return (
            typeof GOOGLE_SCRIPT_URL !== "undefined" && 
            GOOGLE_SCRIPT_URL && 
            GOOGLE_SCRIPT_URL !== "" && 
            !GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")
        );
    },
    
    // دالة مساعدة لطلبات GET
    get: async function(action) {
        if (!this.isEnabled()) {
            throw new Error("Google Apps Script URL is not configured.");
        }
        try {
            const url = `${GOOGLE_SCRIPT_URL}?action=${action}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            if (json.status === "error") {
                throw new Error(json.message);
            }
            return json.data;
        } catch (error) {
            console.error(`Google Sheets GET request failed (${action}):`, error);
            throw error;
        }
    },
    
    // دالة مساعدة لطلبات POST (يتم إرسالها كـ text/plain لتفادي مشاكل CORS Preflight)
    post: async function(payload) {
        if (!this.isEnabled()) {
            throw new Error("Google Apps Script URL is not configured.");
        }
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            if (json.status === "error") {
                throw new Error(json.message);
            }
            return json;
        } catch (error) {
            console.error(`Google Sheets POST request failed (${payload.action}):`, error);
            throw error;
        }
    },

    // جلب الإعدادات (أسعار الغرف)
    getSettings: async function() {
        return this.get("getSettings");
    },

    // جلب كل الحجوزات
    getReservations: async function() {
        return this.get("getReservations");
    },

    // حفظ حجز جديد
    saveReservation: async function(data) {
        return this.post({ action: "saveReservation", data: data });
    },

    // تحديث حالة الحجز (accepted / rejected / pending)
    updateStatus: async function(id, status) {
        return this.post({ action: "updateStatus", id: id, status: status });
    },

    // حذف حجز واحد
    deleteReservation: async function(id) {
        return this.post({ action: "deleteReservation", id: id });
    },

    // مسح كافة الحجوزات من الجدول سحابياً
    clearAllReservations: async function() {
        return this.post({ action: "clearAllReservations" });
    },

    // حفظ الأسعار الجديدة للغرف
    savePrices: async function(prices) {
        return this.post({ action: "savePrices", prices: prices });
    }
};

// تصدير الكلاينت للعمل على النطاق العام للموقع واللوحة
window.googleSheetsClient = googleSheetsClient;

// تعطيل كود السوبابيس لتجنب أي تعارضات
window.supabaseClient = null;
