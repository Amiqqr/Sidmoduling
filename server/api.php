<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Путь к файлу базы данных
define('DB_FILE', __DIR__ . '/db.json');

// Функция для чтения базы данных
function readDatabase() {
    if (!file_exists(DB_FILE)) {
        return ['products' => [], 'orders' => [], 'contacts' => [], 'settings' => []];
    }
    $json = file_get_contents(DB_FILE);
    return json_decode($json, true);
}

// Функция для записи в базу данных
function writeDatabase($data) {
    file_put_contents(DB_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    return true;
}

// Функция для отправки в Telegram
function sendToTelegram($data, $settings) {
    $botToken = $settings['telegram_bot_token'] ?? '';
    $chatId = $settings['telegram_chat_id'] ?? '';
    
    if (empty($botToken) || empty($chatId)) {
        return false;
    }
    
    $telegramMessage = "
🟢 <b>НОВАЯ ЗАЯВКА С САЙТА {$settings['site_name']}</b> 🟢

👤 <b>Клиент:</b> {$data['name']}
📞 <b>Телефон:</b> <code>{$data['phone']}</code>
📧 <b>Email:</b> {$data['email']}
🏠 <b>Интересует:</b> {$data['product']}
📝 <b>Комментарий:</b> {$data['message']}
✅ <b>Согласие на обработку:</b> {$data['consent']}

⏰ <b>Время заявки:</b> {$data['date']}
🌐 <b>Источник:</b> {$data['source']}
    ";
    
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $postData = [
        'chat_id' => $chatId,
        'text' => $telegramMessage,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    curl_close($ch);
    
    return $result !== false;
}

// Получение метода запроса
$method = $_SERVER['REQUEST_METHOD'];

// Обработка OPTIONS запроса (для CORS)
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Получение данных из тела запроса
$input = json_decode(file_get_contents('php://input'), true);

// Обработка различных методов
switch ($method) {
    case 'GET':
        // Получение списка продуктов
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'products':
                    $db = readDatabase();
                    $category = $_GET['category'] ?? 'all';
                    
                    if ($category === 'all') {
                        echo json_encode($db['products']);
                    } else {
                        $filtered = array_filter($db['products'], function($product) use ($category) {
                            return $product['category'] === $category;
                        });
                        echo json_encode(array_values($filtered));
                    }
                    break;
                    
                case 'product':
                    $db = readDatabase();
                    $id = $_GET['id'] ?? 0;
                    $product = array_filter($db['products'], function($p) use ($id) {
                        return $p['id'] == $id;
                    });
                    echo json_encode(array_values($product)[0] ?? null);
                    break;
                    
                case 'contacts':
                    $db = readDatabase();
                    echo json_encode($db['contacts']);
                    break;
                    
                case 'settings':
                    $db = readDatabase();
                    echo json_encode($db['settings']);
                    break;
                    
                default:
                    echo json_encode(['error' => 'Unknown action']);
            }
        } else {
            echo json_encode(['message' => 'SibModuling API is working']);
        }
        break;
        
    case 'POST':
        // Создание новой заявки
        if (isset($input['action']) && $input['action'] === 'create_order') {
            $db = readDatabase();
            
            $order = [
                'id' => count($db['orders']) + 1,
                'name' => $input['name'] ?? '',
                'phone' => $input['phone'] ?? '',
                'email' => $input['email'] ?? '',
                'product' => $input['product'] ?? '',
                'message' => $input['message'] ?? '',
                'consent' => $input['consent'] ?? 'Нет',
                'date' => date('Y-m-d H:i:s'),
                'status' => 'new',
                'source' => $input['source'] ?? 'website'
            ];
            
            $db['orders'][] = $order;
            writeDatabase($db);
            
            // Отправка в Telegram
            $telegramResult = sendToTelegram($order, $db['settings']);
            
            echo json_encode([
                'success' => true,
                'order_id' => $order['id'],
                'telegram_sent' => $telegramResult !== false
            ]);
        } else {
            echo json_encode(['error' => 'Invalid action']);
        }
        break;
        
    default:
                http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>