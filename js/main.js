// ملف js/main.js - جميع وظائف موقع ناض مع Google Analytics

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إزالة loading
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // تفعيل الوظائف
    initScrollAnimations();
    initFAQ();
    initSmoothScrolling();
    initMobileMenu();
    initThemeSwitcher();
    
    console.log('✅ تم تحميل جميع وظائف موقع ناض للمقاولات بنجاح');
    
    // تتبع تحميل الصفحة
    trackPageLoad();
});

// ===============================
// Google Analytics Functions
// ===============================

// تتبع تحميل الصفحة
function trackPageLoad() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'website_load_complete', {
            event_category: 'engagement',
            event_label: 'موقع ناض محمل بالكامل',
            load_time: Math.round(performance.now())
        });
    }
}

// تتبع إرسال النماذج
function trackFormSubmission(serviceType) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
            event_category: 'contact',
            event_label: serviceType,
            currency: 'SAR',
            value: 200, // قيمة تقديرية للعميل المحتمل
            service_type: serviceType,
            lead_source: 'موقع إلكتروني',
            transport_type: 'beacon'
        });
        
        // حدث إضافي لتتبع نوع الخدمة
        gtag('event', 'service_inquiry', {
            event_category: 'services',
            event_label: serviceType,
            service_category: getServiceCategory(serviceType)
        });
    }
}

// تحديد فئة الخدمة
function getServiceCategory(serviceType) {
    const categories = {
        'mechanical': 'أنظمة ميكانيكية',
        'electrical': 'أنظمة كهربائية',
        'doors': 'أبواب طوارئ',
        'maintenance': 'صيانة',
        'consultation': 'استشارات',
        'complete': 'مشاريع متكاملة'
    };
    return categories[serviceType] || serviceType;
}

// تتبع تحميل الكتالوج
function trackCatalogDownload() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'file_download', {
            event_category: 'engagement',
            event_label: 'دليل خدمات ناض',
            file_name: 'nadh-catalog.pdf',
            file_extension: 'pdf',
            currency: 'SAR',
            value: 50, // قيمة تقديرية للتحميل
            transport_type: 'beacon'
        });
    }
}

// تتبع تغيير التصميم
function trackThemeSwitch(themeNumber) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'customize', {
            event_category: 'engagement',
            event_label: `التصميم ${themeNumber}`,
            theme_number: themeNumber,
            customization_type: 'theme_change'
        });
    }
}

// تتبع البحث في الموقع (إذا أضيف لاحقاً)
function trackSiteSearch(searchTerm, resultsCount) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'search', {
            search_term: searchTerm,
            results_count: resultsCount || 0
        });
    }
}

// تتبع مشاهدة الفيديو (إذا أضيف لاحقاً)
function trackVideoPlay(videoTitle) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'video_play', {
            event_category: 'video',
            event_label: videoTitle,
            video_title: videoTitle
        });
    }
}

// ===============================
// Google Sheets Integration - جديد!
// ===============================

