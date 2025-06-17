// ملف config/admin-config.js - البيانات الحساسة (محمي)

// ⚠️ هذا الملف يحتوي على بيانات حساسة - لا تشاركه مع أحد
// تأكد من إضافته لـ .gitignore

const ADMIN_CONFIG = {
    // بيانات تسجيل الدخول
    credentials: {
        username: 'nadh_admin',
        // كلمة المرور مشفرة بـ SHA-256
        passwordHash: '3db558e85f029bbd773e43ad8d0663ae4caa6aea9e1846bfc1423f9002a8047b', // nadh2025@secure
        // إذا أردت تغيير كلمة المرور، استخدم: https://emn178.github.io/online-tools/sha256.html
    },
    
    // بيانات Google Sheets
    googleSheets: {
        // معرف الجدول من الرابط
        spreadsheetId: '1DcZZQ7sjhLLkTqygRaiMc7jPkxnZD-jIiSXEEUUeH_Y',
        
        // أسماء الأوراق
        sheets: {
            messages: 'رسائل التواصل',
            analytics: 'إحصائيات الزيارات', 
            summary: 'ملخص يومي'
        },
        
        // رابط مباشر للجدول
        directUrl: 'https://docs.google.com/spreadsheets/d/1DcZZQ7sjhLLkTqygRaiMc7jPkxnZD-jIiSXEEUUeH_Y/edit?gid=0#gid=0',
        
        // رابط Apps Script (سيتم تحديثه)
        appsScriptUrl: 'https://script.google.com/macros/s/AKfycbx9XQl36D7iYeekg-8DU5m0zfgOhSepXntAtOFVz9bEGly-qmWJsePYpxLAM_u4b_T0iw/exec'
    },
    
    // إعدادات Google Analytics
    analytics: {
        // معرف GA4 الخاص بك
        measurementId: 'G-0XX64MVZ1W',
        
        // فعال أم لا
        enabled: true,
        
        // تتبع أحداث مخصصة
        trackEvents: true
    },
    
    // إعدادات الأمان
    security: {
        // مدة انتهاء الجلسة (بالدقائق)
        sessionTimeout: 60,
        
        // عدد محاولات تسجيل الدخول المسموحة
        maxLoginAttempts: 3,
        
        // مدة الحظر بعد المحاولات الفاشلة (بالدقائق)
        blockDuration: 15
    },
    
    // معلومات الشركة
    company: {
        name: 'شركة ناض للمقاولات العامة',
        nameEn: 'NADH General Contracting',
        email: 'Nadhksa@gmail.com',
        phone: '0537573006',
        website: 'https://nadh.com.sa',
        logo: 'images/logo-large.png',
        logoSmall: 'images/logo-small.png'
    },
    
    // إعدادات التحديث التلقائي
    refresh: {
        // فترة التحديث التلقائي (بالثواني)
        interval: 300, // 5 دقائق
        
        // تفعيل التحديث التلقائي
        enabled: true
    }
};

// دالة للحصول على hash كلمة المرور الجديدة
function generatePasswordHash(password) {
    // استخدم هذه الدالة لإنشاء hash جديد عند تغيير كلمة المرور
    // مثال: generatePasswordHash('كلمة_المرور_الجديدة')
    return CryptoJS.SHA256(password).toString();
}

// تصدير الإعدادات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ADMIN_CONFIG;
} else {
    window.ADMIN_CONFIG = ADMIN_CONFIG;
}