<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Получаем данные
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Нет данных']);
    exit;
}

// Настройки
$to = 'sibmoduling@gmail.com'; // Замените на ваш email
$siteName = $data['data']['siteName'] ?? 'АЙ ДА МОДУЛЬ';
$orderData = $data['data'];

// Тема письма
$subject = "=?UTF-8?B?" . base64_encode("Новая заявка с сайта {$siteName}") . "?=";

// HTML шаблон письма
$message = "
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 15px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #2c3e50; }
        .value { margin-top: 5px; color: #555; }
        .footer { text-align: center; padding: 15px; font-size: 12px; color: #888; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🟢 НОВАЯ ЗАЯВКА</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>👤 Имя:</div>
                <div class='value'>{$orderData['name']}</div>
            </div>
            <div class='field'>
                <div class='label'>📞 Телефон:</div>
                <div class='value'><a href='tel:{$orderData['phone']}'>{$orderData['phone']}</a></div>
            </div>
            <div class='field'>
                <div class='label'>📧 Email:</div>
                <div class='value'><a href='mailto:{$orderData['email']}'>{$orderData['email']}</a></div>
            </div>
            <div class='field'>
                <div class='label'>🏠 Интересует:</div>
                <div class='value'>{$orderData['product']}</div>
            </div>
            <div class='field'>
                <div class='label'>📝 Комментарий:</div>
                <div class='value'>{$orderData['message']}</div>
            </div>
            <div class='field'>
                <div class='label'>✅ Согласие на обработку:</div>
                <div class='value'>{$orderData['consent']}</div>
            </div>
            <div class='field'>
                <div class='label'>⏰ Время заявки:</div>
                <div class='value'>{$orderData['date']}</div>
            </div>
            <div class='field'>
                <div class='label'>🌐 Источник:</div>
                <div class'value'>{$orderData['source']}</div>
            </div>
        </div>
        <div class='footer'>
            <p>Письмо сгенерировано автоматически. Пожалуйста, не отвечайте на него.</p>
        </div>
    </div>
</body>
</html>
";

// Заголовки для HTML письма
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=utf-8',
    'From: =?UTF-8?B?' . base64_encode($siteName) . "?= <noreply@{$_SERVER['HTTP_HOST']}>",
    'Reply-To: ' . ($orderData['email'] ?? $to),
    'X-Mailer: PHP/' . phpversion()
];

// Отправка письма
$result = mail($to, $subject, $message, implode("\r\n", $headers));

echo json_encode(['success' => $result]);
?>