// دالة إرسال النموذج لـ Google Sheets
// دالة إرسال النموذج لـ Google Sheets (النسخة النهائية)
async function submitToGoogleSheets(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        
        const formData = new FormData(form);
        
        // إنشاء نموذج مخفي يرسل لـ Google Form
        const hiddenForm = document.createElement('form');
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://docs.google.com/forms/d/e/1FAIpQLSdJNmss3lSaJqW9pppPXresyLUoCMU79Xuz0czOEZ4XN7qhHw/formResponse';
        hiddenForm.target = 'hidden_iframe';
        hiddenForm.style.display = 'none';
        
        // إضافة الحقول (ستحتاج entry IDs من Google Form)
        // إضافة الحقول مع الـ entry IDs الصحيحة
const fields = {
    'entry.1618351483': formData.get('name'),
    'entry.1973485429': formData.get('email'),
    'entry.843162309': formData.get('phone'),
    'entry.1056047907': formData.get('service'),
    'entry.1781915677': formData.get('message')
};
        
        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            hiddenForm.appendChild(input);
        });
        
        // إنشاء iframe مخفي
        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        
        document.body.appendChild(iframe);
        document.body.appendChild(hiddenForm);
        
        hiddenForm.submit();
        
        // تنظيف بعد الإرسال
        setTimeout(() => {
            document.body.removeChild(hiddenForm);
            document.body.removeChild(iframe);
        }, 2000);
        
        showAlert('✅ تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('خطأ:', error);
        showAlert('❌ حدث خطأ في الإرسال', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// دالة النسخة الاحتياطية - واتساب
function sendToWhatsAppBackup(data) {
    if (!data || !data.name) return;
    
    const serviceNames = {
        'mechanical': 'الأنظمة الميكانيكية',
        'electrical': 'الأنظمة الكهربائية',
        'doors': 'أبواب الطوارئ',
        'maintenance': 'الصيانة والدعم',
        'consultation': 'استشارة فنية',
        'complete': 'مشروع متكامل'
    };
    
    const whatsappMessage = `🏢 *طلب عرض سعر من موقع ناض للمقاولات*

👤 *الاسم:* ${data.name}
📧 *البريد الإلكتروني:* ${data.email}
📱 *رقم الهاتف:* ${data.phone}
🔧 *نوع الخدمة:* ${serviceNames[data.service] || data.service}

📝 *تفاصيل المشروع:*
${data.message}

---
تم الإرسال من موقع: https://nadh.com.sa`;
    
    const whatsappURL = `https://wa.me/966537573006?text=${encodeURIComponent(whatsappMessage)}`;
    
    showAlert('📱 نسخة احتياطية: فتح واتساب للتأكيد', 'info');
    
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 500);
}

// ===============================
// Theme Switcher Functions - محدث مع Analytics
// ===============================

function switchTheme(themeNumber) {
    console.log('تم اختيار التصميم رقم:', themeNumber);
    
    // تتبع تغيير التصميم
    trackThemeSwitch(themeNumber);
    
    const switcher = document.getElementById('themeSwitcher');
    if (switcher) {
        switcher.classList.remove('active');
    }
    
    let targetURL = '';
    const currentPath = window.location.pathname;
    const isInThemeFolder = currentPath.includes('/themes/');
    
    if (themeNumber === 1) {
        targetURL = isInThemeFolder ? '../index.html' : 'index.html';
    } else if (themeNumber === 2) {
        targetURL = isInThemeFolder ? 'theme2.html' : 'themes/theme2.html';
    } else if (themeNumber === 3) {
        targetURL = isInThemeFolder ? 'theme3.html' : 'themes/theme3.html';
    } else if (themeNumber === 4) {
        targetURL = isInThemeFolder ? 'theme4.html' : 'themes/theme4.html';
    } else if (themeNumber === 5) {
        targetURL = isInThemeFolder ? 'theme5.html' : 'themes/theme5.html';
        showAlert('التصميم الخامس قيد التطوير - سيكون متاحاً قريباً', 'info');
        return;
    }
    
    if (targetURL) {
        showAlert('جاري التحويل للتصميم المحدد...', 'info');
        setTimeout(() => {
            window.location.href = targetURL;
        }, 500);
    }
}

// ===============================
// Form Functions - الدالة القديمة محفوظة للتوافق
// ===============================

function handleFormSubmit(event) {
    // هذه الدالة محفوظة للتوافق مع الكود القديم
    // الآن تستدعي الدالة الجديدة
    submitToGoogleSheets(event);
}

// ===============================
// Download & Language Functions - محدث مع Analytics
// ===============================

function downloadCatalog() {
    // تتبع محاولة التحميل
    trackCatalogDownload();
    
    // محاولة تحميل الملف أولاً
    const link = document.createElement('a');
    link.href = 'downloads/nadh-profile-ar.pdf';
    link.download = 'دليل-خدمات-ناض-للمقاولات.pdf';
    link.click();
    
    // إذا لم يوجد الملف، إرسال رسالة واتساب
    link.onerror = function() {
        const message = "مرحباً، أريد تحميل دليل خدمات شركة ناض للمقاولات";
        const whatsappURL = `https://wa.me/966537573006?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };
}

function switchLanguage(lang) {
    // تتبع تغيير اللغة
    if (typeof gtag !== 'undefined') {
        gtag('event', 'language_switch_attempt', {
            event_category: 'engagement',
            event_label: lang,
            target_language: lang
        });
    }
    
    const messages = {
        'en': 'English version will be available soon\nالنسخة الإنجليزية ستكون متاحة قريباً',
        'fr': 'Version française sera bientôt disponible\nالنسخة الفرنسية ستكون متاحة قريباً',  
        'tr': 'Türkçe versiyonu yakında mevcut olacak\nالنسخة التركية ستكون متاحة قريباً'
    };
    
    if (messages[lang]) {
        showAlert(messages[lang], 'info');
    }
}

// ===============================
// باقي الوظائف (بدون تغيير)
// ===============================

function initThemeSwitcher() {
    const currentPage = window.location.pathname;
    let currentTheme = '1';
    
    if (currentPage.includes('theme2.html')) {
        currentTheme = '2';
    } else if (currentPage.includes('theme3.html')) {
        currentTheme = '3';
    }
    
    updateThemeNumber(currentTheme);
    setActiveTheme(currentTheme);
    localStorage.setItem('nadhTheme', currentTheme);
}

function toggleThemeSwitcher() {
    const switcher = document.getElementById('themeSwitcher');
    if (switcher) {
        switcher.classList.toggle('active');
    }
}

function setActiveTheme(themeNumber) {
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        const smallEl = option.querySelector('small');
        if (smallEl) {
            smallEl.textContent = '';
        }
    });
    
    const activeOption = document.querySelector(`[data-theme="${themeNumber}"]`);
    if (activeOption) {
        activeOption.classList.add('active');
        const smallEl = activeOption.querySelector('small');
        if (smallEl) {
            smallEl.textContent = 'الحالي';
        }
    }
}

function updateThemeNumber(themeNumber) {
    const themeNumberEl = document.getElementById('themeNumber');
    if (themeNumberEl) {
        themeNumberEl.textContent = themeNumber;
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu && menuToggle) {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            navMenu.classList.add('active');
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            
            // تتبع فتح القائمة المحمولة
            if (typeof gtag !== 'undefined') {
                gtag('event', 'mobile_menu_open', {
                    event_category: 'engagement',
                    event_label: 'قائمة محمول'
                });
            }
        }
    }
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
}

function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // إغلاق الأخريات
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                    }
                });
                
                // تبديل الحالي
                item.classList.toggle('active');
                
                // تتبع فتح السؤال
                if (!isActive && typeof gtag !== 'undefined') {
                    const questionText = question.querySelector('h3').textContent;
                    gtag('event', 'faq_interaction', {
                        event_category: 'engagement',
                        event_label: questionText,
                        interaction_type: 'expand'
                    });
                }
            });
        }
    });
}

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 60;
                const targetPos = target.offsetTop - headerHeight;
                
                // تتبع التنقل الداخلي
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'internal_navigation', {
                        event_category: 'navigation',
                        event_label: targetId.replace('#', ''),
                        navigation_type: 'smooth_scroll'
                    });
                }
                
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
                
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        }
    }
});

// ===============================
// Alert System (بدون تغيير)
// ===============================

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${getAlertIcon(type)}"></i>
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    alert.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${getAlertColor(type)};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: 'Cairo', sans-serif;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        hideAlert(alert);
    }, 5000);
    
    alert.querySelector('.alert-close').addEventListener('click', () => {
        hideAlert(alert);
    });
}

function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getAlertColor(type) {
    const colors = {
        'success': '#10B981',
        'error': '#EF4444', 
        'warning': '#F59E0B',
        'info': '#3B82F6'
    };
    return colors[type] || '#3B82F6';
}

function hideAlert(alert) {
    alert.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 300);
}

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            console.warn('فشل تحميل الصورة:', this.src);
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjNEVDREM0Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkNhaXJvLCBzYW5zLXNlcmlmIj7Zhtin2LY8L3RleHQ+PC9zdmc+';
            this.alt = 'شعار ناض';
        });
    });
});

window.addEventListener('error', function(e) {
    console.error('خطأ في الموقع:', e.error);
});

// إجعل الوظائف متاحة عالمياً
window.toggleThemeSwitcher = toggleThemeSwitcher;
window.switchTheme = switchTheme;
window.handleFormSubmit = handleFormSubmit;
window.submitToGoogleSheets = submitToGoogleSheets; // الدالة الجديدة
window.downloadCatalog = downloadCatalog;
window.switchLanguage = switchLanguage;
window.toggleMobileMenu = toggleMobileMenu;