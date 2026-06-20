// app.js - ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ ВЕРСИЯ, СООТВЕТСТВУЮЩАЯ ГОСТ Р 52872-2019
// Главный класс приложения для управления доступностью и функциональностью

class SibModulingApp {
    constructor() {
        // Определение типа устройства
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
        this.isDesktop = window.innerWidth > 992;
        
        // Хранилище для последнего сфокусированного элемента
        this.lastFocusedElement = null;
        
        // Live region для скринридеров
        this.liveRegion = null;
        
        // Инициализация приложения
        this.init();
    }
    
    /**
     * Главный метод инициализации
     */
    init() {
        // Ожидаем полной загрузки DOM
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Инициализация приложения АЙ ДА МОДУЛЬ (ГОСТ-версия)');
            
            // Последовательная инициализация всех компонентов
            this.initAccessibilityBasics();
            this.initNavigation();
            this.initMobileMenu();
            this.initSmoothScroll();
            this.initHeaderEffects();
            this.initAriaAttributes();
            this.initKeyboardSupport();
            this.initFocusManagement();
            this.initLiveRegion();
            this.initReducedMotionSupport();
            this.initPerformanceOptimizations();
            this.initErrorHandling();
            
            // Объявляем о готовности приложения для скринридеров
            this.announceToScreenReader('Сайт АЙ ДА МОДУЛЬ загружен. Используйте клавишу Tab для навигации.');
            
            console.log('✅ АЙ ДА МОДУЛЬ приложение успешно инициализировано (ГОСТ-совместимая версия)');
        });
        
        // Обработчики событий окна
        window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
        window.addEventListener('load', this.handleLoad.bind(this));
    }
    
    /**
     * Базовые настройки доступности
     */
    initAccessibilityBasics() {
        // Убеждаемся, что у html есть атрибут lang
        const html = document.documentElement;
        if (!html.getAttribute('lang')) {
            html.setAttribute('lang', 'ru');
        }
        
        // Добавляем заголовок для main, если его нет
        const main = document.querySelector('main');
        if (main && !main.getAttribute('aria-labelledby') && !main.getAttribute('aria-label')) {
            main.setAttribute('aria-label', 'Основное содержание страницы');
        }
        
        // Проверяем все изображения на наличие alt
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', '');
                console.warn('Изображение без alt атрибута:', img.src);
            }
        });
        
        // Добавляем aria-hidden="true" ко всем декоративным иконкам
        document.querySelectorAll('i[class*="fa-"]').forEach(icon => {
            if (!icon.hasAttribute('aria-hidden')) {
                icon.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    /**
     * Инициализация навигации
     */
    initNavigation() {
        const header = document.getElementById('header');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!header) {
            console.error('❌ Элемент header не найден');
            return;
        }
        
        console.log('✅ Навигация: header найден');
        
        // Эффект при скролле
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Обновляем активную навигацию
            this.updateActiveNavigation();
        }, { passive: true });
        
        // Обработчики кликов для ссылок навигации
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Удаляем активный класс у всех ссылок
                navLinks.forEach(l => {
                    l.classList.remove('active');
                    l.removeAttribute('aria-current');
                });
                
                // Добавляем активный класс текущей ссылке
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                
                // Закрываем мобильное меню если открыто
                this.closeMobileMenu();
            });
        });
        
        console.log('✅ Навигация инициализирована');
    }
    
    /**
     * Обновление активной навигации при скролле
     */
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 150; // Смещение для учета header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                    
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }
    
    /**
     * Инициализация мобильного меню с поддержкой доступности
     */
    initMobileMenu() {
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.navMenu = document.getElementById('navMenu');
        
        if (!this.mobileMenuBtn || !this.navMenu) {
            console.error('❌ Элементы мобильного меню не найдены');
            return;
        }
        
        console.log('✅ Мобильное меню: элементы найдены');
        
        // Устанавливаем начальные ARIA атрибуты
        this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        this.mobileMenuBtn.setAttribute('aria-controls', 'navMenu');
        this.mobileMenuBtn.setAttribute('aria-label', 'Открыть меню навигации');
        
        this.navMenu.setAttribute('aria-label', 'Основное меню');
        
        // Обработчик клика по кнопке меню
        this.mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
        });
        
        // Закрытие меню при клике на ссылку
        this.navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('active') &&
                !this.navMenu.contains(e.target) &&
                !this.mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Закрытие меню по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
                this.mobileMenuBtn.focus(); // Возвращаем фокус на кнопку
            }
        });
        
        console.log('✅ Мобильное меню инициализировано');
    }
    
    /**
     * Переключение мобильного меню
     */
    toggleMobileMenu() {
        if (!this.mobileMenuBtn || !this.navMenu) return;
        
        const isActive = this.navMenu.classList.toggle('active');
        
        if (isActive) {
            // Открываем меню
            this.mobileMenuBtn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i><span class="sr-only">Закрыть меню</span>';
            this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
            this.mobileMenuBtn.setAttribute('aria-label', 'Закрыть меню навигации');
            document.body.style.overflow = 'hidden';
            
            // Объявляем скринридеру
            this.announceToScreenReader('Меню открыто. Используйте стрелки для навигации.');
            
            // Устанавливаем фокус на первый пункт меню
            setTimeout(() => {
                const firstLink = this.navMenu.querySelector('.nav-link');
                if (firstLink) {
                    firstLink.focus();
                }
            }, 100);
        } else {
            // Закрываем меню
            this.mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i><span class="sr-only">Открыть меню</span>';
            this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            this.mobileMenuBtn.setAttribute('aria-label', 'Открыть меню навигации');
            document.body.style.overflow = '';
            
            // Объявляем скринридеру
            this.announceToScreenReader('Меню закрыто');
        }
    }
    
    /**
     * Закрытие мобильного меню
     */
    closeMobileMenu() {
        if (this.navMenu && this.navMenu.classList.contains('active')) {
            this.navMenu.classList.remove('active');
            this.mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i><span class="sr-only">Открыть меню</span>';
            this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            this.mobileMenuBtn.setAttribute('aria-label', 'Открыть меню навигации');
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Плавный скролл к якорям
     */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Пропускаем пустые ссылки и ссылки с javascript
                if (href === '#' || href.startsWith('#!') || href === 'javascript:void(0)') {
                    return;
                }
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (!targetElement) return;
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Устанавливаем фокус на целевой элемент для скринридеров
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
                
                // Объявляем скринридеру
                this.announceToScreenReader(`Переход к разделу ${targetElement.getAttribute('aria-labelledby') || href.substring(1)}`);
            });
        });
        
        console.log('✅ Плавный скролл инициализирован');
    }
    
    /**
     * Эффекты для header при скролле
     */
    initHeaderEffects() {
        const header = document.getElementById('header');
        const logo = document.querySelector('.logo-img');
        
        if (!header || !logo) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Уменьшаем логотип при скролле
            if (currentScroll > 100) {
                logo.style.height = '40px';
            } else {
                logo.style.height = '50px';
            }
            
            // Скрываем/показываем header при скролле
            if (currentScroll > lastScroll && currentScroll > 200) {
                // Скролл вниз
                header.style.transform = 'translateY(-100%)';
                header.setAttribute('aria-hidden', 'true');
            } else {
                // Скролл вверх
                header.style.transform = 'translateY(0)';
                header.setAttribute('aria-hidden', 'false');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
        
        console.log('✅ Эффекты header инициализированы');
    }
    
    /**
     * Инициализация всех ARIA атрибутов
     */
    initAriaAttributes() {
        // ===== МОБИЛЬНОЕ МЕНЮ =====
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-label', 'Открыть меню навигации');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.setAttribute('aria-controls', 'navMenu');
        }
        
        if (navMenu) {
            navMenu.setAttribute('aria-label', 'Основное меню сайта');
            navMenu.setAttribute('role', 'list');
            
            // Добавляем role="listitem" для пунктов меню
            navMenu.querySelectorAll('li').forEach(item => {
                item.setAttribute('role', 'listitem');
            });
        }
        
        // ===== КАРТОЧКИ ТОВАРОВ =====
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', `Товар ${index + 1}`);
            
            // Добавляем aria-labelledby для заголовка
            const title = card.querySelector('.product-title');
            if (title && !title.id) {
                title.id = `product-title-${index}`;
                card.setAttribute('aria-labelledby', title.id);
            }
        });
        
        // ===== МОДАЛЬНОЕ ОКНО =====
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'modal-title');
            modal.setAttribute('aria-describedby', 'modal-desc');
            modal.setAttribute('hidden', '');
        }
        
        // ===== СОЦИАЛЬНЫЕ ССЫЛКИ =====
        document.querySelectorAll('.social-link').forEach((link, index) => {
            // Определяем соцсеть по иконке
            const icon = link.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                let socialName = '';
                
                if (iconClass.includes('fa-telegram')) socialName = 'Telegram';
                else if (iconClass.includes('fa-whatsapp')) socialName = 'WhatsApp';
                else if (iconClass.includes('fa-vk')) socialName = 'ВКонтакте';
                else if (iconClass.includes('fa-youtube')) socialName = 'YouTube';
                else socialName = `социальная сеть ${index + 1}`;
                
                link.setAttribute('aria-label', socialName);
            }
            
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
        
        // ===== КНОПКИ =====
        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-small').forEach((btn, index) => {
            // Добавляем aria-label если кнопка содержит только иконку
            if (btn.children.length === 1 && btn.querySelector('i') && !btn.querySelector('span')) {
                const icon = btn.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    let label = 'Кнопка';
                    
                    if (iconClass.includes('fa-phone')) label = 'Позвонить';
                    else if (iconClass.includes('fa-calculator')) label = 'Рассчитать стоимость';
                    else if (iconClass.includes('fa-eye')) label = 'Смотреть каталог';
                    else if (iconClass.includes('fa-shopping-cart')) label = 'Заказать';
                    else if (iconClass.includes('fa-images')) label = 'Подробнее';
                    else if (iconClass.includes('fa-paper-plane')) label = 'Отправить';
                    
                    btn.setAttribute('aria-label', label);
                }
            }
        });
        
        // ===== ФОРМА =====
        const form = document.getElementById('consultationForm');
        if (form) {
            form.setAttribute('novalidate', '');
            
            // Добавляем aria-describedby для полей с ошибками
            document.querySelectorAll('#name, #phone, #email, #message').forEach(field => {
                const errorId = `${field.id}Error`;
                if (document.getElementById(errorId)) {
                    field.setAttribute('aria-describedby', errorId);
                }
            });
        }
        
        console.log('✅ ARIA атрибуты инициализированы');
    }
    
    /**
     * Поддержка клавиатурной навигации
     */
    initKeyboardSupport() {
        // Trap focus в модальном окне
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal.active');
            if (!modal) return;
            
            if (e.key === 'Tab') {
                this.trapFocusInModal(e, modal);
            }
        });
        
        // Клавиатурные сокращения
        document.addEventListener('keydown', (e) => {
            // Alt + M - открыть/закрыть меню
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                this.toggleMobileMenu();
            }
            
            // Alt + H - на главную
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                this.announceToScreenReader('Переход на главную');
            }
            
            // Alt + C - к каталогу
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                this.announceToScreenReader('Переход к каталогу');
            }
            
            // Alt + K - к контактам
            if (e.altKey && e.key === 'k') {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                this.announceToScreenReader('Переход к контактам');
            }
        });
        
        console.log('✅ Клавиатурная поддержка инициализирована');
    }
    
    /**
     * Trap focus внутри модального окна
     */
    trapFocusInModal(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
    
    /**
     * Управление фокусом при открытии/закрытии модальных окон
     */
    initFocusManagement() {
        const modal = document.getElementById('successModal');
        if (!modal) return;
        
        // Наблюдаем за изменением классов модального окна
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (modal.classList.contains('active')) {
                        // Модальное окно открыто
                        this.lastFocusedElement = document.activeElement;
                        
                        // Устанавливаем фокус на кнопку закрытия
                        const closeBtn = modal.querySelector('.modal-close');
                        if (closeBtn) {
                            closeBtn.focus();
                        }
                        
                        // Блокируем скролл страницы
                        document.body.style.overflow = 'hidden';
                        
                        // Объявляем скринридеру
                        this.announceToScreenReader('Модальное окно открыто. Для закрытия нажмите Escape или кнопку закрытия.');
                    } else {
                        // Модальное окно закрыто
                        if (this.lastFocusedElement) {
                            this.lastFocusedElement.focus();
                        }
                        
                        // Разблокируем скролл
                        document.body.style.overflow = '';
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true });
        
        console.log('✅ Управление фокусом инициализировано');
    }
    
    /**
     * Создание live region для скринридеров
     */
    initLiveRegion() {
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        document.body.appendChild(this.liveRegion);
        
        console.log('✅ Live region создан');
    }
    
    /**
     * Объявление сообщений для скринридеров
     */
    announceToScreenReader(message) {
        if (!this.liveRegion) return;
        
        // Очищаем предыдущее сообщение
        this.liveRegion.textContent = '';
        
        // Устанавливаем новое сообщение с небольшой задержкой
        setTimeout(() => {
            this.liveRegion.textContent = message;
        }, 100);
    }
    
    /**
     * Поддержка prefers-reduced-motion
     */
    initReducedMotionSupport() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (e) => {
            if (e.matches) {
                document.body.classList.add('reduce-motion');
                
                // Добавляем стили для отключения анимаций
                const style = document.createElement('style');
                style.id = 'reduced-motion-styles';
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
                
                // Удаляем предыдущие стили если есть
                const oldStyle = document.getElementById('reduced-motion-styles');
                if (oldStyle) oldStyle.remove();
                
                document.head.appendChild(style);
                
                console.log('✅ Режим уменьшения движения активирован');
            } else {
                document.body.classList.remove('reduce-motion');
                
                // Удаляем стили
                const style = document.getElementById('reduced-motion-styles');
                if (style) style.remove();
            }
        };
        
        // Проверяем текущее состояние
        handleReducedMotion(mediaQuery);
        
        // Слушаем изменения
        mediaQuery.addEventListener('change', handleReducedMotion);
        
        console.log('✅ Поддержка reduced-motion инициализирована');
    }
    
    /**
     * Оптимизация производительности
     */
    initPerformanceOptimizations() {
        // Ленивая загрузка изображений
        this.initLazyLoading();
        
        // Предзагрузка критических ресурсов
        this.preloadCriticalAssets();
        
        // Дебаунс для событий
        this.initDebouncedEvents();
        
        console.log('✅ Оптимизация производительности инициализирована');
    }
    
    /**
     * Ленивая загрузка изображений
     */
    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Загружаем изображение
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        
                        // Удаляем из наблюдения
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback для старых браузеров
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        }
    }
    
    /**
     * Предзагрузка критических ресурсов
     */
    preloadCriticalAssets() {
        // Предзагрузка логотипа
        const logo = document.querySelector('.logo-img');
        if (logo && logo.src) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = logo.src;
            document.head.appendChild(preloadLink);
        }
        
        // Предзагрузка основных изображений товаров
        const firstProductImages = document.querySelectorAll('.product-card:first-child .product-image');
        firstProductImages.forEach(img => {
            if (img.src) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = img.src;
                document.head.appendChild(preloadLink);
            }
        });
    }
    
    /**
     * Дебаунс для часто вызываемых событий
     */
    initDebouncedEvents() {
        let scrollTimeout;
        let resizeTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Обновляем активную навигацию
                this.updateActiveNavigation();
            }, 100);
        }, { passive: true });
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        }, { passive: true });
    }
    
    /**
     * Обработка изменения размера окна
     */
    handleResize() {
        const wasMobile = this.isMobile;
        
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
        this.isDesktop = window.innerWidth > 992;
        
        // Если перешли с мобильного на десктоп, закрываем мобильное меню
        if (wasMobile && !this.isMobile) {
            this.closeMobileMenu();
        }
        
        // Обновляем ARIA атрибуты при необходимости
        this.initAriaAttributes();
    }
    
    /**
     * Обработка полной загрузки страницы
     */
    handleLoad() {
        console.log('✅ Страница полностью загружена');
        
        // Объявляем скринридеру
        this.announceToScreenReader('Страница полностью загружена. Все элементы доступны.');
    }
    
    /**
     * Инициализация обработки ошибок
     */
    initErrorHandling() {
        // Глобальный обработчик ошибок
        window.addEventListener('error', (e) => {
            console.error('❌ Глобальная ошибка:', e.error || e.message);
            
            // Логируем ошибку для отладки
            this.logError({
                type: 'error',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });
        
        // Обработчик необработанных промисов
        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Необработанный промис:', e.reason);
            
            this.logError({
                type: 'unhandledrejection',
                message: e.reason?.message || 'Unknown promise error',
                stack: e.reason?.stack
            });
        });
        
        console.log('✅ Обработка ошибок инициализирована');
    }
    
    /**
     * Логирование ошибок
     */
    logError(errorData) {
        // В реальном проекте здесь можно отправлять ошибки на сервер
        console.log('📝 Ошибка залогирована:', {
            ...errorData,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
    }
    
    // ========== ПУБЛИЧНЫЕ МЕТОДЫ ==========
    
    /**
     * Обновление приложения
     */
    refresh() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
        this.isDesktop = window.innerWidth > 992;
        
        this.initAriaAttributes();
        
        console.log('🔄 Приложение обновлено');
    }
    
    /**
     * Показать уведомление
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; 
                        background: ${type === 'error' ? '#dc3545' : type === 'success' ? 'rgb(240, 167, 30)' : 'rgb(250, 100, 0)'}; 
                        color: white; padding: 16px 24px; border-radius: 8px; 
                        z-index: 3000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        display: flex; align-items: center; gap: 12px;
                        border: 2px solid white; max-width: 400px;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}" 
                   aria-hidden="true" style="font-size: 1.2rem;"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; cursor: pointer; 
                               margin-left: auto; padding: 4px; border-radius: 4px;"
                        aria-label="Закрыть уведомление">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое закрытие через 8 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }
    
    /**
     * Проверка поддержки функций доступности
     */
    checkAccessibilitySupport() {
        const support = {
            aria: 'ariaHidden' in document.createElement('div'),
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            highContrast: window.matchMedia('(prefers-contrast: high)').matches,
            screenReader: false // Нельзя точно определить
        };
        
        console.log('📊 Поддержка доступности:', support);
        return support;
    }
}

// ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ==========

/**
 * Установка товара для консультации
 */
window.setProductForConsultation = (productTitle) => {
    if (window.formManager) {
        window.formManager.setFormProduct(productTitle);
        window.formManager.scrollToForm();
        
        // Объявляем скринридеру
        if (window.app) {
            window.app.announceToScreenReader(`Выбран товар: ${productTitle}. Форма заявки готова к заполнению.`);
        }
    }
};

/**
 * Показать детали товара
 */
window.showProductDetails = (productId) => {
    if (window.catalog) {
        window.catalog.showProductDetails(productId);
    }
};

/**
 * Получить поддержку
 */
window.getAccessibilitySupport = () => {
    if (window.app) {
        return window.app.checkAccessibilitySupport();
    }
    return null;
};

// ========== ИНИЦИАЛИЗАЦИЯ ==========

// Создаем глобальный экземпляр приложения
window.app = new SibModulingApp();

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SibModulingApp };
}

console.log('🎯 app.js загружен, версия 2.0 (ГОСТ-совместимая)');