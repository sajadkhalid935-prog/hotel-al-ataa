// ===================================================
// GOOGLE SHEETS CLOUD DATABASE CONFIGURATION (API)
// ===================================================
// ظٹط±ط¬ظ‰ ظ…ظ„ط، ط§ظ„ط±ط§ط¨ط· ط£ط¯ظ†ط§ظ‡ ط¨ط¹ط¯ ظ†ط´ط± ظƒظˆط¯ Google Apps Script ظƒطھط·ط¨ظٹظ‚ ظˆظٹط¨ (Web App).
// ط¥ط°ط§ طھط±ظƒطھ ط§ظ„ط±ط§ط¨ط· ظپط§ط±ط؛ط§ظ‹طŒ ط³ظٹط¹ظ…ظ„ ط§ظ„ظ…ظˆظ‚ط¹ طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ط¹ظ„ظ‰ ط§ظ„ط°ط§ظƒط±ط© ط§ظ„ظ…ط­ظ„ظٹط© (localStorage) ط¯ظˆظ† ط£ظٹ ظ…ط´ط§ظƒظ„.

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw8oopbYE509F45UywoH8Ve3Cm4HuIn4xxAc3CQkdjxvollPX58mSktPX5XpPSz-6lq/exec"; // ط¶ط¹ ظ‡ظ†ط§ ط±ط§ط¨ط· ظˆظٹط¨ طھط·ط¨ظٹظ‚ Apps Script ط§ظ„ط®ط§طµ ط¨ظƒ

const googleSheetsClient = {
    // ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† طھظپط¹ظٹظ„ ط§ظ„ط§طھطµط§ظ„ ط¨ظ€ Google Sheets
    isEnabled: function() {
        return (
            typeof GOOGLE_SCRIPT_URL !== "undefined" && 
            GOOGLE_SCRIPT_URL && 
            GOOGLE_SCRIPT_URL !== "" && 
            !GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")
        );
    },
    
    // ط¯ط§ظ„ط© ظ…ط³ط§ط¹ط¯ط© ظ„ط·ظ„ط¨ط§طھ GET
    get: async function(action) {
        if (!this.isEnabled()) {
            throw new Error("Google Apps Script URL is not configured.");
        }
        try {
            const url = `${GOOGLE_SCRIPT_URL}?action=${action}&_=${new Date().getTime()}`;
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
    
    // ط¯ط§ظ„ط© ظ…ط³ط§ط¹ط¯ط© ظ„ط·ظ„ط¨ط§طھ POST (ظٹطھظ… ط¥ط±ط³ط§ظ„ظ‡ط§ ظƒظ€ text/plain ظ„طھظپط§ط¯ظٹ ظ…ط´ط§ظƒظ„ CORS Preflight)
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

    // ط¬ظ„ط¨ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ (ط£ط³ط¹ط§ط± ط§ظ„ط؛ط±ظپ)
    getSettings: async function() {
        return this.get("getSettings");
    },

    // ط¬ظ„ط¨ ظƒظ„ ط§ظ„ط­ط¬ظˆط²ط§طھ
    getReservations: async function() {
        return this.get("getReservations");
    },

    // ط­ظپط¸ ط­ط¬ط² ط¬ط¯ظٹط¯
    saveReservation: async function(data) {
        return this.post({ action: "saveReservation", data: data });
    },

    // طھط­ط¯ظٹط« ط­ط§ظ„ط© ط§ظ„ط­ط¬ط² (accepted / rejected / pending)
    updateStatus: async function(id, status) {
        return this.post({ action: "updateStatus", id: id, status: status });
    },

    // ط­ط°ظپ ط­ط¬ط² ظˆط§ط­ط¯
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
    },

    // حفظ الصور الجديدة للغرف
    saveImages: async function(images) {
        return this.post({ action: "saveImages", images: images });
    }
};

// تصدير الكلاينت للعمل على النطاق العام للموقع واللوحة
window.googleSheetsClient = googleSheetsClient;

// طھط¹ط·ظٹظ„ ظƒظˆط¯ ط§ظ„ط³ظˆط¨ط§ط¨ظٹط³ ظ„طھط¬ظ†ط¨ ط£ظٹ طھط¹ط§ط±ط¶ط§طھ
window.supabaseClient = null;

