// Главный класс приложения
class SibModulingApp {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
        this.isDesktop = window.innerWidth > 992;
        
        this.init();
    }
    
    init() {
        // Инициализация при загрузке DOM
        document.addEventListener('DOMContentLoaded', () => {
            this.initNavigation();
            this.initMobileMenu();
            this.initSmoothScroll();
            this.initHeaderEffects();
            this.initContactInfo();
            this.initSocialLinks();
            this.initAccessibility();
            this.initPerformance();
            this.initErrorHandling();
            
            console.log('СибМодулинг приложение инициализировано');
        });
    }
    
    initNavigation() {
        const header = document.getElementById('header');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Эффект скролла для хедера
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Активная навигация
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Удалить активный класс у всех ссылок
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Добавить активный класс к текущей ссылке
                link.classList.add('active');
                
                // Закрыть мобильное меню если открыто
                this.closeMobileMenu();
            });
        });
        
        // Обновление активной навигации при скролле
        this.updateActiveNavigationOnScroll();
    }
    
    updateActiveNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
// ==================== ВАЖНО: ЗАМЕНИТЬ ЭТОТ МЕТОД ЦЕЛИКОМ ====================
initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!mobileMenuBtn || !navMenu) {
        console.error('Элементы мобильного меню не найдены');
        return;
    }
    
    console.log('✅ Мобильное меню: кнопка и меню найдены');
    
    // Обработчик клика по кнопке меню
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🟡 Кнопка меню нажата');
        
        // Открыть/закрыть меню
        const isActive = navMenu.classList.toggle('active');
        
        // Поменять иконку
        if (isActive) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Блокируем скролл
            console.log('✅ Меню открыто');
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Разблокируем скролл
            console.log('✅ Меню закрыто');
        }
    });
    
    // Закрыть меню при клике на ссылку
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            console.log('🟡 Ссылка меню нажата');
            this.closeMobileMenu();
        });
    });
    
    // Закрыть меню при клике вне его
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            console.log('🟡 Клик вне меню');
            this.closeMobileMenu();
        }
    });
    
    // Закрыть меню на клавишу Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            console.log('🟡 Нажата Escape');
            this.closeMobileMenu();
        }
    });
    
    console.log('✅ Мобильное меню инициализировано');
}

