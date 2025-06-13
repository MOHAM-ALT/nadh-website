// ملف js/main.js - جميع وظائف موقع ناض للمقاولات - نسخة محدثة

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
});

// ===============================
// Theme Switcher Functions - محدث
// ===============================

function initThemeSwitcher() {
    // تحديد التصميم الحالي حسب الصفحة
    const currentPage = window.location.pathname;
    let currentTheme = '1'; // الافتراضي
    
    if (currentPage.includes('theme2.html')) {
        currentTheme = '2';
    } else if (currentPage.includes('theme3.html')) {
        currentTheme = '3';
    }
    
    // تحديث رقم التصميم في الزر
    updateThemeNumber(currentTheme);
    setActiveTheme(currentTheme);
    
    // حفظ التصميم الحالي
    localStorage.setItem('nadhTheme', currentTheme);
}

// تبديل قائمة الثيمات
function toggleThemeSwitcher() {
    const switcher = document.getElementById('themeSwitcher');
    if (switcher) {
        switcher.classList.toggle('active');
        console.log('تم تفعيل/إلغاء قائمة التصميمات');
    }
}

// التبديل بين التصميمات
// استبدال دالة switchTheme القديمة بهذه الجديدة
function switchTheme(themeNumber) {
    console.log('تم اختيار التصميم رقم:', themeNumber);
    
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

function setActiveTheme(themeNumber) {
    // إزالة active من جميع الخيارات
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
        const smallEl = option.querySelector('small');
        if (smallEl) {
            smallEl.textContent = '';
        }
    });
    
    // إضافة active للتصميم المختار
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

// إغلاق قائمة التصميمات عند الضغط خارجها
document.addEventListener('click', function(e) {
    const switcher = document.getElementById('themeSwitcher');
    if (switcher && !switcher.contains(e.target)) {
        switcher.classList.remove('active');
    }
});

// ===============================
// Mobile Menu Functions
// ===============================

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
        }
    }
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
}

// ===============================
// Form Functions
// ===============================

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // التحقق من البيانات
    if (!name || !email || !phone || !service || !message) {
        showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // إنشاء رسالة واتساب
    const serviceNames = {
        'mechanical': 'الأنظمة الميكانيكية',
        'electrical': 'الأنظمة الكهربائية',
        'doors': 'أبواب الطوارئ',
        'maintenance': 'الصيانة والدعم',
        'consultation': 'استشارة فنية',
        'complete': 'مشروع متكامل'
    };
    
    const whatsappMessage = `مرحباً، أريد عرض سعر من شركة ناض للمقاولات:

الاسم: ${name}
البريد الإلكتروني: ${email}
رقم الهاتف: ${phone}
نوع الخدمة: ${serviceNames[service] || service}

تفاصيل المشروع:
${message}`;
    
    // إرسال لواتساب
    const whatsappURL = `https://wa.me/966537573006?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, '_blank');
    
    // رسالة نجاح
    showAlert('تم إرسال طلبك بنجاح! سيتم تحويلك لواتساب.', 'success');
    event.target.reset();
}

// ===============================
// Download & Language Functions
// ===============================

function downloadCatalog() {
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
// Animation Functions
// ===============================

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

// ===============================
// FAQ Functions
// ===============================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // إغلاق الأخريات
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                    }
                });
                
                // تبديل الحالي
                item.classList.toggle('active');
            });
        }
    });
}

// ===============================
// Smooth Scrolling
// ===============================

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
                
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
                
                // إغلاق القائمة المحمولة
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// ===============================
// Header Scroll Effects
// ===============================

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
// Alert System
// ===============================

function showAlert(message, type = 'info') {
    // إنشاء عنصر التنبيه
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${getAlertIcon(type)}"></i>
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    // إضافة الأنماط
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
    
    // إظهار التنبيه
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
    }, 100);
    
    // إخفاء تلقائي
    setTimeout(() => {
        hideAlert(alert);
    }, 5000);
    
    // إغلاق يدوي
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

// ===============================
// Image Optimization
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            console.warn('فشل تحميل الصورة:', this.src);
            // إضافة placeholder بدلاً من إخفاء الصورة
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjNEVDREM0Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9IkNhaXJvLCBzYW5zLXNlcmlmIj7Zhtin2LY8L3RleHQ+PC9zdmc+';
            this.alt = 'شعار ناض';
        });
    });
});

// ===============================
// Error Handling
// ===============================

window.addEventListener('error', function(e) {
    console.error('خطأ في الموقع:', e.error);
});

// إجعل الوظائف متاحة عالمياً
window.toggleThemeSwitcher = toggleThemeSwitcher;
window.switchTheme = switchTheme;
window.handleFormSubmit = handleFormSubmit;
window.downloadCatalog = downloadCatalog;
window.switchLanguage = switchLanguage;
window.toggleMobileMenu = toggleMobileMenu;