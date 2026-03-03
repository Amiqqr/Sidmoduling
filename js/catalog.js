// catalog.js - ПОЛНОСТЬЮ ПЕРЕПИСАННАЯ ВЕРСИЯ, СООТВЕТСТВУЮЩАЯ ГОСТ Р 52872-2019
// Класс для управления каталогом с полной поддержкой доступности

class CatalogManager {
    constructor() {
        // Основные свойства
        this.currentCategory = 'all';
        this.products = [];
        this.filteredProducts = [];
        this.currentProductDetails = null;
        
        // Для пагинации характеристик
        this.currentFeaturePage = 0;
        this.featuresPerPage = 5;
        
        // Для галереи изображений и видео
        this.currentImageIndex = 0;
        this.images = [];
        this.mediaItems = []; // Массив для объединения изображений и видео
        
        // Таймер для предпросмотра видео
        this.previewTimeout = null;
        
        // Для accessibility
        this.liveRegion = null;
        this.announceTimeout = null;
        
        // Инициализация
        this.init();
    }
    
    /**
     * Главный метод инициализации
     */
    async init() {
        console.log('📦 Инициализация каталога (ГОСТ-версия)');
        
        // Создаем live region для скринридеров
        this.createLiveRegion();
        
        // Инициализация базы данных
        await Database.init();
        
        console.log('📊 Каталог: Загружено товаров из базы:', Database.products.length);
        
        // Загрузка продуктов
        await this.loadProducts();
        
        console.log('📊 Каталог: Отфильтровано товаров:', this.filteredProducts.length);
        
        // Инициализация событий
        this.initEvents();
        
        // Инициализация анимаций
        this.initAnimations();
        
        // Объявляем о готовности
        this.announceToScreenReader('Каталог загружен. Доступно ' + this.filteredProducts.length + ' товаров.');
        
        console.log('✅ Каталог успешно инициализирован');
    }
    
    /**
     * Создание live region для скринридеров
     */
    createLiveRegion() {
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        document.body.appendChild(this.liveRegion);
    }
    
    /**
     * Объявление сообщений для скринридеров
     */
    announceToScreenReader(message) {
        if (!this.liveRegion) return;
        
        // Очищаем предыдущее сообщение
        if (this.announceTimeout) {
            clearTimeout(this.announceTimeout);
        }
        
        this.announceTimeout = setTimeout(() => {
            this.liveRegion.textContent = '';
            
            setTimeout(() => {
                this.liveRegion.textContent = message;
            }, 50);
        }, 100);
    }
    
    /**
     * Загрузка продуктов
     */
    async loadProducts(category = 'all') {
        this.currentCategory = category;
        
        // Показать индикатор загрузки
        this.showLoading();
        
        try {
            // Загрузить продукты
            this.products = await Database.loadProducts(category);
            this.filteredProducts = [...this.products];
            
            console.log(`📦 Загружено ${this.products.length} товаров категории "${category}"`);
            
            // Отрисовать продукты
            this.renderProducts();
            
            // Объявить скринридеру
            this.announceToScreenReader(`Категория "${this.getCategoryDisplayName(category)}" загружена. Найдено ${this.filteredProducts.length} товаров.`);
            
        } catch (error) {
            console.error('❌ Ошибка загрузки продуктов:', error);
            this.showError('Не удалось загрузить товары. Пожалуйста, обновите страницу.');
        } finally {
            // Скрыть индикатор загрузки
            this.hideLoading();
        }
    }
    
    /**
     * Показать индикатор загрузки
     */
    showLoading() {
        const catalogGrid = document.getElementById('catalogGrid');
        if (!catalogGrid) return;
        
        catalogGrid.innerHTML = `
            <div class="loading-spinner" 
                 style="grid-column: 1 / -1; text-align: center; padding: 60px;"
                 role="status" 
                 aria-live="polite">
                <i class="fas fa-spinner fa-spin fa-3x" aria-hidden="true" style="color: var(--accent-teal);"></i>
                <p style="margin-top: 20px; color: var(--gray-text);">Загрузка каталога...</p>
                <span class="sr-only">Загрузка товаров, пожалуйста подождите</span>
            </div>
        `;
    }
    
    /**
     * Скрыть индикатор загрузки
     */
    hideLoading() {
        // Индикатор будет скрыт при рендере
    }
    
    /**
     * Показать ошибку
     */
    showError(message) {
        const catalogGrid = document.getElementById('catalogGrid');
        if (!catalogGrid) return;
        
        catalogGrid.innerHTML = `
            <div class="error-message" 
                 style="grid-column: 1 / -1; text-align: center; padding: 60px;"
                 role="alert"
                 aria-live="assertive">
                <i class="fas fa-exclamation-circle fa-3x" aria-hidden="true" style="color: #dc3545; margin-bottom: 20px;"></i>
                <h3 style="color: var(--dark-text); margin-bottom: 10px;">Ошибка загрузки</h3>
                <p style="color: var(--gray-text);">${message}</p>
                <button class="btn-primary" onclick="catalog.loadProducts('${this.currentCategory}')" style="margin-top: 20px;">
                    <i class="fas fa-sync-alt" aria-hidden="true"></i>
                    <span>Повторить попытку</span>
                </button>
            </div>
        `;
        
        this.announceToScreenReader('Ошибка загрузки: ' + message);
    }
    
    /**
     * Получение отображаемого имени категории
     */
    getCategoryDisplayName(category) {
        const categories = {
            'all': 'все товары',
            'houses': 'модульные дома',
            'offices': 'офисные модули',
            'storage': 'бытовки',
            'promo': 'акции'
        };
        return categories[category] || category;
    }
    
    /**
     * Получение имени категории для отображения
     */
    getCategoryName(category) {
        const categories = {
            'houses': 'Модульные дома',
            'offices': 'Офисные модули',
            'storage': 'Бытовки',
            'promo': 'Акции'
        };
        return categories[category] || category;
    }
    
