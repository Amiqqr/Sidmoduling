// Класс для управления каталогом
class CatalogManager {
    constructor() {
        this.currentCategory = 'all';
        this.products = [];
        this.filteredProducts = [];
        this.currentProductDetails = null;
        this.currentFeaturePage = 0;
        this.currentImageIndex = 0;
        this.featuresPerPage = 5;
        this.init();
    }
    
    async init() {
        // Инициализация базы данных
        await Database.init();
        
        console.log('Каталог: Загружено товаров из базы:', Database.products.length);
        
        // Загрузка продуктов
        await this.loadProducts();
        
        console.log('Каталог: Отфильтровано товаров:', this.filteredProducts.length);
        
        // Инициализация событий
        this.initEvents();
        
        // Инициализация анимаций
        this.initAnimations();
    }
    
    async loadProducts(category = 'all') {
        this.currentCategory = category;
        
        // Показать загрузку
        this.showLoading();
        
        // Загрузить продукты
        this.products = await Database.loadProducts(category);
        this.filteredProducts = [...this.products];
        
        console.log('Каталог loadProducts: Загружено', this.products.length, 'товаров категории', category);
        
        // Отрисовать продукты
        this.renderProducts();
        
        // Скрыть загрузку
        this.hideLoading();
    }
    
    showLoading() {
        const catalogGrid = document.getElementById('catalogGrid');
        if (!catalogGrid) return;
        
        catalogGrid.innerHTML = `
            <div class="loading-spinner" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
                <i class="fas fa-spinner fa-spin fa-3x" style="color: var(--accent-teal);"></i>
                <p style="margin-top: 20px; color: var(--gray-text);">Загрузка каталога...</p>
            </div>
        `;
    }
    
    hideLoading() {
        // Анимация загрузки будет скрыта при рендере
    }
    