// ==================== ТАКЖЕ ЗАМЕНИТЬ ЭТОТ МЕТОД ====================
closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        console.log('✅ Меню закрыто программно');
    }
}
    
    initSmoothScroll() {
        // Плавный скролл для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Пропустить ссылки без якоря или с другим поведением
                if (href === '#' || href.startsWith('#!')) return;
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (!targetElement) return;
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    initHeaderEffects() {
        const header = document.getElementById('header');
        const logo = document.querySelector('.logo img');
        
        if (!header || !logo) return;
        
        // Эффект при скролле
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Уменьшение логотипа при скролле
            if (currentScroll > 100) {
                logo.style.height = '40px';
            } else {
                logo.style.height = '50px';
            }
            
            // Скрытие/показа хедера при скролле
            if (currentScroll > lastScroll && currentScroll > 200) {
                // Скролл вниз
                header.style.transform = 'translateY(-100%)';
            } else {
                // Скролл вверх
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    async initContactInfo() {
        try {
            // Загрузка контактов из базы данных
            await Database.loadContacts();
            const contacts = Database.contacts;
            
            // Обновление контактной информации в футере
            this.updateContactElements(contacts);
            
            // Обновление контактной информации в секции контактов
            this.updateContactSection(contacts);
            
        } catch (error) {
            console.error('Ошибка загрузки контактов:', error);
        }
    }
    
    updateContactElements(contacts) {
        // Обновление телефона в хедере
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            if (link.textContent.includes('+7')) {
                link.textContent = contacts.phone;
                link.href = `tel:${contacts.phone.replace(/\D/g, '')}`;
            }
        });
        
        // Обновление email
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            if (link.textContent.includes('@')) {
                link.textContent = contacts.email;
                link.href = `mailto:${contacts.email}`;
            }
        });
        
        // Обновление адреса
        const addressElements = document.querySelectorAll('.contact-details p:first-child');
        addressElements.forEach(el => {
            if (el.textContent.includes('Новосибирск')) {
                el.textContent = contacts.address;
            }
        });
    }
    
    updateContactSection(contacts) {
        // Обновление информации в секции контактов
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            const icon = item.querySelector('.contact-icon i');
            if (!icon) return;
            
            switch (icon.className) {
                case 'fas fa-map-marker-alt':
                    item.querySelector('p').textContent = contacts.address;
                    break;
                case 'fas fa-phone':
                    item.querySelector('p').textContent = contacts.phone;
                    break;
                case 'fas fa-envelope':
                    item.querySelector('p').textContent = contacts.email;
                    break;
                case 'fas fa-clock':
                    item.querySelector('p').innerHTML = `
                        Пн-Пт: ${contacts.schedule?.weekdays || '9:00-20:00'}<br>
                        Сб-Вс: ${contacts.schedule?.weekends || '10:00-18:00'}
                    `;
                    break;
            }
        });
        
        // Обновление координат для карты
        if (contacts.coordinates && window.mapManager) {
            window.mapManager.updateLocation(
                contacts.coordinates.lat,
                contacts.coordinates.lng,
                contacts.address
            );
        }
        
        // Обновление информации о транспорте
        if (contacts.transport) {
            this.updateTransportInfo(contacts.transport);
        }
    }
    
    updateTransportInfo(transport) {
        const mapInfo = document.querySelector('.map-info');
        if (mapInfo) {
            mapInfo.innerHTML = `
                <p><i class="fas fa-subway"></i> Метро: ст. "${transport.metro}"</p>
                <p><i class="fas fa-bus"></i> Автобусы: ${transport.buses.join(', ')}</p>
                <p><i class="fas fa-car"></i> ${transport.parking}</p>
            `;
        }
    }
    
    initSocialLinks() {
        // Открытие социальных ссылок в новой вкладке
        document.querySelectorAll('.social-link').forEach(link => {
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
        
        // Добавление анимации для социальных иконок
        document.querySelectorAll('.social-link i').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = '';
            });
        });
    }
    
    initAccessibility() {
        // Улучшение доступности для клавиатуры
        document.addEventListener('keydown', (e) => {
            // Фокус на модальном окне
            if (e.key === 'Tab' && document.querySelector('.modal.active')) {
                this.trapFocusInModal(e);
            }
        });
        
        // Добавление aria-атрибутов
        this.initAriaAttributes();
        
        // Улучшение доступности для скринридеров
        this.initScreenReaderSupport();
    }
    
    trapFocusInModal(e) {
        const modal = document.querySelector('.modal.active');
        if (!modal) return;
        
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusable.length === 0) return;
        
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];
        
        if (e.shiftKey) {
            // shift + tab
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            // tab
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
    
    initAriaAttributes() {
        // Мобильное меню
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.setAttribute('aria-controls', 'navMenu');
            
            navMenu.setAttribute('aria-label', 'Основная навигация');
            
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = navMenu.classList.contains('active');
                mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            });
        }
        
        // Карточки товаров
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', `Товар ${index + 1}`);
        });
        
        // Модальные окна
        document.querySelectorAll('.modal').forEach(modal => {
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-hidden', 'true');
            
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.setAttribute('aria-label', 'Закрыть');
            }
        });
    }
    
    initScreenReaderSupport() {
        // Уведомления для скринридеров
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        
        // Функция для объявления изменений
        this.announceToScreenReader = (message) => {
            liveRegion.textContent = '';
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 100);
        };
        
        // Стили для скринридеров
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            .focus-visible {
                outline: 2px solid var(--accent-teal);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    initPerformance() {
        // Отложенная загрузка изображений
        this.initLazyLoading();
        
        // Предзагрузка важных ресурсов
        this.preloadImportantResources();
        
        // Оптимизация анимаций
        this.optimizeAnimations();
    }
    
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback для старых браузеров
            lazyImages.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        }
    }
    
    preloadImportantResources() {
        // Предзагрузка шрифтов
        const fontLinks = document.querySelectorAll('link[rel="stylesheet"][href*="fonts"]');
        fontLinks.forEach(link => {
            link.rel = 'preload';
            link.as = 'style';
        });
        
        // Предзагрузка критического CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.href = 'css/style.css';
        criticalCSS.as = 'style';
        document.head.appendChild(criticalCSS);
    }
    
    optimizeAnimations() {
        // Отключение анимаций для пользователей с настройками
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (mediaQuery.matches) {
            document.body.classList.add('reduce-motion');
            
            // Остановка всех CSS анимаций
            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion *,
                .reduce-motion *::before,
                .reduce-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    initErrorHandling() {
        // Глобальный обработчик ошибок
        window.addEventListener('error', (e) => {
            console.error('Глобальная ошибка:', e.error);
            this.logError(e.error);
        });
        
        // Обработчик необработанных промисов
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Необработанный промис:', e.reason);
            this.logError(e.reason);
        });
    }
    
    logError(error) {
        // Логирование ошибок (можно отправить на сервер)
        const errorData = {
            message: error.message,
            stack: error.stack,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        console.log('Ошибка залогирована:', errorData);
        
        // Можно отправить на сервер
        // this.sendErrorToServer(errorData);
    }
    
    sendErrorToServer(errorData) {
        // Отправка ошибок на сервер для анализа
        fetch('/server/api.php?action=log_error', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(errorData)
        }).catch(() => {
            // Игнорируем ошибки отправки логов
        });
    }
    
    // Публичные методы
    refresh() {
        // Обновление приложения
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
        this.isDesktop = window.innerWidth > 992;
        
        // Обновление контактов
        this.initContactInfo();
        
        // Обновление анимаций
        if (window.animations) {
            window.animations.refreshAnimations();
        }
    }
    
    showNotification(message, type = 'info') {
        // Показать уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#2ecc71' : '#3498db'}; 
                         color: white; padding: 15px 20px; border-radius: 10px; z-index: 3000; box-shadow: 0 5px 15px rgba(0,0,0,0.2); 
                         display: flex; align-items: center; gap: 10px; animation: slideInRight 0.3s ease;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: 10px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Добавить анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Инициализация приложения
window.addEventListener('DOMContentLoaded', () => {
    window.app = new SibModulingApp();
    
    // Экспорт глобальных методов для использования в HTML
    window.setProductForConsultation = (productTitle) => {
        if (window.formManager) {
            window.formManager.setFormProduct(productTitle);
            window.formManager.scrollToForm();
        }
    };
    
    window.showProductDetails = (productId) => {
        if (window.catalog) {
            window.catalog.showProductDetails(productId);
        }
    };
});