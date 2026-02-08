// Класс для управления анимациями
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }
    
    init() {
        // Инициализация анимаций при загрузке страницы
        document.addEventListener('DOMContentLoaded', () => {
            this.initScrollAnimations();
            this.initCounterAnimations();
            this.initHoverAnimations();
            this.initLoadingAnimations();
            this.initParallaxEffect();
        });
        
        // Оптимизация производительности
        this.initPerformanceOptimizations();
    }
    
    initScrollAnimations() {
        // Создание наблюдателя для анимаций при скролле
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Наблюдение за всеми элементами с классом animate-on-scroll
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            animationObserver.observe(el);
            this.animatedElements.add(el);
        });
        
        // Сохраняем наблюдатель для возможной перезагрузки
        this.observers.set('scroll', animationObserver);
    }
    
    animateElement(element) {
        // Добавление класса для запуска анимации
        element.classList.add('animated');
        
        // Дополнительные анимации в зависимости от типа элемента
        if (element.classList.contains('stat-number')) {
            this.animateCounter(element);
        }
        
        if (element.classList.contains('feature-card')) {
            this.animateFeatureCard(element);
        }
        
        if (element.classList.contains('product-card')) {
                        this.animateProductCard(element);
        }
        
        if (element.classList.contains('tech-card')) {
            this.animateTechCard(element);
        }
        
        if (element.classList.contains('process-step')) {
            this.animateProcessStep(element);
        }
    }
    
    initCounterAnimations() {
        // Наблюдатель для анимации счетчиков в hero секции
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateAllCounters();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroObserver.observe(heroSection);
        }
    }
    
    animateAllCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            this.animateCounter(counter);
        });
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const startTime = Date.now();
        const suffix = counter.textContent.includes('+') ? '+' : '';
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(target * easeOutQuart);
            
            counter.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    animateFeatureCard(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-10px)';
            const icon = card.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    }
    
    animateProductCard(card) {
        // Анимация при наведении на карточку товара
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            card.style.zIndex = '10';
            
            // Анимация изображения
            const image = card.querySelector('.product-image');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            
            // Анимация бейджа
            const badge = card.querySelector('.product-badge');
            if (badge) {
                badge.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-15px)';
            card.style.zIndex = '1';
            
            const image = card.querySelector('.product-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }
            
            const badge = card.querySelector('.product-badge');
            if (badge) {
                badge.style.transform = '';
            }
        });
        
        // Анимация при клике на кнопки
        const buttons = card.querySelectorAll('.btn-small');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.animateButtonClick(e.target);
            });
        });
    }
    
    animateTechCard(card) {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    }
    
    animateProcessStep(step) {
        step.addEventListener('mouseenter', () => {
            const number = step.querySelector('.step-number');
            if (number) {
                number.style.transform = 'scale(1.1)';
                number.style.boxShadow = '0 10px 30px rgba(216, 137, 0, 0.3)';
            }
        });
        
        step.addEventListener('mouseleave', () => {
            const number = step.querySelector('.step-number');
            if (number) {
                number.style.transform = '';
                number.style.boxShadow = '';
            }
        });
    }
    
    initHoverAnimations() {
        // Анимация для кнопок навигации
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', (e) => {
                e.target.style.transform = '';
            });
        });
        
        // Анимация для CTA кнопок
        document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
            
            // Анимация при клике
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'translateY(0)';
            });
            
            btn.addEventListener('mouseup', () => {
                btn.style.transform = 'translateY(-3px)';
            });
        });
        
        // Анимация для картинок about
        const aboutImage = document.querySelector('.about-image');
        if (aboutImage) {
            aboutImage.addEventListener('mouseenter', () => {
                const img = aboutImage.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1.05)';
                }
            });
            
            aboutImage.addEventListener('mouseleave', () => {
                const img = aboutImage.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1)';
                }
            });
        }
    }
    
    animateButtonClick(button) {
        // Анимация "нажатия" кнопки
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    initLoadingAnimations() {
        // Анимация загрузки для изображений
        document.querySelectorAll('img').forEach(img => {
            // Устанавливаем начальную прозрачность
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            // Когда изображение загружено
            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
                
                // Fallback на случай ошибки загрузки
                img.addEventListener('error', () => {
                    img.style.opacity = '1';
                    console.warn('Ошибка загрузки изображения:', img.src);
                });
            }
        });
        
        // Анимация появления героя
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
            
            // Постепенное появление элементов героя
            const heroElements = document.querySelectorAll('.hero-subtitle, .hero-stats, .hero-cta');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 300 + (index * 200));
            });
        }, 100);
    }
    
    initParallaxEffect() {
        // Простой параллакс эффект для героя
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            hero.style.transform = `translateY(${rate}px)`;
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        // Только на десктопах
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    }
    
    initPerformanceOptimizations() {
        // Дебаунс для событий скролла
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Обновление активной навигации
                this.updateActiveNavigation();
            }, 100);
        }, { passive: true });
        
        // Дебаунс для ресайза
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        }, { passive: true });
        
        // Предзагрузка критических изображений
        this.preloadCriticalImages();
    }
    
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    handleResize() {
        // Переинициализация анимаций при изменении размера
        if (window.innerWidth <= 768) {
            // Отключить параллакс на мобильных
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = '';
            }
        }
        
        // Перезапуск наблюдателей для новых элементов
        const scrollObserver = this.observers.get('scroll');
        if (scrollObserver) {
            this.animatedElements.forEach(el => {
                scrollObserver.observe(el);
            });
        }
    }
    
    preloadCriticalImages() {
        const criticalImages = [
            'images/logo.png',
            'images/asd.jpg',
            'images/products/1.png',
            'images/products/2.png'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Публичные методы
    addAnimation(element, animationType = 'fadeInUp') {
        element.classList.add('animate-on-scroll');
        
        const observer = this.observers.get('scroll');
        if (observer) {
            observer.observe(element);
            this.animatedElements.add(element);
        }
    }
    
    removeAnimation(element) {
        element.classList.remove('animate-on-scroll', 'animated');
        this.animatedElements.delete(element);
    }
    
    refreshAnimations() {
        // Перезапуск всех анимаций
        const scrollObserver = this.observers.get('scroll');
        if (scrollObserver) {
            this.animatedElements.forEach(el => {
                el.classList.remove('animated');
                scrollObserver.observe(el);
            });
        }
    }
    
    // Анимация успешной отправки формы
    animateFormSuccess() {
        const successIcon = document.querySelector('.modal-success i');
        if (successIcon) {
            successIcon.style.animation = 'scaleIn 0.5s ease-out';
            
            // Добавить эффект пульсации
            setTimeout(() => {
                successIcon.style.animation = 'scaleIn 0.5s ease-out, pulse 2s infinite';
                
                // Добавить CSS для пульсации
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                `;
                document.head.appendChild(style);
            }, 500);
        }
    }
    
    // Анимация появления модального окна
    showModal(modalElement) {
        modalElement.style.display = 'flex';
        setTimeout(() => {
            modalElement.classList.add('active');
        }, 10);
    }
    
    hideModal(modalElement) {
        modalElement.classList.remove('active');
        setTimeout(() => {
            modalElement.style.display = 'none';
        }, 300);
    }
}

// Инициализация глобального экземпляра
window.animations = new AnimationManager();