    renderProducts() {
        const catalogGrid = document.getElementById('catalogGrid');
        if (!catalogGrid) return;
        
        console.log('Каталог renderProducts: Отрисовка', this.filteredProducts.length, 'товаров');
        
        if (this.filteredProducts.length === 0) {
            catalogGrid.innerHTML = `
                <div class="empty-catalog" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
                    <i class="fas fa-box-open fa-3x" style="color: var(--gray-text); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--dark-text); margin-bottom: 10px;">Товары не найдены</h3>
                    <p style="color: var(--gray-text);">Попробуйте выбрать другую категорию</p>
                </div>
            `;
            return;
        }
        
        catalogGrid.innerHTML = '';
        
        this.filteredProducts.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            catalogGrid.appendChild(productCard);
        });
        
        // Инициализация анимаций для новых карточек
        setTimeout(() => {
            this.initProductAnimations();
        }, 100);
    }
    
    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card animate-on-scroll';
        card.dataset.id = product.id;
        card.dataset.category = product.category;
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Используем первое изображение для карточки
        const mainImage = product.images?.[0] || product.image || 'https://via.placeholder.com/350x250/FF8C00/FFFFFF?text=Изображение+товара';
        
        // Формирование HTML карточки
        card.innerHTML = `
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            ${product.sale ? `<div class="sale-badge" style="position: absolute; top: 20px; left: 20px; background: #FF8C00; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 0.9rem; z-index: 2; box-shadow: 0 4px 12px rgba(216, 151, 0, 0.3);">${product.sale}</div>` : ''}
            
            <div class="product-image-container">
                <img src="${mainImage}" alt="${product.title}" class="product-image" loading="lazy" onerror="this.src='https://via.placeholder.com/350x250/FF8C00/FFFFFF?text=Изображение+товара'">
                ${(product.images?.length || 0) > 1 ? `
                ` : ''}
            </div>
            
            <div class="product-content">
                <div class="product-category">${this.getCategoryName(product.category)}</div>
                <h3 class="product-title">${product.title}</h3>
                
                <div class="product-price">
                    <span class="current-price">${product.price}</span>
                    ${product.oldPrice ? `<span class="product-old-price">${product.oldPrice}</span>` : ''}
                </div>
                
                <ul class="product-features">
                    ${product.features.slice(0, 3).map(feature => `
                        <li><i class="fas fa-check"></i>${feature}</li>
                    `).join('')}
                    ${product.features.length > 3 ? '<li><i class="fas fa-ellipsis-h"></i>Еще ' + (product.features.length - 3) + ' характеристик...</li>' : ''}
                </ul>
                
                <div class="product-actions">
                    <a href="#consultation" class="btn-small btn-buy" onclick="catalog.setProductForConsultation(${product.id}); return false;">
                        <i class="fas fa-shopping-cart"></i>
                        Заказать
                    </a>
                    <button class="btn-small btn-details" onclick="catalog.showProductDetails(${product.id})">
                        <i class="fas fa-images"></i>
                        Подробнее
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    getCategoryName(category) {
        const categories = {
            'houses': 'Модульные дома',
            'offices': 'Офисные модули',
            'storage': 'Бытовки',
            'promo': 'Акции'
        };
        return categories[category] || category;
    }
    
    initEvents() {
        // Обработчики вкладок
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Обновить активную вкладку
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Загрузить продукты выбранной категории
                this.loadProducts(btn.dataset.category);
                
                // Прокрутить к каталогу
                this.scrollToCatalog();
            });
        });
        
        // Принудительная перезагрузка для отладки
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                console.log('Принудительная перезагрузка каталога');
                this.loadProducts(this.currentCategory);
            }
        });
    }
    
    initAnimations() {
        // Инициализация наблюдателя для анимаций
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Наблюдать за всеми элементами с анимацией
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
    
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
    
    searchProducts(query) {
        if (!query.trim()) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = Database.searchProducts(query, this.currentCategory);
        }
        this.renderProducts();
    }
    
    scrollToCatalog() {
        const catalogSection = document.getElementById('catalog');
        if (catalogSection) {
            const headerHeight = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: catalogSection.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
        }
    }
    
    // Установка продукта для консультации
    setProductForConsultation(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;
        
        const productSelect = document.getElementById('product');
        if (productSelect) {
            // Создаем опцию с названием продукта
            const option = document.createElement('option');
            option.value = `product_${productId}`;
            option.textContent = product.title;
            
            // Удаляем предыдущие опции продуктов
            const existingOptions = productSelect.querySelectorAll('option[value^="product_"]');
            existingOptions.forEach(opt => opt.remove());
            
            // Добавляем новую опцию
            productSelect.appendChild(option);
            productSelect.value = option.value;
        }
        
        // Прокручиваем к форме
        setTimeout(() => {
            document.getElementById('consultation').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start' 
            });
        }, 100);
        
        return false;
    }
    
    // Показать детали продукта с галереей изображений
    async showProductDetails(productId) {
        const product = await Database.getProductById(productId);
        if (!product) {
            alert('Информация о товаре не найдена');
            return;
        }
        
        this.currentProductDetails = product;
        this.currentFeaturePage = 0;
        this.currentImageIndex = 0;
        
        // Создание модального окна с галереей изображений и пагинацией характеристик
        this.createProductModal(product);
    }
    
    createProductModal(product) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content product-details-modal">
                <button class="modal-close" onclick="catalog.closeProductModal()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="product-details-container">
                    <div class="product-details-image">
                        <div class="main-image-container">
                            <img src="${product.images?.[0] || product.image || 'https://via.placeholder.com/500x350/FF8C00/FFFFFF?text=Изображение+товара'}" 
                                 alt="${product.title}" 
                                 id="mainProductImage"
                                 onerror="this.src='https://via.placeholder.com/500x350/FF8C00/FFFFFF?text=Изображение+товара'">
                            <div class="image-counter">
                                <span id="currentImageIndex">1</span> / <span id="totalImages">${product.images?.length || 1}</span>
                            </div>
                        </div>
                        
                        <div class="image-nav">
                            <button class="image-nav-btn prev-btn" onclick="catalog.prevImage()" ${(product.images?.length || 1) <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="image-nav-btn next-btn" onclick="catalog.nextImage()" ${(product.images?.length || 1) <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        
                        <!-- Миниатюры изображений -->
                        <div class="image-thumbnails" id="imageThumbnails">
                            <!-- Миниатюры будут загружены динамически -->
                        </div>
                    </div>
                    
                    <div class="product-details-content">
                        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                        
                        <div class="product-category">${this.getCategoryName(product.category)}</div>
                        <h2 class="product-title">${product.title}</h2>
                        
                        <div class="product-price-large">
                            <span class="current-price">${product.price}</span>
                            ${product.oldPrice ? `<span class="product-old-price">${product.oldPrice}</span>` : ''}
                            ${product.sale ? `<span class="sale-badge">${product.sale}</span>` : ''}
                        </div>
                        
                        <div class="product-description">
                            <h3>Описание</h3>
                            <p>${product.description || 'Подробное описание товара. Все характеристики указаны ниже.'}</p>
                        </div>
                        
                        <div class="product-features-section">
                            <div class="section-header">
                                <h3>Характеристики</h3>
                                <div class="features-nav">
                                    <button class="features-nav-btn prev-features" onclick="catalog.prevFeaturesPage()" disabled>
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                    <span class="features-page-info">Страница <span id="currentPage">1</span> из <span id="totalPages">1</span></span>
                                    <button class="features-nav-btn next-features" onclick="catalog.nextFeaturesPage()">
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="features-container" id="featuresContainer">
                                <!-- Характеристики будут загружены динамически -->
                            </div>
                        </div>
                        
                        <div class="product-specifications">
                            ${product.specifications ? `
                                <h3>Технические характеристики</h3>
                                <div class="specs-grid" id="specsGrid">
                                    <!-- Технические характеристики будут загружены динамически -->
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="product-actions-large">
                            <button class="btn-primary" onclick="catalog.setProductForConsultation(${product.id}); catalog.closeProductModal();">
                                <i class="fas fa-phone-alt"></i>
                                Заказать консультацию
                            </button>
                            <button class="btn-secondary" onclick="catalog.openFullscreenView()">
                                <i class="fas fa-expand-arrows-alt"></i>
                                Полноэкранный просмотр
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Инициализация стилей для модального окна
        this.initModalStyles();
        
        // Загрузка начальных данных
        this.updateFeaturesDisplay();
        this.updateSpecifications();
        this.updateNavigationButtons();
        this.updateImageThumbnails();
        this.updateImageCounter();
        this.updateImageNavigationButtons();
        
        // Добавляем обработчики для клавиатуры
        this.initModalKeyboardEvents();
        
        // Закрытие при клике на фон
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProductModal();
            }
        });
    }
    
    initModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .product-details-modal {
                max-width: 900px;
                max-height: 90vh;
                padding: 0;
                overflow-y: auto;
            }
            
            .product-details-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                padding: 30px;
            }
            
            .product-details-image {
                position: relative;
            }
            
            .main-image-container {
                position: relative;
                border-radius: var(--radius);
                overflow: hidden;
                height: 350px;
                margin-bottom: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            }
            
            .main-image-container img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
            }
            
            .main-image-container img:hover {
                transform: scale(1.02);
            }
            
            .image-counter {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
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
                width: 45px;
                height: 45px;
                background: rgba(255, 255, 255, 0.95);
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                color: var(--primary-dark);
                font-size: 1.2rem;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            
            .image-nav-btn:hover:not(:disabled) {
                background: white;
                transform: scale(1.15);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
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
                border-radius: 10px;
                background: var(--light-bg);
            }
            
            .image-thumbnail {
                width: 80px;
                height: 60px;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                border: 3px solid transparent;
                transition: all 0.3s ease;
                flex-shrink: 0;
                position: relative;
            }
            
            .image-thumbnail img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .image-thumbnail:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .image-thumbnail.active {
                border-color: var(--accent-teal);
                box-shadow: 0 5px 15px rgba(255, 140, 0, 0.3);
            }
            
            .image-thumbnail .thumbnail-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 140, 0, 0.1);
                display: none;
            }
            
            .image-thumbnail.active .thumbnail-overlay {
                display: block;
            }
            
            .product-details-content {
                padding: 10px 0;
            }
            
            .product-price-large {
                font-size: 2.2rem;
                font-weight: 800;
                color: var(--accent-teal);
                margin: 20px 0;
                display: flex;
                align-items: center;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .product-description h3,
            .product-features-section h3,
            .product-specifications h3 {
                color: var(--primary-dark);
                margin: 25px 0 15px 0;
                font-size: 1.3rem;
            }
            
            .product-features-section {
                margin: 25px 0;
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .features-nav {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .features-nav-btn {
                width: 35px;
                height: 35px;
                background: var(--light-bg);
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                color: var(--dark-text);
            }
            
            .features-nav-btn:hover:not(:disabled) {
                background: var(--accent-teal);
                color: white;
                transform: scale(1.1);
            }
            
            .features-nav-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .features-page-info {
                font-size: 0.9rem;
                color: var(--gray-text);
                min-width: 120px;
                text-align: center;
            }
            
            .features-container {
                background: var(--light-bg);
                border-radius: 10px;
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
                padding: 12px 0;
                color: var(--dark-text);
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
            }
            
            .features-container li:hover {
                background: rgba(255, 140, 0, 0.05);
                padding-left: 10px;
                border-bottom-color: var(--accent-teal);
            }
            
            .features-container li i {
                color: var(--accent-teal);
                width: 20px;
                font-size: 0.9rem;
            }
            
            .features-container li:last-child {
                border-bottom: none;
            }
            
            .specs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .spec-item {
                background: var(--light-bg);
                padding: 15px;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;
            }
            
            .spec-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                background: white;
            }
            
            .spec-key {
                font-weight: 600;
                color: var(--dark-text);
                margin-bottom: 5px;
                font-size: 0.9rem;
            }
            
            .spec-value {
                color: var(--gray-text);
                font-size: 0.9rem;
            }
            
            .product-actions-large {
                display: flex;
                gap: 15px;
                margin-top: 30px;
                flex-wrap: wrap;
            }
            
            .product-actions-large .btn-primary,
            .product-actions-large .btn-secondary {
                flex: 1;
                min-width: 200px;
            }
            
            .product-actions-large .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: var(--primary-dark);
                border: 2px solid var(--accent-teal);
            }
            
            .product-actions-large .btn-secondary:hover {
                background: var(--accent-teal);
                color: white;
            }
            
            /* Анимация смены изображений */
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            
            @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            .image-fade-in {
                animation: fadeIn 0.4s ease;
            }
            
            .image-slide-left {
                animation: slideInLeft 0.4s ease;
            }
            
            .image-slide-right {
                animation: slideInRight 0.4s ease;
            }
            
            /* Полноэкранный режим */
            .fullscreen-mode {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.95);
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .fullscreen-image-container {
                max-width: 90vw;
                max-height: 90vh;
                position: relative;
            }
            
            .fullscreen-image-container img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
            }
            
            .fullscreen-controls {
                position: absolute;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
            }
            
            .fullscreen-controls button {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 1.3rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
            }
            
            .fullscreen-controls button:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
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
                
                .image-thumbnails {
                    justify-content: center;
                }
                
                .image-thumbnail {
                    width: 70px;
                    height: 50px;
                }
                
                .product-actions-large {
                    flex-direction: column;
                }
                
                .product-actions-large .btn-primary,
                .product-actions-large .btn-secondary {
                    min-width: 100%;
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
                
                .specs-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            /* Анимация смены страниц характеристик */
            .features-page-enter {
                animation: slideInRight 0.3s ease;
            }
            
            .features-page-exit {
                animation: slideOutLeft 0.3s ease;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    updateFeaturesDisplay() {
        if (!this.currentProductDetails) return;
        
        const featuresContainer = document.getElementById('featuresContainer');
        if (!featuresContainer) return;
        
        const features = this.currentProductDetails.features || [];
        const totalPages = Math.ceil(features.length / this.featuresPerPage);
        const startIndex = this.currentFeaturePage * this.featuresPerPage;
        const endIndex = startIndex + this.featuresPerPage;
        const pageFeatures = features.slice(startIndex, endIndex);
        
        // Добавляем анимацию
        featuresContainer.classList.add('features-page-exit');
        
        setTimeout(() => {
            featuresContainer.innerHTML = `
                <ul>
                    ${pageFeatures.map(feature => `
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span>${feature}</span>
                        </li>
                    `).join('')}
                </ul>
                ${features.length === 0 ? '<p style="text-align: center; color: var(--gray-text); padding: 40px;">Характеристики отсутствуют</p>' : ''}
            `;
            
            featuresContainer.classList.remove('features-page-exit');
            featuresContainer.classList.add('features-page-enter');
            
            setTimeout(() => {
                featuresContainer.classList.remove('features-page-enter');
            }, 300);
        }, 300);
        
        // Обновляем информацию о страницах
        const currentPageEl = document.getElementById('currentPage');
        const totalPagesEl = document.getElementById('totalPages');
        
        if (currentPageEl) currentPageEl.textContent = this.currentFeaturePage + 1;
        if (totalPagesEl) totalPagesEl.textContent = totalPages;
        
        // Обновляем кнопки навигации
        this.updateNavigationButtons();
    }
    
    updateSpecifications() {
        if (!this.currentProductDetails || !this.currentProductDetails.specifications) return;
        
        const specsGrid = document.getElementById('specsGrid');
        if (!specsGrid) return;
        
        const specs = this.currentProductDetails.specifications;
        
        specsGrid.innerHTML = Object.entries(specs).map(([key, value]) => `
            <div class="spec-item">
                <span class="spec-key">${this.formatSpecKey(key)}</span>
                <span class="spec-value">${value}</span>
            </div>
        `).join('');
    }
    
    formatSpecKey(key) {
        const translations = {
            'area': 'Площадь',
            'length': 'Длина',
            'width': 'Ширина',
            'height': 'Высота',
            'weight': 'Вес',
            'warranty': 'Гарантия',
            'rooms': 'Количество комнат',
            'windows': 'Окна',
            'doors': 'Двери',
            'insulation': 'Утепление',
            'heating': 'Отопление',
            'ac': 'Кондиционер',
            'terrace': 'Терраса',
            'gates': 'Ворота',
            'material': 'Материал',
            'color': 'Цвет',
            'delivery': 'Доставка',
            'assembly': 'Сборка',
            'price': 'Цена',
            'discount': 'Скидка',
            'stock': 'Наличие'
        };
        
        return translations[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }
    
    updateNavigationButtons() {
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
    
    // Методы для навигации по характеристикам
    nextFeaturesPage() {
        if (!this.currentProductDetails) return;
        
        const features = this.currentProductDetails.features || [];
        const totalPages = Math.ceil(features.length / this.featuresPerPage);
        
        if (this.currentFeaturePage < totalPages - 1) {
            this.currentFeaturePage++;
            this.updateFeaturesDisplay();
        }
    }
    
    prevFeaturesPage() {
        if (this.currentFeaturePage > 0) {
            this.currentFeaturePage--;
            this.updateFeaturesDisplay();
        }
    }
    
    // Методы для управления изображениями
    updateImageThumbnails() {
        if (!this.currentProductDetails) return;
        
        const thumbnailsContainer = document.getElementById('imageThumbnails');
        if (!thumbnailsContainer) return;
        
        const images = this.currentProductDetails.images || [this.currentProductDetails.image || 'https://via.placeholder.com/500x350/FF8C00/FFFFFF?text=Изображение+товара'];
        
        thumbnailsContainer.innerHTML = images.map((img, index) => `
            <div class="image-thumbnail ${index === this.currentImageIndex ? 'active' : ''}" 
                 onclick="catalog.changeImage(${index})"
                 data-index="${index}">
                <img src="${img}" 
                     alt="Миниатюра ${index + 1}"
                     onerror="this.src='https://via.placeholder.com/100x75/FF8C00/FFFFFF?text=Изображение'">
                <div class="thumbnail-overlay"></div>
            </div>
        `).join('');
    }
    
    updateImageCounter() {
        if (!this.currentProductDetails) return;
        
        const images = this.currentProductDetails.images || [this.currentProductDetails.image];
        const totalImages = images.length || 1;
        
        const currentIndexEl = document.getElementById('currentImageIndex');
        const totalImagesEl = document.getElementById('totalImages');
        
        if (currentIndexEl) currentIndexEl.textContent = this.currentImageIndex + 1;
        if (totalImagesEl) totalImagesEl.textContent = totalImages;
    }
    
    changeImage(index) {
        if (!this.currentProductDetails) return;
        
        const images = this.currentProductDetails.images || [this.currentProductDetails.image || 'https://via.placeholder.com/500x350/FF8C00/FFFFFF?text=Изображение+товара'];
        if (index < 0 || index >= images.length) return;
        
        const oldIndex = this.currentImageIndex;
        this.currentImageIndex = index;
        
        const mainImage = document.getElementById('mainProductImage');
        if (!mainImage) return;
        
        // Определяем направление анимации
        const animationClass = index > oldIndex ? 'image-slide-right' : 'image-slide-left';
        
        // Добавляем анимацию
                mainImage.classList.add(animationClass);
        
        // Меняем изображение
        setTimeout(() => {
            mainImage.src = images[index];
            mainImage.alt = `${this.currentProductDetails.title} - фото ${index + 1}`;
            
            // Обновляем миниатюры
            this.updateImageThumbnails();
            
            // Обновляем счетчик
            this.updateImageCounter();
            
            // Обновляем кнопки навигации
            this.updateImageNavigationButtons();
            
            // Убираем анимацию
            setTimeout(() => {
                mainImage.classList.remove(animationClass);
            }, 400);
        }, 200);
    }
    
    nextImage() {
        if (!this.currentProductDetails) return;
        
        const images = this.currentProductDetails.images || [this.currentProductDetails.image || 'https://via.placeholder.com/500x350/FF8C00/FFFFFF?text=Изображение+товара'];
        const nextIndex = (this.currentImageIndex + 1) % images.length;
        this.changeImage(nextIndex);
    }
    
    prevImage() {
        if (!this.currentProductDetails) return;
        
        const images = this.currentProductDetails.images || [this.currentProductDetails.image || 'https://via.placeholder.com/500x350/FF8C00/FFFFFF?text=Изображение+товара'];
        const prevIndex = this.currentImageIndex === 0 ? images.length - 1 : this.currentImageIndex - 1;
        this.changeImage(prevIndex);
    }
    
    updateImageNavigationButtons() {
        if (!this.currentProductDetails) return;
        
        const images = this.currentProductDetails.images || [this.currentProductDetails.image];
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = images.length <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = images.length <= 1;
        }
    }
    
    // Метод для полноэкранного просмотра
    openFullscreenView() {
        if (!this.currentProductDetails) return;
        
        const images = this.currentProductDetails.images || [this.currentProductDetails.image || 'https://via.placeholder.com/500x350/FF8C00/FFFFFF?text=Изображение+товара'];
        const currentImage = images[this.currentImageIndex];
        
        const fullscreenContainer = document.createElement('div');
        fullscreenContainer.className = 'fullscreen-mode';
        fullscreenContainer.innerHTML = `
            <div class="fullscreen-image-container">
                <img src="${currentImage}" 
                     alt="${this.currentProductDetails.title} - фото ${this.currentImageIndex + 1}"
                     id="fullscreenImage">
                <div class="fullscreen-controls">
                    <button onclick="catalog.prevImageFullscreen()" title="Предыдущее фото">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button onclick="catalog.nextImageFullscreen()" title="Следующее фото">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <button onclick="catalog.closeFullscreen()" title="Закрыть">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="fullscreen-counter" style="position: absolute; bottom: 20px; left: 20px; color: white; font-size: 1.1rem; background: rgba(0,0,0,0.5); padding: 8px 15px; border-radius: 20px;">
                    ${this.currentImageIndex + 1} / ${images.length}
                </div>
            </div>
        `;
        
        document.body.appendChild(fullscreenContainer);
        
        // Блокируем прокрутку страницы
        document.body.style.overflow = 'hidden';
    }
    
    nextImageFullscreen() {
        this.nextImage();
        this.updateFullscreenImage();
    }
    
    prevImageFullscreen() {
        this.prevImage();
        this.updateFullscreenImage();
    }
    
    updateFullscreenImage() {
        if (!this.currentProductDetails) return;
        
        const images = this.currentProductDetails.images || [this.currentProductDetails.image || 'https://via.placeholder.com/500x350/FF8C00/FFFFFF?text=Изображение+товара'];
        const fullscreenImage = document.getElementById('fullscreenImage');
        const fullscreenContainer = document.querySelector('.fullscreen-counter');
        
        if (fullscreenImage) {
            fullscreenImage.src = images[this.currentImageIndex];
            fullscreenImage.alt = `${this.currentProductDetails.title} - фото ${this.currentImageIndex + 1}`;
        }
        
        if (fullscreenContainer) {
            fullscreenContainer.innerHTML = `${this.currentImageIndex + 1} / ${images.length}`;
        }
    }
    
    closeFullscreen() {
        const fullscreenContainer = document.querySelector('.fullscreen-mode');
        if (fullscreenContainer) {
            fullscreenContainer.remove();
        }
        
        // Восстанавливаем прокрутку страницы
        document.body.style.overflow = '';
    }
    
    // Обновляем initModalKeyboardEvents для поддержки навигации по изображениям
    initModalKeyboardEvents() {
        const handleKeyDown = (e) => {
            if (!this.currentProductDetails) return;
            
            const isFullscreen = document.querySelector('.fullscreen-mode');
            
            switch(e.key) {
                case 'ArrowLeft':
                    if (isFullscreen) {
                        this.prevImageFullscreen();
                    } else {
                        this.prevImage();
                    }
                    break;
                case 'ArrowRight':
                    if (isFullscreen) {
                        this.nextImageFullscreen();
                    } else {
                        this.nextImage();
                    }
                    break;
                case 'Escape':
                    if (isFullscreen) {
                        this.closeFullscreen();
                    } else {
                        this.closeProductModal();
                    }
                    break;
                case ' ':
                case 'Spacebar':
                    e.preventDefault();
                    if (!isFullscreen) {
                        this.openFullscreenView();
                    }
                    break;
                case 'f':
                case 'F':
                    if (!isFullscreen) {
                        this.openFullscreenView();
                    }
                    break;
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        
        // Удаляем обработчик при закрытии модального окна
        const modal = document.querySelector('.modal.active');
        if (modal) {
            const closeHandler = () => {
                document.removeEventListener('keydown', handleKeyDown);
                modal.removeEventListener('click', closeHandler);
            };
            modal.addEventListener('click', closeHandler);
        }
    }
    
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
        
        // Восстанавливаем обработчик для полноэкранного режима
        document.body.style.overflow = '';
        
        this.currentProductDetails = null;
        this.currentFeaturePage = 0;
        this.currentImageIndex = 0;
    }
}

// Инициализация глобального экземпляра
window.catalog = new CatalogManager();