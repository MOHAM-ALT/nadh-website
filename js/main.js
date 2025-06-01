// ملف js/main.js - جميع وظائف JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Initialize animations
    initScrollAnimations();
    
    // Initialize FAQ functionality
    initFAQ();
    
    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
});

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

// Handle header scroll effect
function handleHeaderScroll() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = 'var(--shadow-lg)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'var(--shadow-sm)';
    }
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const menu = document.getElementById('navMenu');
                menu.classList.remove('active');
            }
        });
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Initialize FAQ functionality
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Download catalog function
function downloadCatalog() {
    // إنشاء رابط تحميل للملف PDF المرفق
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,'; // هنا يمكن إضافة الملف المرفق كـ base64
    link.download = 'دليل-خدمات-شركة-ناض.pdf';
    
    // عرض رسالة للمستخدم
    const button = event.target.closest('.btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحضير...';
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> تم تحديث دليل الخدمات!';
        alert('تم تحديث دليل خدمات شركة ناض! يرجى التواصل معنا مباشرة للحصول على النسخة الأحدث.');
        
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 3000);
    }, 2000);
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };

    // Get submit button
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitButton.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // Show success message
        showSuccessMessage(data);
        
        // Reset form
        event.target.reset();
        
        // Reset button
        submitButton.innerHTML = '<i class="fas fa-check"></i> تم الإرسال بنجاح!';
        submitButton.style.background = 'var(--primary-teal)';
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.style.background = 'var(--gradient-primary)';
            submitButton.disabled = false;
        }, 3000);
    }, 2000);
}

// Show success message
function showSuccessMessage(data) {
    const serviceNames = {
        'mechanical': 'الأنظمة الميكانيكية',
        'electrical': 'الأنظمة الكهربائية',
        'doors': 'أبواب الطوارئ',
        'maintenance': 'الصيانة والدعم',
        'consultation': 'استشارة فنية',
        'complete': 'مشروع متكامل'
    };

    // Create success modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        margin: 1rem;
        text-align: center;
        box-shadow: var(--shadow-xl);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="color: var(--primary-teal); font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: var(--gray-800); margin-bottom: 1rem;">شكراً لكم ${data.name}!</h3>
        <p style="color: var(--gray-600); line-height: 1.6; margin-bottom: 1.5rem;">
            تم استلام طلبكم بنجاح وسيتم التواصل معكم خلال 24 ساعة من فريق شركة ناض للمقاولات العامة.
        </p>
        <div style="background: var(--gray-50); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: right;">
            <p><strong>الخدمة المطلوبة:</strong> ${serviceNames[data.service] || 'غير محدد'}</p>
            <p><strong>رقم الهاتف:</strong> ${data.phone}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
        </div>
        <button onclick="this.closest('.modal').remove()" class="btn btn-primary">
            حسناً
        </button>
    `;
    
    modal.appendChild(modalContent);
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Animate in
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// وظيفة تحويل اللغة محسنة
function switchLanguage(lang) {
    const translations = {
        'en': {
            'الرئيسية': 'Home',
            'خدماتنا': 'Services', 
            'من نحن': 'About',
            'شركاء النجاح': 'Partners',
            'اتصل بنا': 'Contact',
            'عرض سعر': 'Quote',
            'ناض للمقاولات العامة': 'NADH Contracting',
            'عربي': 'Arabic'
        },
        'fr': {
            'الرئيسية': 'Accueil',
            'خدماتنا': 'Services',
            'من نحن': 'À Propos',
            'شركاء النجاح': 'Partenaires',
            'اتصل بنا': 'Contact',
            'عرض سعر': 'Devis',
            'ناض للمقاولات العامة': 'NADH Entrepreneur',
            'عربي': 'Arabe'
        },
        'tr': {
            'الرئيسية': 'Ana Sayfa',
            'خدماتنا': 'Hizmetler',
            'من نحن': 'Hakkımızda', 
            'شركاء النجاح': 'Ortaklar',
            'اتصل بنا': 'İletişim',
            'عرض سعر': 'Teklif',
            'ناض للمقاولات العامة': 'NADH Müteahhitlik',
            'عربي': 'Arapça'
        }
    };
    
    if (translations[lang]) {
        // تحديث النصوص في الهيدر فقط
        const headerElements = document.querySelector('.header').querySelectorAll('*');
        headerElements.forEach(el => {
            if (el.textContent && translations[lang][el.textContent.trim()]) {
                el.textContent = translations[lang][el.textContent.trim()];
            }
        });
        
        // تحديث اتجاه الصفحة
        if (lang !== 'ar') {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', lang);
        }
        
        // تحديث زر اللغة
        const langBtn = document.querySelector('.language-btn span');
        const langMap = {
            'en': 'English',
            'fr': 'Français', 
            'tr': 'Türkçe'
        };
        if (langBtn) langBtn.textContent = langMap[lang];
        
        // تحديث العنصر النشط
        document.querySelectorAll('.language-option').forEach(opt => {
            opt.classList.remove('active');
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }
    }
}