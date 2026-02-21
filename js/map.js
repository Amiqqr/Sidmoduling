// Класс для управления картой
class MapManager {
    constructor() {
        this.map = null;
        this.marker = null;
        this.isLoaded = false;
        this.init();
    }
    
    init() {
        // Инициализация карты при загрузке страницы
        document.addEventListener('DOMContentLoaded', () => {
            this.loadMap();
            this.initMapEvents();
        });
    }
    
    loadMap() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) {
            console.error('Контейнер карты не найден');
            return;
        }
        
        try {
            // Пробуем Яндекс.Карты
            this.loadYandexMap();
        } catch (error) {
            console.error('Ошибка загрузки Яндекс.Карт:', error);
            // Пробуем Google Maps как запасной вариант через 1 секунду
            setTimeout(() => {
                this.loadGoogleMapsFallback();
            }, 1000);
        }
    }
    
    loadYandexMap() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;
        
        // Координаты Новосибирск, Мочищенское шоссе, 1/4к7
        const defaultLocation = {
            lat: 55.095863,
            lng: 82.892402,
            address: "г. Новосибирск, Мочищенское шоссе, 1/4к7"
        };
        
        // Создаем iframe с картой Яндекс
        const mapHtml = `
            <iframe 
                src="https://yandex.ru/map-widget/v1/?ll=${defaultLocation.lng},${defaultLocation.lat}&z=16&pt=${defaultLocation.lng},${defaultLocation.lat},pm2rdm&mode=search&text=${encodeURIComponent(defaultLocation.address)}"
                width="100%" 
                height="100%" 
                frameborder="0" 
                allowfullscreen="true"
                style="position:absolute;"
                loading="lazy"
                title="Карта расположения СибМодулинг"
            ></iframe>
        `;
        
        // Удаляем loader и добавляем карту
        const loader = mapContainer.querySelector('.map-loader');
        if (loader) {
            loader.remove();
        }
        
        mapContainer.innerHTML = mapHtml;
        this.isLoaded = true;
        
        // Добавляем анимацию появления
        setTimeout(() => {
            mapContainer.style.opacity = '1';
        }, 100);
        
        // Логирование успешной загрузки
        console.log('✅ Яндекс.Карты загружены');
    }
    
    loadGoogleMapsFallback() {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;
        
        // Координаты Новосибирск, Мочищенское шоссе, 1/4к7
        const defaultLocation = {
            lat: 55.095863,
            lng: 82.892402,
            address: "г. Новосибирск, Мочищенское шоссе, 1/4к7"
        };
        
        // Создаем iframe с картой Google Maps
        const mapHtml = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2286.25123456789!2d${defaultLocation.lng}!3d${defaultLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDA1JzQ1LjEiTiA4MsKwNTMnMzIuNiJF!5e0!3m2!1sru!2sru!4v${Date.now()}&q=${encodeURIComponent(defaultLocation.address)}"
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Карта расположения СибМодулинг (Google Maps)"
            ></iframe>
        `;
        
        // Удаляем loader и добавляем карту
        const loader = mapContainer.querySelector('.map-loader');
        if (loader) {
            loader.remove();
        }
        
        mapContainer.innerHTML = mapHtml;
        this.isLoaded = true;
        
        // Добавляем анимацию появления
        setTimeout(() => {
            mapContainer.style.opacity = '1';
        }, 100);
        
        // Логирование успешной загрузки
        console.log('✅ Google Maps загружены (fallback)');
    }
    
    initMapEvents() {
        // Добавляем обработчики событий для карты
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer) return;
        
        // При наведении на карту
        mapContainer.addEventListener('mouseenter', () => {
            if (this.isLoaded) {
                const iframe = mapContainer.querySelector('iframe');
                if (iframe) {
                    iframe.style.filter = 'grayscale(0%) contrast(100%)';
                }
            }
        });
        
        mapContainer.addEventListener('mouseleave', () => {
            if (this.isLoaded) {
                const iframe = mapContainer.querySelector('iframe');
                if (iframe) {
                    iframe.style.filter = 'grayscale(20%) contrast(110%)';
                }
            }
        });
        
        // Клик по карте
        mapContainer.addEventListener('click', (e) => {
            // Проверяем, не кликнули ли по самому iframe
            if (e.target.tagName !== 'IFRAME') {
                this.openFullScreenMap();
            }
        });
    }
    
    openFullScreenMap() {
        // Открытие карты в полном экране
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content map-modal">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                <h3>Карта проезда</h3>
                <div class="fullscreen-map">
                    <iframe 
                        src="https://yandex.ru/map-widget/v1/?ll=82.892402,55.095863&z=16&pt=82.892402,55.095863,pm2rdm&mode=search&text=${encodeURIComponent('г. Новосибирск, Мочищенское шоссе, 1/4к7')}"
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        allowfullscreen="true"
                        loading="lazy"
                        title="Карта проезда к СибМодулинг"
                    ></iframe>
                </div>
                <div class="map-instructions">
                    <p><i class="fas fa-car"></i> Бесплатная парковка для клиентов</p>
                    <p><i class="fas fa-road"></i> Мочищенское шоссе, 1/4к7</p>
                    <p><i class="fas fa-clock"></i> Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00</p>
                </div>
            </div>
        `;
        
        // Стили для модального окна с картой
        const style = document.createElement('style');
        style.textContent = `
            .map-modal {
                max-width: 90%;
                max-height: 90vh;
                padding: 20px;
                display: flex;
                flex-direction: column;
            }
            
            .map-modal h3 {
                color: var(--primary-dark);
                margin-bottom: 20px;
                text-align: center;
            }
            
            .fullscreen-map {
                flex: 1;
                min-height: 400px;
                border-radius: var(--radius);
                overflow: hidden;
                margin-bottom: 20px;
            }
            
            .map-instructions {
                background: var(--light-bg);
                padding: 20px;
                border-radius: var(--radius);
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            
            .map-instructions p {
                display: flex;
                align-items: center;
                gap: 10px;
                color: var(--gray-text);
                margin: 0;
            }
            
            .map-instructions i {
                color: var(--accent-teal);
                width: 20px;
            }
            
            @media (max-width: 768px) {
                .map-modal {
                    max-width: 95%;
                    padding: 15px;
                }
                
                .map-instructions {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Закрытие при клике на фон
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
    }
    
    // Метод для обновления местоположения (если нужно менять адрес)
    updateLocation(lat, lng, address) {
        const mapContainer = document.getElementById('mapContainer');
        if (!mapContainer || !this.isLoaded) return;
        
        const iframe = mapContainer.querySelector('iframe');
        if (iframe) {
            iframe.src = `https://yandex.ru/map-widget/v1/?ll=${lng},${lat}&z=16&pt=${lng},${lat},pm2rdm&mode=search&text=${encodeURIComponent(address)}`;
        }
    }
    
    // Метод для получения текущего местоположения пользователя
    getUserLocation() {
        if (!navigator.geolocation) {
            console.warn('Геолокация не поддерживается браузером');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Можно использовать для построения маршрута
                this.showRouteToOffice(userLocation);
            },
            (error) => {
                console.warn('Ошибка получения геолокации:', error);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }
    
    showRouteToOffice(userLocation) {
        // Показать маршрут от пользователя до офиса
        const officeLocation = { lat: 55.095863, lng: 82.892402 };
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content route-modal">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
                <h3>Маршрут до нас</h3>
                <div class="route-map">
                    <iframe 
                        src="https://yandex.ru/map-widget/v1/?rtext=${userLocation.lat},${userLocation.lng}~${officeLocation.lat},${officeLocation.lng}&rtt=auto"
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        allowfullscreen="true"
                        title="Маршрут до СибМодулинг"
                    ></iframe>
                </div>
                <div class="route-info">
                    <p><i class="fas fa-route"></i> Маршрут от вашего местоположения</p>
                    <button class="btn-primary" onclick="window.open('https://yandex.ru/maps/?rtext=${userLocation.lat},${userLocation.lng}~${officeLocation.lat},${officeLocation.lng}&rtt=auto', '_blank')">
                        <i class="fas fa-external-link-alt"></i>
                        Открыть в Яндекс.Картах
                    </button>
                </div>
            </div>
        `;
        
        // Стили для модального окна маршрута
        const style = document.createElement('style');
        style.textContent = `
            .route-modal {
                max-width: 90%;
                max-height: 90vh;
                padding: 20px;
                display: flex;
                flex-direction: column;
            }
            
            .route-modal h3 {
                color: var(--primary-dark);
                margin-bottom: 20px;
                text-align: center;
            }
            
            .route-map {
                flex: 1;
                min-height: 400px;
                border-radius: var(--radius);
                overflow: hidden;
                margin-bottom: 20px;
            }
            
            .route-info {
                text-align: center;
                padding: 20px;
            }
            
            .route-info p {
                color: var(--gray-text);
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .route-info i {
                color: var(--accent-teal);
            }
            
            .route-info .btn-primary {
                width: 100%;
                justify-content: center;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Закрытие модального окна
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
    }
    
    // Метод для скачивания схемы проезда
    downloadRouteMap() {
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = 'https://static-maps.yandex.ru/1.x/?ll=82.892402,55.095863&z=16&l=map&pt=82.892402,55.095863,pm2rdm';
        link.download = 'schema-proezda-sibmoduling.png';
        link.click();
    }
}

// Инициализация глобального экземпляра
window.mapManager = new MapManager();

// Экспорт функций для использования в HTML
window.showRoute = () => {
    if (window.mapManager) {
        window.mapManager.getUserLocation();
    }
};

window.downloadRoute = () => {
    if (window.mapManager) {
        window.mapManager.downloadRouteMap();
    }
};

// Добавляем обработчик ошибок для iframe
document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.addEventListener('load', function(e) {
            if (e.target.tagName === 'IFRAME') {
                console.log('Карта успешно загружена');
            }
        }, true);
        
        mapContainer.addEventListener('error', function(e) {
            if (e.target.tagName === 'IFRAME') {
                console.error('Ошибка загрузки карты');
                // Пробуем загрузить резервную карту
                setTimeout(() => {
                    if (window.mapManager && !window.mapManager.isLoaded) {
                        window.mapManager.loadGoogleMapsFallback();
                    }
                }, 2000);
            }
        }, true);
    }
});