    /**
     * Отрисовка продуктов
     */
    renderProducts() {
        const catalogGrid = document.getElementById('catalogGrid');
        if (!catalogGrid) return;
        
        console.log(`🎨 Отрисовка ${this.filteredProducts.length} товаров`);
        
        if (this.filteredProducts.length === 0) {
            catalogGrid.innerHTML = `
                <div class="empty-catalog" 
                     style="grid-column: 1 / -1; text-align: center; padding: 60px;"
                     role="status"
                     aria-live="polite">
                    <i class="fas fa-box-open fa-3x" aria-hidden="true" style="color: var(--gray-text); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--dark-text); margin-bottom: 10px;">Товары не найдены</h3>
                    <p style="color: var(--gray-text);">Попробуйте выбрать другую категорию</p>
                </div>
            `;
            return;
        }
        
        // Очищаем контейнер
        catalogGrid.innerHTML = '';
        
        // Создаем карточки товаров
        this.filteredProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            catalogGrid.appendChild(productCard);
        });
        
        // Инициализация анимаций для новых карточек
        setTimeout(() => {
            this.initProductAnimations();
        }, 100);
    }
    
    /**
     * Создание карточки товара с поддержкой доступности и предпросмотром видео
     */
    createProductCard(product, index) {
        // Используем article вместо div для семантики
        const card = document.createElement('article');
        card.className = 'product-card animate-on-scroll';
        card.dataset.id = product.id;
        card.dataset.category = product.category;
        card.style.animationDelay = `${index * 0.1}s`;
        
        // ARIA атрибуты для доступности
        const titleId = `product-title-${product.id}`;
        const descId = `product-desc-${product.id}`;
        
        card.setAttribute('aria-labelledby', titleId);
        card.setAttribute('aria-describedby', descId);
        card.setAttribute('role', 'article');
        
        // Основное изображение
        const mainImage = product.images?.[0] || product.image || 'https://via.placeholder.com/350x250/FFFFFF/333333?text=Изображение+товара';
        
        // Проверяем наличие видео
        const hasVideo = product.videos && product.videos.length > 0;
        const videoSrc = hasVideo ? product.videos[0] : null;
        
        // Формирование HTML карточки
        card.innerHTML = `
            ${product.badge ? `
                <div class="product-badge" aria-label="Особенность: ${product.badge}">
                    ${product.badge}
                </div>
            ` : ''}
            
            ${product.sale ? `
                <div class="sale-badge" aria-label="Скидка: ${product.sale}">
                    ${product.sale}
                </div>
            ` : ''}
            
            <div class="product-image-container" data-has-video="${hasVideo}">
                <img src="${mainImage}" 
                     alt="${product.title} - основное изображение" 
                     class="product-image" 
                     id="product-image-${product.id}"
                     loading="lazy"
                     data-video-src="${videoSrc || ''}"
                     onerror="this.src='https://via.placeholder.com/350x250/FFFFFF/333333?text=Изображение+товара'">
                ${hasVideo ? `<video class="product-video-preview" src="${videoSrc}" preload="none" loop muted playsinline></video>` : ''}
            </div>
            
            <div class="product-content">
                <div class="product-category" aria-label="Категория: ${this.getCategoryName(product.category)}">
                    ${this.getCategoryName(product.category)}
                </div>
                
                <h3 class="product-title" id="${titleId}">${product.title}</h3>
                
                <div class="product-price" aria-label="Цена: ${product.price}">
                    <span class="current-price">${product.price}</span>
                    ${product.oldPrice ? `
                        <span class="product-old-price" aria-label="Старая цена: ${product.oldPrice}">
                            ${product.oldPrice}
                        </span>
                    ` : ''}
                </div>
                
                <div class="product-features" id="${descId}">
                    ${product.features.slice(0, 3).map(feature => `
                        <li>
                            <i class="fas fa-check" aria-hidden="true"></i>
                            <span>${feature}</span>
                        </li>
                    `).join('')}
                    
                    ${product.features.length > 3 ? `
                        <li aria-hidden="true">
                            <i class="fas fa-ellipsis-h" aria-hidden="true"></i>
                            <span>Еще ${product.features.length - 3} характеристик...</span>
                        </li>
                    ` : ''}
                </div>
                
                <div class="product-actions">
                    <a href="#consultation" 
                       class="btn-small btn-buy" 
                       onclick="catalog.setProductForConsultation(${product.id}); return false;"
                       aria-label="Заказать ${product.title}">
                        <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                        <span>Заказать</span>
                    </a>
                    
                    <button class="btn-small btn-details" 
                            onclick="catalog.showProductDetails(${product.id})"
                            aria-label="Подробнее о товаре ${product.title}">
                        <i class="fas fa-images" aria-hidden="true"></i>
                        <span>Подробнее</span>
                    </button>
                </div>
            </div>
        `;
        
        // Добавляем обработчики для предпросмотра видео при наведении
        if (hasVideo) {
            const imageContainer = card.querySelector('.product-image-container');
            const image = card.querySelector('.product-image');
            const video = card.querySelector('.product-video-preview');
            
            if (imageContainer && image && video) {
                imageContainer.addEventListener('mouseenter', () => {
                    this.previewTimeout = setTimeout(() => {
                        // Прячем изображение, показываем видео и начинаем воспроизведение
                        image.style.opacity = '0';
                        video.style.opacity = '1';
                        video.play().catch(e => console.log('Не удалось воспроизвести видео при наведении:', e));
                    }, 300); // Задержка 300мс перед показом видео
                });
                
                imageContainer.addEventListener('mouseleave', () => {
                    // Очищаем таймер
                    if (this.previewTimeout) {
                        clearTimeout(this.previewTimeout);
                        this.previewTimeout = null;
                    }
                    
                    // Возвращаем изображение и останавливаем видео
                    image.style.opacity = '1';
                    video.style.opacity = '0';
                    video.pause();
                    video.currentTime = 0;
                });
            }
        }
        
        return card;
    }
    
    /**
     * Инициализация событий
     */
    initEvents() {
        // Обработчики вкладок категорий
        const tabs = document.querySelectorAll('.tab-btn');
        
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Обновить активную вкладку
                tabs.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                
                // Загрузить продукты выбранной категории
                this.loadProducts(category);
                
                // Прокрутить к каталогу
                this.scrollToCatalog();
                
                // Объявить скринридеру
                this.announceToScreenReader(`Выбрана категория: ${this.getCategoryDisplayName(category)}`);
            });
            
            // Устанавливаем ARIA атрибуты для вкладок
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
        });
        
        // Устанавливаем ARIA атрибуты для контейнера вкладок
        const tabContainer = document.getElementById('catalogTabs');
        if (tabContainer) {
            tabContainer.setAttribute('role', 'tablist');
            tabContainer.setAttribute('aria-label', 'Категории товаров');
        }
        
        console.log('✅ События каталога инициализированы');
    }
    
    /**
     * Инициализация анимаций
     */
    initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
    
    /**
     * Инициализация анимаций для продуктов
     */
    initProductAnimations() {
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    /**
     * Поиск продуктов
     */
    searchProducts(query) {
        if (!query.trim()) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = Database.searchProducts(query, this.currentCategory);
        }
        
        this.renderProducts();
        
        this.announceToScreenReader(`Поиск "${query}" завершен. Найдено ${this.filteredProducts.length} товаров.`);
    }
    
    /**
     * Прокрутка к каталогу
     */
    scrollToCatalog() {
        const catalogSection = document.getElementById('catalog');
        if (catalogSection) {
            const headerHeight = document.querySelector('header').offsetHeight;
            
            window.scrollTo({
                top: catalogSection.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
            
            // Устанавливаем фокус на заголовок каталога
            setTimeout(() => {
                catalogSection.setAttribute('tabindex', '-1');
                catalogSection.focus({ preventScroll: true });
            }, 500);
        }
    }
    
    /**
     * Установка продукта для консультации
     */
    setProductForConsultation(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return false;
        
        const productSelect = document.getElementById('product');
        if (productSelect) {
            // Создаем опцию с названием продукта
            const option = document.createElement('option');
            option.value = `product_${productId}`;
            option.textContent = product.title;
            option.selected = true;
            
            // Удаляем предыдущие опции продуктов
            const existingOptions = productSelect.querySelectorAll('option[value^="product_"]');
            existingOptions.forEach(opt => opt.remove());
            
            // Добавляем новую опцию
            productSelect.appendChild(option);
            
            // Объявляем скринридеру
            this.announceToScreenReader(`Выбран товар: ${product.title}. Переход к форме заявки.`);
        }
        
        // Прокручиваем к форме
        setTimeout(() => {
            const consultationSection = document.getElementById('consultation');
            if (consultationSection) {
                consultationSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start' 
                });
                
                // Устанавливаем фокус на форму
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) nameInput.focus();
                }, 500);
            }
        }, 100);
        
        return false;
    }
    
    /**
     * Показать детали продукта с галереей изображений и видео
     */
    async showProductDetails(productId) {
        const product = await Database.getProductById(productId);
        
        if (!product) {
            alert('Информация о товаре не найдена');
            this.announceToScreenReader('Ошибка: информация о товаре не найдена');
            return;
        }
        
        this.currentProductDetails = product;
        this.currentFeaturePage = 0;
        this.currentImageIndex = 0;
        
        // Формируем массив медиа (изображения + видео)
        this.mediaItems = [];
        
        // Добавляем изображения
        if (product.images && product.images.length > 0) {
            this.mediaItems.push(...product.images.map(src => ({
                type: 'image',
                src: src
            })));
        }
        
        // Добавляем видео, если есть
        if (product.videos && product.videos.length > 0) {
            this.mediaItems.push(...product.videos.map(src => ({
                type: 'video',
                src: src
            })));
        }
        
        // Если нет ни изображений, ни видео, добавляем заглушку
        if (this.mediaItems.length === 0) {
            this.mediaItems.push({
                type: 'image',
                src: 'https://via.placeholder.com/500x350/FFFFFF/333333?text=Изображение+товара'
            });
        }
        
        // Создание модального окна
        this.createProductModal(product);
        
        // Добавляем стили для видео
        this.addVideoStyles();
        
        // Объявляем скринридеру
        this.announceToScreenReader(`Открыты детали товара: ${product.title}. Используйте стрелки для навигации по медиа.`);
    }
    
    /**
     * Создание модального окна с деталями товара
     */
    createProductModal(product) {
        // Удаляем предыдущее модальное окно если есть
        const existingModal = document.querySelector('.product-details-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal active product-details-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-product-title');
        modal.setAttribute('aria-describedby', 'modal-product-desc');
        
        const totalPages = Math.ceil((product.features?.length || 0) / this.featuresPerPage);
        
        // Определяем, есть ли видео в медиа
        const hasVideo = this.mediaItems.some(item => item.type === 'video');
        
        modal.innerHTML = `
            <div class="modal-content product-details-content">
                <button class="modal-close" onclick="catalog.closeProductModal()" 
                        aria-label="Закрыть окно деталей товара">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
                
                <div class="product-details-container">
                    <div class="product-details-image">
                        <div class="main-image-container" id="mainMediaContainer">
                            ${this.renderCurrentMedia(0)}
                            
                            <div class="image-counter" aria-live="polite">
                                <span id="currentImageIndex">1</span> / <span id="totalImages">${this.mediaItems.length}</span>
                                <span class="sr-only">${hasVideo ? 'медиа' : 'изображение'}</span>
                            </div>
                        </div>
                        
                        <div class="image-nav" role="group" aria-label="Навигация по медиа">
                            <button class="image-nav-btn prev-btn" 
                                    onclick="catalog.prevImage()" 
                                    ${this.mediaItems.length <= 1 ? 'disabled' : ''}
                                    aria-label="Предыдущее">
                                <i class="fas fa-chevron-left" aria-hidden="true"></i>
                            </button>
                            
                            <button class="image-nav-btn next-btn" 
                                    onclick="catalog.nextImage()" 
                                    ${this.mediaItems.length <= 1 ? 'disabled' : ''}
                                    aria-label="Следующее">
                                <i class="fas fa-chevron-right" aria-hidden="true"></i>
                            </button>
                        </div>
                        
                        <!-- Миниатюры -->
                        <div class="image-thumbnails" id="imageThumbnails" role="list" aria-label="Миниатюры">
                            ${this.mediaItems.map((item, index) => `
                                <button class="image-thumbnail ${index === 0 ? 'active' : ''}" 
                                        onclick="catalog.changeImage(${index})"
                                        data-index="${index}"
                                        role="listitem"
                                        aria-label="${item.type === 'video' ? 'Видео' : 'Изображение'} ${index + 1}"
                                        aria-pressed="${index === 0 ? 'true' : 'false'}">
                                    ${item.type === 'video' 
                                        ? '<i class="fas fa-play" aria-hidden="true" style="color: #E67E22; font-size: 20px;"></i>' 
                                        : `<img src="${item.src}" alt="Миниатюра ${index + 1}" onerror="this.src='https://via.placeholder.com/100x75/FFFFFF/333333?text=Ошибка'">`
                                    }
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="product-details-info">
                        ${product.badge ? `
                            <div class="product-badge" aria-label="Особенность: ${product.badge}">
                                ${product.badge}
                            </div>
                        ` : ''}
                        
                        <div class="product-category" aria-label="Категория: ${this.getCategoryName(product.category)}">
                            ${this.getCategoryName(product.category)}
                        </div>
                        
                        <h2 class="product-title" id="modal-product-title">${product.title}</h2>
                        
                        <div class="product-price-large" aria-label="Цена: ${product.price}">
                            <span class="current-price">${product.price}</span>
                            ${product.oldPrice ? `
                                <span class="product-old-price" aria-label="Старая цена: ${product.oldPrice}">
                                    ${product.oldPrice}
                                </span>
                            ` : ''}
                            ${product.sale ? `
                                <span class="sale-badge" aria-label="Скидка: ${product.sale}">
                                    ${product.sale}
                                </span>
                            ` : ''}
                        </div>
                        
                        <div class="product-description" id="modal-product-desc">
                            <h3>Описание</h3>
                            <p>${product.description || 'Подробное описание товара. Все характеристики указаны ниже.'}</p>
                        </div>
                        
                        <div class="product-features-section">
                            <div class="section-header">
                                <h3>Характеристики</h3>
                                
                                <div class="features-nav" role="group" aria-label="Навигация по страницам характеристик">
                                    <button class="features-nav-btn prev-features" 
                                            onclick="catalog.prevFeaturesPage()" 
                                            ${this.currentFeaturePage === 0 ? 'disabled' : ''}
                                            aria-label="Предыдущая страница характеристик">
                                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                                    </button>
                                    
                                    <span class="features-page-info" aria-live="polite">
                                        Страница <span id="currentPage">1</span> из <span id="totalPages">${totalPages}</span>
                                    </span>
                                    
                                    <button class="features-nav-btn next-features" 
                                            onclick="catalog.nextFeaturesPage()" 
                                            ${this.currentFeaturePage >= totalPages - 1 ? 'disabled' : ''}
                                            aria-label="Следующая страница характеристик">
                                        <i class="fas fa-chevron-right" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="features-container" id="featuresContainer" aria-live="polite">
                                <!-- Характеристики будут загружены динамически -->
                            </div>
                        </div>
                        
                        ${product.specifications ? `
                            <div class="product-specifications">
                                <h3>Технические характеристики</h3>
                                <div class="specs-grid" id="specsGrid">
                                    ${this.renderSpecifications(product.specifications)}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="product-actions-large">
                            <button class="btn-primary" 
                                    onclick="catalog.setProductForConsultation(${product.id}); catalog.closeProductModal();"
                                    aria-label="Заказать консультацию по товару ${product.title}">
                                <i class="fas fa-phone-alt" aria-hidden="true"></i>
                                <span>Заказать консультацию</span>
                            </button>
                            
                            <button class="btn-secondary" 
                                    onclick="catalog.openFullscreenView()"
                                    aria-label="Открыть полноэкранный просмотр">
                                <i class="fas fa-expand-arrows-alt" aria-hidden="true"></i>
                                <span>Полноэкранный просмотр</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Добавляем стили для модального окна, если их нет
        this.addModalStyles();
        
        // Загружаем характеристики
        this.updateFeaturesDisplay();
        
        // Инициализируем видео, если текущий элемент - видео
        this.initCurrentVideo();
        
        // Инициализируем обработчики клавиатуры
        this.initModalKeyboardEvents(modal);
        
        // Устанавливаем фокус на кнопку закрытия
        setTimeout(() => {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) closeBtn.focus();
        }, 100);
        
        // Закрытие при клике на фон
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProductModal();
            }
        });
    }
    
    /**
     * Рендеринг текущего медиа (изображение или видео)
     */
    renderCurrentMedia(index) {
        if (!this.mediaItems || this.mediaItems.length === 0) return '';
        
        const item = this.mediaItems[index];
        
        if (item.type === 'video') {
            return `
                <video controls 
                       class="main-product-video" 
                       id="mainProductVideo"
                       poster="${this.mediaItems.find(m => m.type === 'image')?.src || ''}"
                       preload="metadata">
                    <source src="${item.src}" type="video/mp4">
                    Ваш браузер не поддерживает видео.
                </video>
            `;
        } else {
            return `
                <img src="${item.src}" 
                     alt="Изображение ${index + 1} из ${this.mediaItems.length}" 
                     id="mainProductImage"
                     class="main-product-image"
                     onerror="this.src='https://via.placeholder.com/500x350/FFFFFF/333333?text=Изображение+товара'">
            `;
        }
    }
    
    /**
     * Добавление стилей для видео и предпросмотра
     */
    addVideoStyles() {
        if (document.getElementById('video-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'video-styles';
        style.textContent = `
            .main-product-video {
                width: 100%;
                height: 100%;
                object-fit: contain;
                background: #000;
            }
            
            .product-image-container {
                position: relative;
                height: 250px;
                overflow: hidden;
            }
            
            .product-image,
            .product-video-preview {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: opacity 0.3s ease;
            }
            
            .product-video-preview {
                opacity: 0;
                pointer-events: none;
            }
            
            .fullscreen-video {
                max-width: 100%;
                max-height: 90vh;
                width: auto;
                height: auto;
                border: 2px solid white;
                border-radius: 8px;
                background: #000;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Рендеринг характеристик
     */
    renderSpecifications(specs) {
        if (!specs) return '';
        
        const translations = {
            'area': 'Площадь',
            'length': 'Длина',
            'width': 'Ширина',
            'height': 'Высота',
            'weight': 'Вес',
            'warranty': 'Гарантия',
            'delivery': 'Доставка',
            'assembly': 'Сборка',
            'insulation': 'Утепление',
            'floor_insulation': 'Утепление пола',
            'wall_insulation': 'Утепление стен',
            'frame': 'Каркас',
            'nds_price': 'Цена с НДС',
            'rooms': 'Комнат',
            'bathroom': 'Санузел',
            'ac': 'Кондиционер',
            'furniture': 'Мебель',
            'terrace_area': 'Площадь террасы',
            'total_area': 'Общая площадь'
        };
        
        return Object.entries(specs).map(([key, value]) => {
            const label = translations[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
            return `
                <div class="spec-item">
                    <span class="spec-key">${label}:</span>
                    <span class="spec-value">${value}</span>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Добавление стилей для модального окна
     */
    addModalStyles() {
        if (document.getElementById('product-modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'product-modal-styles';
        style.textContent = `
            .product-details-modal .modal-content {
                max-width: 1000px;
                max-height: 90vh;
                padding: 0;
                overflow-y: auto;
                width: 95%;
            }
            
            .product-details-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                padding: 30px;
            }
            
            .product-details-image {
                position: relative;
            }
            
            .main-image-container {
                position: relative;
                border-radius: 12px;
                overflow: hidden;
                height: 350px;
                margin-bottom: 15px;
                background: #f5f5f5;
                border: 1px solid #e0e0e0;
            }
            
            .main-product-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .image-counter {
                position: absolute;
                bottom: 15px;
                right: 15px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                border: 1px solid white;
            }
            
            .image-nav {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
                padding: 0 15px;
                transform: translateY(-50%);
                z-index: 10;
            }
            
            .image-nav-btn {
                width: 44px;
                height: 44px;
                background: rgba(255, 255, 255, 0.9);
                border: 2px solid #333;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #333;
                                font-size: 1.2rem;
            }
            
            .image-nav-btn:hover:not(:disabled) {
                background: white;
                transform: scale(1.1);
            }
            
            .image-nav-btn:focus-visible {
                outline: 3px solid #0066CC;
                outline-offset: 2px;
            }
            
            .image-nav-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            
            .image-thumbnails {
                display: flex;
                gap: 10px;
                margin-top: 15px;
                padding: 10px;
                overflow-x: auto;
                background: #f5f5f5;
                border-radius: 8px;
            }
            
            .image-thumbnail {
                width: 80px;
                height: 60px;
                border-radius: 6px;
                overflow: hidden;
                cursor: pointer;
                border: 3px solid transparent;
                transition: all 0.3s ease;
                flex-shrink: 0;
                padding: 0;
                background: none;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .image-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .image-thumbnail i {
                font-size: 24px;
                color: #E67E22;
            }
            
            .image-thumbnail.active {
                border-color: #E67E22;
            }
            
            .image-thumbnail:focus-visible {
                outline: 3px solid #0066CC;
                outline-offset: 2px;
            }
            
            .product-details-info {
                padding: 10px 0;
            }
            
            .product-price-large {
                font-size: 2.2rem;
                font-weight: 800;
                color: #E67E22;
                margin: 20px 0;
                display: flex;
                align-items: center;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .product-description h3,
            .product-features-section h3,
            .product-specifications h3 {
                color: #333;
                margin: 25px 0 15px 0;
                font-size: 1.3rem;
            }
            
            .features-container {
                background: #f5f5f5;
                border-radius: 8px;
                padding: 20px;
                min-height: 200px;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .features-container ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }
            
            .features-container li {
                padding: 10px 0;
                color: #333;
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid #ddd;
            }
            
            .features-container li:last-child {
                border-bottom: none;
            }
            
            .features-container li i {
                color: #E67E22;
                width: 20px;
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .features-nav {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .features-nav-btn {
                width: 36px;
                height: 36px;
                background: #f5f5f5;
                border: 2px solid #ddd;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .features-nav-btn:hover:not(:disabled) {
                background: #E67E22;
                color: white;
                border-color: #E67E22;
            }
            
            .features-nav-btn:focus-visible {
                outline: 3px solid #0066CC;
                outline-offset: 2px;
            }
            
            .features-nav-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            
            .features-page-info {
                font-size: 0.9rem;
                color: #666;
                min-width: 120px;
                text-align: center;
            }
            
            .specs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .spec-item {
                background: #f5f5f5;
                padding: 12px 15px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
            }
            
            .spec-key {
                font-weight: 600;
                color: #333;
                font-size: 0.9rem;
                margin-bottom: 5px;
            }
            
            .spec-value {
                color: #666;
                font-size: 1rem;
            }
            
            .product-actions-large {
                display: flex;
                gap: 15px;
                margin-top: 30px;
            }
            
            .product-actions-large .btn-primary,
            .product-actions-large .btn-secondary {
                flex: 1;
                padding: 16px 24px;
            }
            
            @media (max-width: 768px) {
                .product-details-container {
                    grid-template-columns: 1fr;
                    gap: 20px;
                    padding: 20px;
                }
                
                .main-image-container {
                    height: 250px;
                }
                
                .product-actions-large {
                    flex-direction: column;
                }
                
                .section-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .features-nav {
                    width: 100%;
                    justify-content: center;
                }
            }
            
            /* Анимации */
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            .image-slide-right {
                animation: slideInRight 0.4s ease;
            }
            
            .image-slide-left {
                animation: slideInLeft 0.4s ease;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Обновление отображения характеристик
     */
    updateFeaturesDisplay() {
        if (!this.currentProductDetails) return;
        
        const featuresContainer = document.getElementById('featuresContainer');
        if (!featuresContainer) return;
        
        const features = this.currentProductDetails.features || [];
        const totalPages = Math.ceil(features.length / this.featuresPerPage);
        const startIndex = this.currentFeaturePage * this.featuresPerPage;
        const endIndex = startIndex + this.featuresPerPage;
        const pageFeatures = features.slice(startIndex, endIndex);
        
        // Обновляем содержимое
        featuresContainer.innerHTML = `
            <ul>
                ${pageFeatures.map(feature => `
                    <li>
                        <i class="fas fa-check-circle" aria-hidden="true"></i>
                        <span>${feature}</span>
                    </li>
                `).join('')}
            </ul>
            ${features.length === 0 ? `
                <p style="text-align: center; color: #666; padding: 40px;">
                    Характеристики отсутствуют
                </p>
            ` : ''}
        `;
        
        // Обновляем информацию о страницах
        const currentPageEl = document.getElementById('currentPage');
        const totalPagesEl = document.getElementById('totalPages');
        
        if (currentPageEl) currentPageEl.textContent = this.currentFeaturePage + 1;
        if (totalPagesEl) totalPagesEl.textContent = totalPages || 1;
        
        // Обновляем кнопки навигации
        this.updateFeaturesNavigationButtons();
        
        // Объявляем скринридеру
        this.announceToScreenReader(`Страница характеристик ${this.currentFeaturePage + 1} из ${totalPages || 1}`);
    }
    
    /**
     * Обновление кнопок навигации по характеристикам
     */
    updateFeaturesNavigationButtons() {
        if (!this.currentProductDetails) return;
        
        const features = this.currentProductDetails.features || [];
        const totalPages = Math.ceil(features.length / this.featuresPerPage);
        
        const prevBtn = document.querySelector('.prev-features');
        const nextBtn = document.querySelector('.next-features');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentFeaturePage === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentFeaturePage >= totalPages - 1;
        }
    }
    
    /**
     * Следующая страница характеристик
     */
    nextFeaturesPage() {
        if (!this.currentProductDetails) return;
        
        const features = this.currentProductDetails.features || [];
        const totalPages = Math.ceil(features.length / this.featuresPerPage);
        
        if (this.currentFeaturePage < totalPages - 1) {
            this.currentFeaturePage++;
            this.updateFeaturesDisplay();
        }
    }
    
    /**
     * Предыдущая страница характеристик
     */
    prevFeaturesPage() {
        if (this.currentFeaturePage > 0) {
            this.currentFeaturePage--;
            this.updateFeaturesDisplay();
        }
    }
    
    /**
     * Инициализация текущего видео
     */
    initCurrentVideo() {
        const video = document.getElementById('mainProductVideo');
        if (video) {
            // Добавляем обработчики для видео
            video.addEventListener('play', () => {
                this.announceToScreenReader('Видео воспроизводится');
            });
            
            video.addEventListener('pause', () => {
                this.announceToScreenReader('Видео на паузе');
            });
            
            video.addEventListener('ended', () => {
                this.announceToScreenReader('Видео завершено');
            });
            
            video.addEventListener('error', (e) => {
                console.error('Ошибка воспроизведения видео:', e);
                this.announceToScreenReader('Ошибка загрузки видео');
            });
        }
    }
    
    /**
     * Смена медиа (изображение или видео)
     */
    changeImage(index) {
        if (!this.currentProductDetails || !this.mediaItems) return;
        
        if (index < 0 || index >= this.mediaItems.length) return;
        
        const oldIndex = this.currentImageIndex;
        this.currentImageIndex = index;
        
        const mainContainer = document.getElementById('mainMediaContainer');
        if (!mainContainer) return;
        
        // Определяем направление анимации
        const animationClass = index > oldIndex ? 'image-slide-right' : 'image-slide-left';
        
        // Добавляем анимацию
        mainContainer.classList.add(animationClass);
        
        // Меняем медиа
        setTimeout(() => {
            mainContainer.innerHTML = this.renderCurrentMedia(index);
            
            // Обновляем миниатюры
            this.updateMediaThumbnails();
            
            // Обновляем счетчик
            this.updateMediaCounter();
            
            // Обновляем кнопки навигации
            this.updateMediaNavigationButtons();
            
            // Инициализируем видео, если нужно
            this.initCurrentVideo();
            
            // Убираем анимацию
            setTimeout(() => {
                mainContainer.classList.remove(animationClass);
            }, 400);
        }, 200);
        
        // Объявляем скринридеру
        const mediaType = this.mediaItems[index].type === 'video' ? 'видео' : 'изображение';
        this.announceToScreenReader(`${mediaType} ${index + 1} из ${this.mediaItems.length}`);
    }
    
    /**
     * Обновление миниатюр медиа
     */
    updateMediaThumbnails() {
        const thumbnailsContainer = document.getElementById('imageThumbnails');
        if (!thumbnailsContainer || !this.mediaItems) return;
        
        thumbnailsContainer.innerHTML = this.mediaItems.map((item, index) => `
            <button class="image-thumbnail ${index === this.currentImageIndex ? 'active' : ''}" 
                    onclick="catalog.changeImage(${index})"
                    data-index="${index}"
                    role="listitem"
                    aria-label="${item.type === 'video' ? 'Видео' : 'Изображение'} ${index + 1}"
                    aria-pressed="${index === this.currentImageIndex ? 'true' : 'false'}">
                ${item.type === 'video' 
                    ? '<i class="fas fa-play" aria-hidden="true" style="color: #E67E22; font-size: 20px;"></i>' 
                    : `<img src="${item.src}" alt="Миниатюра ${index + 1}" onerror="this.src='https://via.placeholder.com/100x75/FFFFFF/333333?text=Ошибка'">`
                }
            </button>
        `).join('');
    }
    
    /**
     * Обновление счетчика медиа
     */
    updateMediaCounter() {
        const currentIndexEl = document.getElementById('currentImageIndex');
        const totalImagesEl = document.getElementById('totalImages');
        
        if (currentIndexEl) currentIndexEl.textContent = this.currentImageIndex + 1;
        if (totalImagesEl) totalImagesEl.textContent = this.mediaItems.length;
    }
    
    /**
     * Обновление кнопок навигации по медиа
     */
    updateMediaNavigationButtons() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = this.mediaItems.length <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.mediaItems.length <= 1;
        }
    }
    
    /**
     * Следующее медиа
     */
    nextImage() {
        if (!this.mediaItems) return;
        
        const nextIndex = (this.currentImageIndex + 1) % this.mediaItems.length;
        this.changeImage(nextIndex);
    }
    
    /**
     * Предыдущее медиа
     */
    prevImage() {
        if (!this.mediaItems) return;
        
        const prevIndex = this.currentImageIndex === 0 ? this.mediaItems.length - 1 : this.currentImageIndex - 1;
        this.changeImage(prevIndex);
    }
    
    /**
     * Инициализация клавиатурных событий для модального окна
     */
    initModalKeyboardEvents(modal) {
        const handleKeyDown = (e) => {
            if (!this.currentProductDetails) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevImage();
                    break;
                    
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextImage();
                    break;
                    
                case 'Escape':
                    this.closeProductModal();
                    break;
                    
                case 'f':
                case 'F':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.openFullscreenView();
                    }
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    this.changeImage(0);
                    break;
                    
                case 'End':
                    e.preventDefault();
                    this.changeImage(this.mediaItems.length - 1);
                    break;
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        
        // Сохраняем обработчик для удаления
        this.keyboardHandler = handleKeyDown;
    }
    
    /**
     * Открытие полноэкранного просмотра
     */
    openFullscreenView() {
        if (!this.currentProductDetails || !this.mediaItems) return;
        
        const currentItem = this.mediaItems[this.currentImageIndex];
        
        const fullscreenContainer = document.createElement('div');
        fullscreenContainer.className = 'fullscreen-mode';
        fullscreenContainer.setAttribute('role', 'dialog');
        fullscreenContainer.setAttribute('aria-modal', 'true');
        fullscreenContainer.setAttribute('aria-label', 'Полноэкранный просмотр');
        
        fullscreenContainer.innerHTML = `
            <div class="fullscreen-image-container">
                ${currentItem.type === 'video' 
                    ? `<video controls 
                            src="${currentItem.src}"
                            class="fullscreen-video"
                            autoplay
                            preload="metadata">
                            Ваш браузер не поддерживает видео.
                       </video>`
                    : `<img src="${currentItem.src}" 
                            alt="${this.currentProductDetails.title} - изображение ${this.currentImageIndex + 1} из ${this.mediaItems.length}"
                            id="fullscreenImage"
                            class="fullscreen-image">`
                }
                
                <div class="fullscreen-controls" role="group" aria-label="Управление полноэкранным режимом">
                    <button class="fullscreen-btn" 
                            onclick="catalog.prevImageFullscreen()" 
                            aria-label="Предыдущее"
                            ${this.mediaItems.length <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    
                    <button class="fullscreen-btn" 
                            onclick="catalog.nextImageFullscreen()" 
                            aria-label="Следующее"
                            ${this.mediaItems.length <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right" aria-hidden="true"></i>
                    </button>
                    
                    <button class="fullscreen-btn" 
                            onclick="catalog.closeFullscreen()" 
                            aria-label="Закрыть полноэкранный режим">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
                
                <div class="fullscreen-counter" aria-live="polite">
                    ${this.currentImageIndex + 1} / ${this.mediaItems.length}
                    <span class="sr-only">${currentItem.type === 'video' ? 'видео' : 'изображение'}</span>
                </div>
                
                <div class="fullscreen-instructions" aria-hidden="true">
                    Используйте стрелки для навигации, ESC для выхода
                </div>
            </div>
        `;
        
        document.body.appendChild(fullscreenContainer);
        
        // Блокируем прокрутку страницы
        document.body.style.overflow = 'hidden';
        
        // Устанавливаем фокус на контейнер
        setTimeout(() => {
            fullscreenContainer.focus();
        }, 100);
        
        // Добавляем обработчик клавиатуры для полноэкранного режима
        this.initFullscreenKeyboardEvents(fullscreenContainer);
        
        // Объявляем скринридеру
        const mediaType = this.mediaItems[this.currentImageIndex].type === 'video' ? 'видео' : 'изображение';
        this.announceToScreenReader(`Полноэкранный режим. ${mediaType} ${this.currentImageIndex + 1} из ${this.mediaItems.length}. Используйте стрелки для навигации.`);
    }
    
    /**
     * Инициализация клавиатурных событий для полноэкранного режима
     */
    initFullscreenKeyboardEvents(container) {
        const handleKeyDown = (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevImageFullscreen();
                    break;
                    
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextImageFullscreen();
                    break;
                    
                case 'Escape':
                    this.closeFullscreen();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    this.changeImage(0);
                    this.updateFullscreenMedia();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    this.changeImage(this.mediaItems.length - 1);
                    this.updateFullscreenMedia();
                    break;
            }
        };
        
        container.addEventListener('keydown', handleKeyDown);
        
        // Сохраняем обработчик для удаления
        this.fullscreenHandler = handleKeyDown;
    }
    
    /**
     * Следующее медиа в полноэкранном режиме
     */
    nextImageFullscreen() {
        this.nextImage();
        this.updateFullscreenMedia();
    }
    
    /**
     * Предыдущее медиа в полноэкранном режиме
     */
    prevImageFullscreen() {
        this.prevImage();
        this.updateFullscreenMedia();
    }
    
    /**
     * Обновление медиа в полноэкранном режиме
     */
    updateFullscreenMedia() {
        const currentItem = this.mediaItems[this.currentImageIndex];
        const fullscreenContainer = document.querySelector('.fullscreen-image-container');
        
        if (!fullscreenContainer) return;
        
        // Обновляем контент
        const mediaElement = currentItem.type === 'video' 
            ? `<video controls 
                    src="${currentItem.src}"
                    class="fullscreen-video"
                    autoplay
                    preload="metadata">
                    Ваш браузер не поддерживает видео.
               </video>`
            : `<img src="${currentItem.src}" 
                    alt="${this.currentProductDetails.title} - изображение ${this.currentImageIndex + 1} из ${this.mediaItems.length}"
                    class="fullscreen-image">`;
        
        // Обновляем только медиа, сохраняя контролы
        const oldMedia = fullscreenContainer.querySelector('.fullscreen-video, .fullscreen-image');
        if (oldMedia) {
            oldMedia.outerHTML = mediaElement;
        }
        
        // Обновляем счетчик
        const counter = fullscreenContainer.querySelector('.fullscreen-counter');
        if (counter) {
            counter.innerHTML = `
                ${this.currentImageIndex + 1} / ${this.mediaItems.length}
                <span class="sr-only">${currentItem.type === 'video' ? 'видео' : 'изображение'}</span>
            `;
        }
        
        // Обновляем состояние кнопок
        const prevBtn = fullscreenContainer.querySelector('.fullscreen-btn[onclick*="prevImageFullscreen"]');
        const nextBtn = fullscreenContainer.querySelector('.fullscreen-btn[onclick*="nextImageFullscreen"]');
        
        if (prevBtn) {
            prevBtn.disabled = this.mediaItems.length <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.mediaItems.length <= 1;
        }
        
        // Объявляем скринридеру
        this.announceToScreenReader(`${currentItem.type === 'video' ? 'Видео' : 'Изображение'} ${this.currentImageIndex + 1} из ${this.mediaItems.length}`);
    }
    
    /**
     * Закрытие полноэкранного режима
     */
    closeFullscreen() {
        const fullscreenContainer = document.querySelector('.fullscreen-mode');
        if (fullscreenContainer) {
            fullscreenContainer.remove();
        }
        
        // Восстанавливаем прокрутку
        document.body.style.overflow = '';
        
        // Возвращаем фокус на модальное окно
        const modal = document.querySelector('.modal.active');
        if (modal) {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) closeBtn.focus();
        }
        
        // Объявляем скринридеру
        this.announceToScreenReader('Полноэкранный режим закрыт');
    }
    
    /**
     * Закрытие модального окна с деталями товара
     */
    closeProductModal() {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.classList.remove('active');
            
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        }
        
        // Удаляем обработчик клавиатуры
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        
        // Восстанавливаем прокрутку
        document.body.style.overflow = '';
        
        // Возвращаем фокус на карточку товара
        if (this.currentProductDetails) {
            const productCard = document.querySelector(`.product-card[data-id="${this.currentProductDetails.id}"]`);
            if (productCard) {
                productCard.focus();
            }
        }
        
        // Очищаем данные
        this.currentProductDetails = null;
        this.currentFeaturePage = 0;
        this.currentImageIndex = 0;
        this.images = [];
        this.mediaItems = [];
        
        // Объявляем скринридеру
        this.announceToScreenReader('Окно деталей товара закрыто');
    }
    
    /**
     * Поиск по каталогу (публичный метод)
     */
    search(query) {
        this.searchProducts(query);
    }
    
    /**
     * Получение текущей категории (публичный метод)
     */
    getCurrentCategory() {
        return this.currentCategory;
    }
    
    /**
     * Получение количества товаров (публичный метод)
     */
    getProductsCount() {
        return this.filteredProducts.length;
    }
    
    /**
     * Обновление каталога (публичный метод)
     */
    refresh() {
        this.loadProducts(this.currentCategory);
        this.announceToScreenReader('Каталог обновлен');
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

// Создаем глобальный экземпляр каталога
document.addEventListener('DOMContentLoaded', () => {
    window.catalog = new CatalogManager();
});

// Добавляем стили при загрузке
(function addStyles() {
    if (document.getElementById('catalog-base-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'catalog-base-styles';
    style.textContent = `
        /* Стили для индикатора загрузки */
        .loading-spinner {
            text-align: center;
            padding: 60px;
        }
        
        .loading-spinner i {
            color: #E67E22;
            margin-bottom: 20px;
        }
        
        /* Стили для пустого каталога */
        .empty-catalog {
            text-align: center;
            padding: 60px;
        }
        
        .empty-catalog i {
            color: #6c757d;
            margin-bottom: 20px;
        }
        
        /* Стили для ошибки */
        .error-message {
            text-align: center;
            padding: 60px;
        }
        
        .error-message i {
            color: #dc3545;
            margin-bottom: 20px;
        }
        
        /* Стили для скринридеров */
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
        
        /* Фокус для доступности */
        .product-card:focus-visible,
        .tab-btn:focus-visible,
        .btn-small:focus-visible,
        .image-thumbnail:focus-visible {
            outline: 3px solid #0066CC;
            outline-offset: 2px;
        }
    `;
    
    document.head.appendChild(style);
})();

// Добавляем стили для полноэкранного режима
(function addFullscreenStyles() {
    if (document.getElementById('fullscreen-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'fullscreen-styles';
    style.textContent = `
        .fullscreen-mode {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            outline: none;
        }
        
        .fullscreen-image-container {
            max-width: 90vw;
            max-height: 90vh;
            position: relative;
        }
        
        .fullscreen-image {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border: 2px solid white;
            border-radius: 8px;
        }
        
        .fullscreen-video {
            max-width: 100%;
            max-height: 90vh;
            width: auto;
            height: auto;
            border: 2px solid white;
            border-radius: 8px;
            background: #000;
        }
        
        .fullscreen-controls {
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
        }
        
        .fullscreen-btn {
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .fullscreen-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
        }
        
        .fullscreen-btn:focus-visible {
            outline: 3px solid #0066CC;
            outline-offset: 2px;
        }
        
        .fullscreen-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        
        .fullscreen-counter {
            position: absolute;
            bottom: 20px;
            left: 20px;
            color: white;
            font-size: 1.1rem;
            background: rgba(0, 0, 0, 0.6);
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid white;
        }
        
        .fullscreen-instructions {
            position: absolute;
            bottom: 20px;
            right: 20px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
            background: rgba(0, 0, 0, 0.3);
            padding: 6px 12px;
            border-radius: 20px;
        }
        
        @media (max-width: 768px) {
            .fullscreen-controls {
                top: 10px;
                right: 10px;
            }
            
            .fullscreen-btn {
                width: 44px;
                height: 44px;
            }
            
            .fullscreen-counter {
                bottom: 10px;
                left: 10px;
                font-size: 0.9rem;
            }
            
            .fullscreen-instructions {
                display: none;
            }
        }
    `;
    
    document.head.appendChild(style);
})();

// Экспорт для модульных систем
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CatalogManager };
}

console.log('📦 catalog.js загружен, версия 3.0 (с поддержкой видео)');