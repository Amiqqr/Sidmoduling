// Конфигурация API
const API_CONFIG = {
    baseUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost/sibmoduling/server/api.php' 
        : '/server/api.php',
    
    endpoints: {
        products: '?action=products',
        product: '?action=product&id=',
        contacts: '?action=contacts',
        settings: '?action=settings',
        createOrder: ''
    }
};

// Класс для работы с API
class DatabaseAPI {
    constructor() {
        this.products = [];
        this.contacts = {};
        this.settings = {};
    }
    
    // Инициализация базы данных
    async init() {
        try {
            await Promise.all([
                this.loadProducts(),
                this.loadContacts(),
                this.loadSettings()
            ]);
            return true;
        } catch (error) {
            console.error('Ошибка инициализации базы данных:', error);
            return false;
        }
    }
    
    // Загрузка продуктов
    async loadProducts(category = 'all') {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}&category=${category}`);
        if (!response.ok) throw new Error('Ошибка загрузки продуктов');
        
        this.products = await response.json();
        console.log('Загружено продуктов:', this.products.length);
        return this.products;
    } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);

            
            // Fallback: использование локальных данных
            const fallbackProducts = [
                

                {
                "id": 1,
                "category": "houses",
                "title": "Бытовка СТАНДАРТ",
                "price": "280 600₽",
                "oldPrice": null,
                "images": [
                 "images/products/1.png",
                "images/products/1.png",
                "images/products/1.png"
                ],
                "features": [
                    "Площадь: 14,4 м²",
                    "Длина 6 м",
                    "Ширина 2,4",
                    "Высота 2,65 м",
                    "Утепление 100 мм",
                    "Швеллер 120.60.3 мм",
                    "Уголок 75.75.5 мм",
                    "Профлис 0.4 мм"
                ],
                "badge": "Хит продаж",
                "sale": "-10%",
                "description": "Стандартная бытовка для строительных нужд. Идеальное решение для временного проживания рабочих.",
                "specifications": {
                    "area": "14.4",
                    "length": "6",
                    "width": "2.4",
                    "height": "2.65",
                    "insulation": "100",
                    "weight": "1500",
                    "warranty": "12 месяцев"
                }
                },
                {
                "id": 2,
                "category": "offices",
                "title": "Модульный Дом",
                "price": "597 800 ₽",
                "oldPrice": null,
                "image": "images/products/2.png",
                "features": [
                    "Площадь: 14,4 м²",
                    "Длина 6 м",
                    "Ширина 2,4",
                    "Высота 2,65 м",
                    "Утепление пола 150 мм",
                    "Швеллер 120.60.3 мм",
                    "Уголок 75.75.5 мм",
                    "Профлис 0.4 мм",
                    "Пластиковые окна"
                ],
                "badge": "В наличии",
                "sale": null,
                "description": "Комфортный модульный дом для круглогодичного проживания. Отличное решение для дачи или загородного дома.",
                "specifications": {
                    "area": "14.4",
                    "rooms": "1",
                    "insulation": "150",
                    "windows": "Пластиковые",
                    "heating": "Электрическое",
                    "warranty": "24 месяца"
                }
                },
                {
                "id": 3,
                "category": "storage",
                "title": "Хоз/Блок",
                "price": "158 600 ₽",
                "oldPrice": null,
                "image": "images/products/3.png",
                "features": [
                    "Площадь: 5,7 м²",
                    "Длина 2,4 м",
                    "Ширина 2,4",
                    "Высота 2,65 м",
                    "Швеллер 120.60.3 мм",
                    "Уголок 75.75.5 мм",
                    "Профлис 0.4 мм"
                ],
                "badge": "Скидка",
                "sale": "-15%",
                "description": "Компактный хозяйственный блок для хранения инструментов и оборудования.",
                "specifications": {
                    "area": "5.7",
                    "doors": "1",
                    "shelves": "2",
                    "weight": "800",
                    "warranty": "6 месяцев"
                }
                },
                {
                "id": 4,
                "category": "houses",
                "title": "Торговый Павильон",
                "price": "671 000 ₽",
                "oldPrice": null,
                "image": "images/products/4.png",
                "features": [
                    "Площадь: 14,4 м²",
                    "Длина 6 м",
                    "Ширина 2,4",
                    "Высота 2,65 м",
                    "Утепление 100 мм",
                    "Швеллер 120.60.3 мм",
                    "Уголок 75.75.5 мм",
                    "Профлис 0.4 мм"
                ],
                "badge": "Новинка",
                "sale": null,
                "description": "Готовое решение для торговли. Большие витринные окна, удобная планировка.",
                "specifications": {
                    "area": "14.4",
                    "windows": "Витринные",
                    "counter": "3 метра",
                    "lighting": "LED",
                    "electrics": "Готовые"
                }
                },
                {
                "id": 5,
                "category": "offices",
                "title": "Бытовка BLACK",
                "price": "427 000 ₽",
                "oldPrice": null,
                "image": "images/products/5.png",
                "features": [
                    "Площадь: 28 м²",
                    "4 рабочих места",
                    "Кондиционер",
                    "Освещение LED",
                    "Готов к работе"
                ],
                "badge": "Акция",
                "sale": "-20%",
                "description": "Современный офисный модуль премиум-класса. Всё готово для начала работы.",
                "specifications": {
                    "area": "28",
                    "workplaces": "4",
                    "ac": "Да",
                    "internet": "Готовый",
                    "furniture": "Включена"
                }
                },
                {
                "id": 6,
                "category": "storage",
                "title": "Модульный Дом",
                "price": "732 000 ₽",
                "oldPrice": null,
                "image": "images/products/6.png",
                "features": [
                    "Площадь: 24 м²",
                    "3 комнаты",
                    "Утепление 150мм",
                    "Отопление",
                    "Пластиковые окна"
                ],
                "badge": "В наличии",
                "sale": null,
                "description": "Просторный модульный дом с раздельными комнатами. Идеален для семьи.",
                "specifications": {
                    "area": "24",
                    "rooms": "3",
                    "bathroom": "Отдельный",
                    "kitchen": "Есть",
                    "heating": "Электрическое"
                }
                },
                {
                "id": 7,
                "category": "houses",
                "title": "Модульный Дом в стиле Домик",
                "price": "414 800 ₽",
                "oldPrice": null,
                "image": "images/products/7.png",
                "features": [
                    "Площадь: 85 м²",
                    "4 спальни",
                    "2 санузла",
                    "Камин",
                    "Панорамные окна"
                ],
                "badge": "Премиум",
                "sale": null,
                "description": "Роскошный модульный дом с дизайнерской отделкой. Все удобства для комфортной жизни.",
                "specifications": {
                    "area": "85",
                    "bedrooms": "4",
                    "bathrooms": "2",
                    "fireplace": "Электрический",
                    "terrace": "Да"
                }
                },
                {
                "id": 8,
                "category": "promo",
                "title": "Модульный Дом с Террасой",
                "price": "915 000 ₽",
                "oldPrice": null,
                "image": "images/products/8.png",
                "features": [
                    "Площадь: 12 м²",
                    "1 комната",
                    "Базовое утепление",
                    "Окно",
                    "Дверь металлическая"
                ],
                "badge": "Выгодно",
                "sale": "-18%",
                "description": "Компактный дом с террасой для отдыха. Отличное решение для дачи.",
                "specifications": {
                    "area": "12",
                    "terrace": "6 м²",
                    "insulation": "Базовое",
                    "floor": "Ламинат",
                    "walls": "Панели МДФ"
                }
                },
                {
                "id": 9,
                "category": "offices",
                "title": "Офис руководителя",
                "price": "720 000 ₽",
                "oldPrice": null,
                "image": "images/products/9.png",
                "features": [
                    "Площадь: 25 м²",
                    "Кабинет руководителя",
                    "Переговорная",
                    "Санузел",
                    "Кондиционер"
                ],
                "badge": "Лучшая цена",
                "sale": null,
                "description": "Элитный офисный модуль для руководителя. Всё для продуктивной работы.",
                "specifications": {
                    "area": "25",
                    "rooms": "2",
                    "bathroom": "Совмещенный",
                    "ac": "Инверторный",
                    "furniture": "Премиум"
                }
                },
                {
                "id": 10,
                "category": "houses",
                "title": "Дом \"Мини\" 32 м²",
                "price": "950 000 ₽",
                "oldPrice": null,
                "image": "images/products/10.png",
                "features": [
                    "Площадь: 32 м²",
                    "Спальня + гостиная",
                    "Компактная кухня",
                    "Санузел",
                    "Идеально для дачи"
                ],
                "badge": "Акция",
                "sale": "-10%",
                "description": "Уютный компактный дом для небольшой семьи или пары. Все необходимое для комфорта.",
                "specifications": {
                    "area": "32",
                    "rooms": "2",
                    "kitchen": "Компактная",
                    "bathroom": "Совмещенный",
                    "heating": "Конвекторы"
                }
                },
                {
                "id": 11,
                "category": "storage",
                "title": "Складской модуль 50 м²",
                "price": "550 000 ₽",
                "oldPrice": null,
                "image": "images/products/11.png",
                "features": [
                    "Площадь: 50 м²",
                    "Складское помещение",
                    "Ворота 3м",
                    "Электричество",
                    "Система вентиляции"
                ],
                "badge": "Спеццена",
                "sale": null,
                "description": "Профессиональное складское помещение для бизнеса. Большая площадь и удобный доступ.",
                "specifications": {
                    "area": "50",
                    "gates": "3x3 м",
                    "ventilation": "Принудительная",
                    "lighting": "Промышленное",
                    "racks": "Опционально"
                }
                }
                

            ];
            
            if (category === 'all') {
            this.products = fallbackProducts;
        } else {
            this.products = fallbackProducts.filter(p => p.category === category);
        }
        
        console.log('Используются локальные данные, товаров:', this.products.length);
        return this.products;
    }
}
    
    // Загрузка контактов
    async loadContacts() {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.contacts}`);
            if (!response.ok) throw new Error('Ошибка загрузки контактов');
            
            this.contacts = await response.json();
            return this.contacts;
        } catch (error) {
            console.error('Ошибка загрузки контактов:', error);
            
                        // Fallback контакты
            this.contacts = {
                address: "Новосибирск, ул.",
                phone: "+7 (923) 226-11-02",
                email: "СибМодулинг@gmail.com",
                schedule: {
                    weekdays: "9:00-20:00",
                    weekends: "10:00-18:00"
                }
            };
            
            return this.contacts;
        }
    }
    
    // Загрузка настроек
    async loadSettings() {
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.settings}`);
            if (!response.ok) throw new Error('Ошибка загрузки настроек');
            
            this.settings = await response.json();
            return this.settings;
        } catch (error) {
            console.error('Ошибка загрузки настроек:', error);
            
            // Fallback настройки
            this.settings = {
                telegram_bot_token: "8314444138:AAGVRIjXCaz7gJGoOSK1lGcFRC2TaVmybXc",
                telegram_chat_id: "7614870794",
                site_name: "СибМодулинг",
                currency: "₽"
            };
            
            return this.settings;
        }
    }
    
    // Получение продукта по ID
    async getProductById(id) {
        try {
            // Сначала ищем в загруженных продуктах
            const localProduct = this.products.find(p => p.id == id);
            if (localProduct) return localProduct;
            
            // Если нет, загружаем с сервера
            const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.product}${id}`);
            if (!response.ok) throw new Error('Ошибка загрузки продукта');
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения продукта:', error);
            return null;
        }
    }
    
    // Создание заказа
    async createOrder(orderData) {
        try {
            const response = await fetch(API_CONFIG.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create_order',
                    ...orderData,
                    source: window.location.href,
                    date: new Date().toLocaleString('ru-RU')
                })
            });
            
            if (!response.ok) throw new Error('Ошибка создания заказа');
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Ошибка создания заказа:', error);
            
            // Fallback: отправка напрямую в Telegram
            if (this.settings.telegram_bot_token && this.settings.telegram_chat_id) {
                await this.sendToTelegramDirectly(orderData);
            }
            
            return {
                success: true,
                order_id: Date.now(),
                telegram_sent: true,
                fallback: true
            };
        }
    }
    
    // Прямая отправка в Telegram (fallback)
    async sendToTelegramDirectly(orderData) {
        try {
            const telegramMessage = `
🟢 <b>НОВАЯ ЗАЯВКА С САЙТА ${this.settings.site_name}</b> 🟢

👤 <b>Клиент:</b> ${orderData.name}
📞 <b>Телефон:</b> <code>${orderData.phone}</code>
📧 <b>Email:</b> ${orderData.email || 'не указан'}
🏠 <b>Интересует:</b> ${orderData.product || 'не указано'}
📝 <b>Комментарий:</b> ${orderData.message || 'нет комментария'}

⏰ <b>Время заявки:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> ${window.location.href}
            `.trim();
            
            const response = await fetch(`https://api.telegram.org/bot${this.settings.telegram_bot_token}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.settings.telegram_chat_id,
                    text: telegramMessage,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            });
            
            return response.ok;
        } catch (error) {
            console.error('Ошибка отправки в Telegram:', error);
            return false;
        }
    }
    
    // Поиск продуктов
    searchProducts(query, category = 'all') {
        const searchLower = query.toLowerCase();
        
        return this.products.filter(product => {
            const matchesCategory = category === 'all' || product.category === category;
            const matchesSearch = 
                product.title.toLowerCase().includes(searchLower) ||
                (product.description && product.description.toLowerCase().includes(searchLower)) ||
                product.features.some(feature => feature.toLowerCase().includes(searchLower));
            
            return matchesCategory && matchesSearch;
        });
    }
    
    // Получение категорий
    getCategories() {
        const categories = new Set(this.products.map(p => p.category));
        return Array.from(categories);
    }
    
    // Получение продуктов со скидкой
    getDiscountedProducts() {
        return this.products.filter(p => p.sale || p.badge?.toLowerCase().includes('акция') || p.badge?.toLowerCase().includes('скидка'));
    }
}

// Экспорт глобального экземпляра
window.Database = new DatabaseAPI();