<?php
require_once __DIR__ . '/../config.php';

// admin-logout.php - destroy admin session
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(['success' => false, 'message' => 'Method not allowed']);
}

if (session_status() !== PHP_SESSION_ACTIVE) session_start();

// clear session
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'], $params['secure'], $params['httponly']
    );
}
session_destroy();

respond(['success' => true, 'message' => 'Logged out']);
