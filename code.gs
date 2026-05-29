// ===================================================
// GOOGLE APPS SCRIPT DATABASE BACKEND FOR AL-ATAA HOTEL
// ===================================================
// انسخ هذا الكود بالكامل والصقه في محرّر Google Apps Script الخاص بجدول البيانات الخاص بك.

const CACHE_EXPIRATION = 21600; // 6 ساعات كاش لتسريع الاستجابة وتقليل استهلاك الحصص

// دالة استقبال طلبات GET لجلب البيانات
function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getSettings') {
    return handleGetSettings();
  } else if (action === 'getReservations') {
    return handleGetReservations();
  }
  
  return createResponse("error", "Action not found or invalid GET request.");
}

// دالة استقبال طلبات POST لتعديل وحفظ البيانات
function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    var action = requestData.action;
    
    if (action === 'savePrices') {
      return handleSavePrices(requestData.prices);
    } else if (action === 'saveImages') {
      return handleSaveImages(requestData.images);
    } else if (action === 'saveReservation') {
      return handleSaveReservation(requestData.data);
    } else if (action === 'updateStatus') {
      return handleUpdateStatus(requestData.id, requestData.status);
    } else if (action === 'deleteReservation') {
      return handleDeleteReservation(requestData.id);
    } else if (action === 'clearAllReservations') {
      return handleClearAllReservations();
    }
    
    return createResponse("error", "Action not found or invalid POST request.");
  } catch (error) {
    return createResponse("error", "Exception occurred: " + error.toString());
  }
}

// --- معالجة الأسعار والإعدادات ---

function handleGetSettings() {
  var cache = CacheService.getScriptCache();
  var cachedData = cache.get("hotel_settings");
  if (cachedData) {
    return ContentService.createTextOutput(cachedData).setMimeType(ContentService.MimeType.JSON);
  }
  
  var sheet = getOrCreateSheet("Settings");
  var data = sheet.getDataRange().getValues();
  var settings = [];
  
  // قراءة الإعدادات من الجدول (تخطي السطر الأول العناوين)
  for (var i = 1; i < data.length; i++) {
    var key = data[i][0];
    var valStr = data[i][1];
    var valParsed = null;
    try {
      valParsed = JSON.parse(valStr);
    } catch(err) {
      valParsed = valStr;
    }
    if (key) {
      settings.push({ key: key, value: valParsed });
    }
  }
  
  // إذا كانت الإعدادات فارغة، نضع القيم الافتراضية
  if (settings.length === 0) {
    var defaultPrices = { single: 40000, double: 60000, triple: 75000, quad: 100000, family: 125000 };
    var defaultImages = { single: "images/single_room.jpg", double: "images/real_room.jpg", triple: "images/triple_room.jpg", quad: "images/quad_room.jpg", family: "images/family_room_real.jpg" };
    
    saveSettingValue("room_prices", defaultPrices);
    saveSettingValue("room_images", defaultImages);
    
    settings = [
      { key: "room_prices", value: defaultPrices },
      { key: "room_images", value: defaultImages }
    ];
  }
  
  var responsePayload = JSON.stringify({ status: "success", data: settings });
  cache.put("hotel_settings", responsePayload, CACHE_EXPIRATION);
  
  return ContentService.createTextOutput(responsePayload).setMimeType(ContentService.MimeType.JSON);
}

function handleSavePrices(prices) {
  if (!prices) return createResponse("error", "Prices data is missing.");
  
  // حفظ القيمة بشكل دائم في جدول البيانات Google Sheet
  saveSettingValue("room_prices", prices);
  
  // تفريغ الكاش لإجبار الطلب القادم على قراءة البيانات الجديدة مباشرة من الجدول
  var cache = CacheService.getScriptCache();
  cache.remove("hotel_settings");
  
  return createResponse("success", "تم تحديث الأسعار سحابياً بشكل دائم بنجاح.");
}

function handleSaveImages(images) {
  if (!images) return createResponse("error", "Images data is missing.");
  
  saveSettingValue("room_images", images);
  
  var cache = CacheService.getScriptCache();
  cache.remove("hotel_settings");
  
  return createResponse("success", "تم تحديث صور الغرف سحابياً بنجاح.");
}

