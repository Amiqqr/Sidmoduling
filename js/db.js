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
      "price": "250 000₽",
      "oldPrice": null,
      "images": [
        "images/products/1.png",
        "images/products/1.png",
        "images/products/1.png"
      ],
      "features": [
        "Площадь: 14,4 м²",
        "Длина: 6 м",
        "Ширина: 2,4 м",
        "Высота: 2,65 м",
        "Утепление: 100 мм минеральной ваты",
        "Каркас: швеллер 120.60.3 мм",
        "Уголок: 75.75.5 мм",
        "Наружная отделка: профлист 0.4 мм",
        "Внутренняя отделка: ОСБ-3 (стены/потолок 9 мм, пол 12 мм)",
        "Окна: пластиковые двухкамерные (90x90 см)",
        "Дверь: металлическая, два замка",
        "Пол: ламинат 32 класса",
        "Электрика: готовая разводка",
        "Розетки: двойная + рубильник С40",
        "Освещение: светодиодный светильник",
        "Защита: ветро+влагозащита, пароизоляция",
        "Подшив пола: металл"
      ],
      "badge": "Хит продаж",
      "sale": "-10%",
      "description": "Стандартная бытовка для строительных нужд. Идеальное решение для временного проживания рабочих на объекте. Комплектация усилена: двухкамерные окна, два замка на входной двери, влагозащита и подшив пола металлом.",
      "specifications": {
        "area": "14.4 м²",
        "length": "6 м",
        "width": "2.4 м",
        "height": "2.65 м",
        "insulation": "100 мм",
        "weight": "1900 кг",
        "warranty": "12 месяцев",
        "delivery": "3-5 дней",
        "assembly": "1 день"
      }
    },
    {
      "id": 2,
      "category": "offices",
      "title": "Модульный Дом",
      "price": "500 000₽",
      "oldPrice": null,
      "images": [
        "images/products/2.png",
        "images/products/2.png",
        "images/products/2.png"
      ],
      "features": [
        "Площадь: 14,4 м²",
        "Длина: 6 м",
        "Ширина: 2,4 м",
        "Высота: 2,65 м",
        "Утепление пола: 150 мм минеральной ваты",
        "Утепление стен/потолка: 100 мм минеральной ваты",
        "Каркас: швеллер 120.60.3 мм",
        "Уголок: 75.75.5 мм",
        "Наружная отделка: профлист 0.45 мм (чёрный) + планкен",
        "Внутренняя отделка: вагонка (стены + потолок)",
        "Окна: пластиковые двухкамерные, графит (120x120 см + 50x70 см)",
        "Дверь: металлическая утепленная, два замка",
        "Пол: линолеум",
        "Санузел: подготовлено под с/у + межкомнатная дверь",
        "Электрика: готовая разводка",
        "Розетки: двойные — 4 шт",
        "Освещение: светодиодные светильники — 3 шт",
        "Защита: ветро+влагозащита, пароизоляция",
        "Подшив пола: металл"
      ],
      "badge": "Новинка",
      "sale": null,
      "description": "Современный модульный дом для круглогодичного проживания. Усиленное утепление пола (150 мм), премиальная отделка: чёрный профлист + планкен снаружи, вагонка внутри. Два пластиковых окна в цвет графит, подготовка под санузел и межкомнатная дверь в комплекте.",
      "specifications": {
        "area": "14.4 м²",
        "length": "6 м",
        "width": "2.4 м",
        "height": "2.65 м",
        "floor_insulation": "150 мм",
        "wall_insulation": "100 мм",
        "weight": "2100 кг",
        "warranty": "12 месяцев",
        "delivery": "3-5 дней",
        "assembly": "1-2 дня"
      }
    },
    {
      "id": 3,
      "category": "storage",
      "title": "ХОЗ БЛОК",
      "price": "140 000₽",
      "oldPrice": null,
      "images": [
        "images/products/3.png",
        "images/products/3.png",
        "images/products/3.png"
      ],
      "features": [
        "Площадь: 5,76 м²",
        "Длина: 2,4 м",
        "Ширина: 2,4 м",
        "Высота: 2,65 м",
        "Каркас: швеллер 120.60.3 мм",
        "Уголок: 75.75.5 мм",
        "Наружная отделка: профлист 0.4 мм",
        "Внутренняя отделка: ОСБ-3 (стены/потолок 9 мм, пол 12 мм)",
        "Дверь: металлическая с замком",
        "Подшив пола: металл",
        "Без утепления",
        "Без окон",
        "Без электрики"
      ],
      "badge": "Эконом",
      "sale": null,
      "description": "Компактный и недорогой хозблок для дачи или стройплощадки. Подходит для хранения инструмента, инвентаря или стройматериалов. Каркас на швеллере, обшивка профлистом, внутри ОСБ. Пол с подшивом металлом.",
      "specifications": {
        "area": "5.76 м²",
        "length": "2.4 м",
        "width": "2.4 м",
        "height": "2.65 м",
        "insulation": "нет",
        "weight": "950 кг",
        "warranty": "12 месяцев",
        "delivery": "2-4 дня",
        "assembly": "4 часа"
      }
    },
    {
      "id": 4,
      "category": "houses",
      "title": "Торговый Павильон",
      "price": "550 000₽",
      "oldPrice": "",
      "images": [
        "images/products/4.png",
        "images/products/4.png",
        "images/products/4.png"
      ],
      "features": [
        "Площадь: 14,4 м²",
        "Длина: 6 м",
        "Ширина: 2,4 м",
        "Высота: 2,65 м",
        "Утепление: 100 мм (круглогодичное)",
        "Каркас: швеллер 120.50.3 мм",
        "Уголок: 75.75.5 мм",
        "Профтруба: 50.50.3 мм (усиленный каркас)",
        "Наружная отделка: планкен",
        "Внутренняя отделка: ОСБ",
        "Окна: 2 шт",
        "Двери: стеклянные — 2 шт",
        "Пол: линолеум",
        "Подшив пола: металл",
        "Электрика: освещение, розетки, щиток, уличное освещение",
        "Защита: ветро+влагозащита, пароизоляция"
      ],
      "badge": "Хит продаж",
      "sale": "-18%",
      "description": "Готовый торговый павильон для магазина, кофейни или выставочного стенда. Усиленный металлокаркас из профтрубы, круглогодичное утепление 100 мм. Две стеклянные витринные двери, два окна, полный комплект электрики с уличным освещением. Цена указана без НДС.",
      "specifications": {
        "area": "14.4 м²",
        "length": "6 м",
        "width": "2.4 м",
        "height": "2.65 м",
        "insulation": "100 мм",
        "frame": "швеллер 120.50.3 + профтруба 50.50.3",
        "weight": "2300 кг",
        "warranty": "12 месяцев",
        "delivery": "5-7 дней",
        "assembly": "2 дня",
        "nds_price": "671 000₽"
      }
    },
    {
      "id": 5,
      "category": "offices",
      "title": "Бытовка BLACK",
      "price": "350 000₽",
      "oldPrice": "",
      "images": [
        "images/products/5.png",
        "images/products/5.png",
        "images/products/5.png"
      ],
      "features": [
        "Площадь: 14,4 м²",
        "Длина: 6 м",
        "Ширина: 2,4 м",
        "Высота: 2,65 м",
        "Утепление: 100 мм минеральной ваты",
        "Каркас: швеллер 120.60.3 мм",
        "Уголок: 75.75.5 мм",
        "Наружная отделка: профлист 0.45 мм (чёрный)",
        "Внутренняя отделка: ОСБ-3 (стены/потолок 9 мм, пол 12 мм)",
        "Окна: пластиковые двухкамерные, графит — 2 шт (120x80 см)",
        "Дверь: металлическая утепленная, два замка",
        "Пол: линолеум",
        "Подшив пола: металл",
        "Электрика: готовая разводка",
        "Розетки: двойная + рубильник С40",
        "Освещение: светодиодный светильник — 1 шт",
        "Защита: ветро+влагозащита, пароизоляция"
      ],
      "badge": "Стиль",
      "sale": "-18%",
      "description": "Бытовка BLACK в премиальном чёрном исполнении. Строгий дизайн с профлистом 0.45 мм чёрного цвета и окнами в цвет графит. Два двухкамерных окна (120x80 см), два замка на входной двери, линолеум и полный комплект защиты. Идеальное решение для тех, кто ценит стиль и комфорт на объекте.",
      "specifications": {
        "area": "14.4 м²",
        "length": "6 м",
        "width": "2.4 м",
        "height": "2.65 м",
        "insulation": "100 мм",
        "weight": "1950 кг",
        "warranty": "12 месяцев",
        "delivery": "3-5 дней",
        "assembly": "1 день",
        "nds_price": "427 000₽"
      }
    },
    {
      "id": 6,
      "category": "storage",
      "title": "Модульный Дом",
      "price": "550 000₽",
      "oldPrice": "",
      "images": [
        "images/products/6.png",
        "images/products/6.png",
        "images/products/6.png"
      ],
      "features": [
        "Площадь: 16,8 м²",
        "Длина: 7 м",
        "Ширина: 2,4 м",
        "Высота: 2,7 м",
        "Утепление пола: 150 мм минеральной ваты",
        "Утепление стен/потолка: 100 мм минеральной ваты",
        "Каркас: швеллер 120.50.3 мм",
        "Уголок: 75.75.5 мм",
        "Профтруба: 50.50.3 мм (усиленный каркас)",
        "Наружная отделка: планкен + профлист",
        "Внутренняя отделка: вагонка",
        "Окна: 2 шт",
        "Дверь: металлическая утепленная",
        "Пол: линолеум",
        "Подшив пола: металл",
        "Санузел: подготовка под с/у + межкомнатная дверь",
        "Кухня: ниша под кухню и холодильник",
        "Спальное место: двухъярусная кровать — 2 шт",
        "Электрика: базовая разводка",
        "Защита: ветро+влагозащита, пароизоляция"
      ],
      "badge": "Новинка",
      "sale": "-18%",
      "description": "Просторный модульный дом длиной 7 метров для круглогодичного проживания. Усиленный металлокаркас, комбинированная отделка фасада (планкен + профлист), внутри натуральная вагонка. Продуманная планировка: две двухъярусные кровати, ниша под кухню и холодильник, подготовка под санузел. Идеальное решение для семейного общежития или гостевого дома.",
      "specifications": {
        "area": "16.8 м²",
        "length": "7 м",
        "width": "2.4 м",
        "height": "2.7 м",
        "floor_insulation": "150 мм",
        "wall_insulation": "100 мм",
        "frame": "швеллер 120.50.3 + профтруба 50.50.3",
        "weight": "2600 кг",
        "warranty": "12 месяцев",
        "delivery": "5-7 дней",
        "assembly": "2 дня",
        "nds_price": "732 000₽"
      }
    },
    {
      "id": 7,
      "category": "houses",
      "title": "Бытовка в стиле Домик",
      "price": "350 000₽",
      "oldPrice": "",
      "images": [
        "images/products/7.png",
        "images/products/7.png",
        "images/products/7.png"
      ],
      "features": [
        "Площадь: 14,4 м²",
        "Длина: 6 м",
        "Ширина: 2,4 м",
        "Высота: 2,65 м",
        "Утепление: 100 мм (круглогодичное)",
        "Каркас: швеллер 120.60.3 мм",
        "Уголок: 75.75.5 мм",
        "Наружная отделка: планкен + профлист графит",
        "Внутренняя отделка: ОСБ-3 (стены/потолок 9 мм, пол 12 мм)",
        "Окна: пластиковые двухкамерные — 120x120 см",
        "Дверь: металлическая утепленная, два замка",
        "Подшив пола: металл",
        "Электрика: готовая разводка",
        "Розетки: двойная + рубильник С40",
        "Освещение: светодиодные светильники — 2 шт",
        "Защита: ветро+влагозащита, пароизоляция"
      ],
      "badge": "Дачный",
      "sale": "-18%",
      "description": "Бытовка в стиле Домик — эстетичное решение для дачи или загородного участка. Комбинированная наружная отделка: планкен и профлист графит придают дому уютный вид. Квадратное окно 120x120 см наполняет помещение светом. Полный комплект утепления, два светильника, два замка на входной двери.",
      "specifications": {
        "area": "14.4 м²",
        "length": "6 м",
        "width": "2.4 м",
        "height": "2.65 м",
        "insulation": "100 мм",
        "weight": "1920 кг",
        "warranty": "12 месяцев",
        "delivery": "3-5 дней",
        "assembly": "1 день",
        "nds_price": "414 800₽"
      }
    },
    {
      "id": 8,
      "category": "promo",
      "title": "Модульный Дом с Террасой",
      "price": "750 000₽",
      "oldPrice": "",
      "images": [
        "images/products/8.png",
        "images/products/8.1.png"
      ],
      "videos": [
        "images/video/8.mp4"
        ],        
      "features": [
        "Площадь дома: 16,8 м²",
        "Площадь террасы: 16,8 м²",
        "Общая площадь: 33,6 м²",
        "Длина: 7 м",
        "Ширина: 2,4 м",
        "Высота: 2,7 м",
        "Терраса: 7 × 2,4 м, под общей крышей",
        "Утепление пола: 150 мм минеральной ваты",
        "Утепление стен/потолка: 100 мм минеральной ваты",
        "Каркас: швеллер 120.50.3 мм",
        "Уголок: 75.75.5 мм",
        "Профтруба: 50.50.3 мм (усиленный каркас)",
        "Наружная отделка: планкен + профлист",
        "Внутренняя отделка: вагонка",
        "Окна: 2 шт",
        "Дверь: металлическая утепленная — 1 шт",
        "Пол: линолеум",
        "Подшив пола: металл",
        "Санузел: подготовка под с/у",
        "Защита: ветро+влагозащита, пароизоляция"
      ],
      "badge": "С террасой",
      "sale": "-18%",
      "description": "Просторный модульный дом 7 метров с полноценной террасой под единой крышей. Общая площадь 33,6 м² — дом 16,8 м² + терраса 16,8 м². Усиленный металлокаркас, комбинированная отделка планкен + профлист, внутри натуральная вагонка. Подготовка под санузел. Идеальное решение для загородного проживания и отдыха на свежем воздухе.",
      "specifications": {
        "area": "16.8 м²",
        "terrace_area": "16.8 м²",
        "total_area": "33.6 м²",
        "length": "7 м",
        "width": "2.4 м",
        "height": "2.7 м",
        "floor_insulation": "150 мм",
        "wall_insulation": "100 мм",
        "frame": "швеллер 120.50.3 + профтруба 50.50.3",
        "weight": "3200 кг",
        "warranty": "12 месяцев",
        "delivery": "5-7 дней",
        "assembly": "2-3 дня",
        "nds_price": "915 000₽"
      }
    },
    {
      "id": 9,
      "category": "offices",
      "title": "Каркасный ДомБарн House",
      "price": "От 5 000 000 ₽",
      "oldPrice": null,
      "images": [ 
        "images/products/9.png",
        "images/products/10.png",
        "images/products/11.png"
      ],
      "features": [
        "Площадь: 100 м²",
        "Кабинет руководителя",
        "Переговорная",
        "Санузел",
        "Кондиционер"
      ],
      "badge": "Лучшая цена",
      "sale": null,
      "description": "Элитный офисный модуль для руководителя. Всё для продуктивной работы.",
      "specifications": {
        "area": "100",
        "rooms": "3",
        "bathroom": "Совмещенный",
        "ac": "Инверторный",
        "furniture": "Премиум"
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
                address: "г. Новосибирск, Мочищенское шоссе, 1/4",
                phone: "+7 (923) 226-11-02",
                email: "sibmoduling@gmail.com",
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
                site_name: "ООО СибМодулинг",
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
✅ <b>Согласие на обработку:</b> ${orderData.consent || 'Нет'}

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