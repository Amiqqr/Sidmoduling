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

// Локальные данные продуктов на случай недоступности API
const FALLBACK_PRODUCTS = [
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
        "warranty": "12 месяцев"
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
        "warranty": "12 месяцев"
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
        "warranty": "12 месяцев"
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
        "warranty": "12 месяцев"
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
        "images/products/5.1.png",
        "images/products/5.2.png"
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
        "warranty": "12 месяцев"
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
      "videos": [
        "images/video/6.mp4"
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
        "warranty": "12 месяцев"
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
        "warranty": "12 месяцев"
      }
    },
    {
    "id": 8,
    "category": "promo",
    "title": "Домик с Терассой",
    "price": "800 000₽",
    "oldPrice": "",
    "images": [
        "images/products/8.png",
        "images/products/8.1.png"
    ],
    "videos": [
        "images/video/8.mp4"
    ],
    "features": [
        "Площадь дома: 18 м²",
        "Площадь террасы: 18 м²",
        "Общая площадь: 36 м²",
        "Длина: 6 м",
        "Ширина: 3 м",
        "Высота: 2,85 м",
        "Терраса: 6 × 3 м, под общей крышей",
        "Утепление пола и потолка: 150 мм (Тисма)",
        "Утепление стен: 100 мм (Тисма)",
        "Каркас: металл (швеллер 120.50.3, уголок 75.75.5, доска 100х40, 150х50)",
        "Профтруба террасы: 50.50.3 мм",
        "Наружная отделка: имитация бруса + профлист С8 (0.4 мм) / МП20 (0.45) графит",
        "Внутренняя отделка: вагонка",
        "Окна: 2 шт (120х80 графит, 120х120 графит)",
        "Дверь: металлическая с двумя замками — 1 шт",
        "Пол: линолеум полукоммерческий",
        "Подшив пола: металл",
        "Защита: ветро+влагозащита, пароизоляция",
        "Электрика: 2 светильника, 2 двойные розетки, щиток"
    ],
    "badge": "С террасой",
    "sale": "",
    "description": "Функциональный модульный дом с просторной террасой под единой крышей. Общая площадь 36 м²: дом 18 м² + терраса 18 м². Комбинированный каркас из металла (швеллер 120.50.3, уголок 75.75.5) и дерева (доска 100х40, 150х50) обеспечивает надежность и долговечность. Внешняя отделка сочетает имитацию бруса и профлист в цвете графит, внутренняя — натуральную вагонку. Теплый контур (утеплитель Тисма 150 мм в полу/потолке, 100 мм в стенах) и подготовка электрики делают этот вариант готовым к комфортному использованию.",
    "specifications": {
        "area": "18 м²",
        "terrace_area": "18 м²",
        "total_area": "36 м²",
        "length": "6 м",
        "width": "3 м",
        "height": "2.85 м",
        "floor_insulation": "150 мм (Тисма)",
        "wall_insulation": "100 мм (Тисма)",
        "frame": "швеллер 120.50.3 + уголок 75.75.5 + доска 100х40/150х50",
        "warranty": "12 месяцев"
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
        "images/products/9.1.png",
        "images/products/9.2.png"
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
        "furniture": "Премиум",
        "warranty": "12 месяцев"
      }
    },
        {
      "id": 10,
      "category": "storage",
      "title": "Офисная Бытовка",
      "price": "550 000₽",
      "oldPrice": "",
      "images": [
        "images/products/10.png",
        "images/products/10.1.png",
        "images/products/10.2.png",
        "images/products/10.3.png"
      ],        
      "features": [
        "Площадь: 14,4 м²",
        "Длина: 6 м",
        "Ширина: 2,4 м",
        "Высота: 2,65 м",
        "Утепление пола: 150 мм минеральной ваты",
        "Утепление стен/потолка: 100 мм минеральной ваты",
        "Каркас: швеллер 120.50.3 мм",
        "Уголок: 75.75.5 мм",
        "Профтруба: 50.50.3 мм (усиленный каркас)",
        "Наружная отделка: Профлист",
        "Внутренняя отделка: МДФ панели",
        "Окна: 1 шт",
        "Дверь: металлическая",
        "Пол: линолеум",
        "Подшив пола: металл",
        "Электрика: 2шт светильники 2шт разетки",
        "Защита: ветро+влагозащита, пароизоляция"
      ],
      "badge": "Новинка",
      "sale": "-18%",
      "description": "Просторное и теплое помещение площадью 14,4 м² (6х2,4 м) с высотой потолков 2,65 м. Главное преимущество — комбинированный каркас из швеллера 120 мм и профтрубы 50.50.3 мм, обеспечивающий исключительную прочность. Для круглогодичного использования: утепление пола 150 мм минватой, стен/потолка — 100 мм. Внутренняя отделка — МДФ и линолеум, наружная — профлист. Установлена электрика (светильники и розетки).",
        "specifications": { 
        "area": "14.4 м²",
        "length": "6 м",
        "width": "2.4 м",
        "height": "2.65 м",
        "floor_insulation": "150 мм",
        "wall_insulation": "100 мм",
        "frame": "швеллер 120.50.3  профтруба 50.50.3",
        "warranty": "12 месяцев"
    }
    }
];

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
            const productsFromFallback = category === 'all'
                ? FALLBACK_PRODUCTS
                : FALLBACK_PRODUCTS.filter(p => p.category === category);

            this.products = productsFromFallback;
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