// دالة مساعدة لحفظ القيم في جدول الإعدادات
function saveSettingValue(key, value) {
  var sheet = getOrCreateSheet("Settings");
  var data = sheet.getDataRange().getValues();
  var valueString = JSON.stringify(value);
  var foundIndex = -1;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      foundIndex = i + 1; // +1 لأن مؤشر الخلايا يبدأ من 1
      break;
    }
  }
  
  if (foundIndex !== -1) {
    sheet.getRange(foundIndex, 2).setValue(valueString);
  } else {
    sheet.appendRow([key, valueString]);
  }
}

// --- معالجة الحجوزات ---

function handleGetReservations() {
  var sheet = getOrCreateSheet("Reservations");
  var data = sheet.getDataRange().getValues();
  var reservations = [];
  
  if (data.length > 1) {
    var headers = data[0];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var res = {};
      for (var j = 0; j < headers.length; j++) {
        res[headers[j]] = row[j];
      }
      reservations.push(res);
    }
  }
  
  // ترتيب الحجوزات تنازلياً حسب التاريخ
  reservations.sort(function(a, b) {
    return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
  });
  
  return createResponse("success", reservations);
}

function handleSaveReservation(resData) {
  if (!resData) return createResponse("error", "Reservation data is missing.");
  
  var sheet = getOrCreateSheet("Reservations");
  
  // نتحقق من عدم تكرار المعرف
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === resData.id) {
      return createResponse("error", "هذا الحجز مسجل مسبقاً سحابياً.");
    }
  }
  
  // إضافة صف جديد بالترتيب الصحيح للأعمدة
  sheet.appendRow([
    resData.id,
    resData.name,
    resData.phone,
    resData.guests,
    resData.payment,
    resData.room,
    resData.checkin,
    resData.checkout,
    resData.nights,
    resData.pricePerNight,
    resData.total,
    resData.status || 'pending',
    resData.date || new Date().toISOString()
  ]);
  
  return createResponse("success", "تم حفظ طلب الحجز سحابياً بنجاح.");
}

function handleUpdateStatus(id, status) {
  var sheet = getOrCreateSheet("Reservations");
  var data = sheet.getDataRange().getValues();
  var found = false;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 12).setValue(status); // العمود 12 هو عمود الحالة (status)
      found = true;
      break;
    }
  }
  
  if (found) {
    return createResponse("success", "تم تحديث حالة الحجز بنجاح.");
  } else {
    return createResponse("error", "طلب الحجز غير موجود.");
  }
}

function handleDeleteReservation(id) {
  var sheet = getOrCreateSheet("Reservations");
  var data = sheet.getDataRange().getValues();
  var found = false;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      found = true;
      break;
    }
  }
  
  if (found) {
    return createResponse("success", "تم حذف الحجز سحابياً بنجاح.");
  } else {
    return createResponse("error", "طلب الحجز غير موجود.");
  }
}

function handleClearAllReservations() {
  var sheet = getOrCreateSheet("Reservations");
  var rows = sheet.getLastRow();
  if (rows > 1) {
    sheet.deleteRows(2, rows - 1); // مسح كل الصفوف مع الإبقاء على ترويسة الجدول فقط
  }
  return createResponse("success", "تم مسح كافة الحجوزات سحابياً بنجاح.");
}

// --- أدوات مساعدة ---

// الحصول على الورقة المطلوبة أو إنشاؤها بالهيكل المناسب إذا لم تكن موجودة
function getOrCreateSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === "Settings") {
      sheet.appendRow(["key", "value"]);
      sheet.getRange("A1:B1").setFontWeight("bold");
    } else if (name === "Reservations") {
      sheet.appendRow([
        "id", "name", "phone", "guests", "payment", "room", 
        "checkin", "checkout", "nights", "price_per_night", 
        "total", "status", "created_at"
      ]);
      sheet.getRange("A1:M1").setFontWeight("bold");
    }
  }
  return sheet;
}

// توليد استجابة JSON للطلب
function createResponse(status, payload) {
  var out = { status: status };
  if (status === "success") {
    out.data = payload;
  } else {
    out.message = payload;
  }
  
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
