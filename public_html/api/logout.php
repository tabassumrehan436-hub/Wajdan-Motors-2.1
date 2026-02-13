<?php
require_once __DIR__ . '/../config.php';

// logout.php - destroy admin session
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Unset and destroy session
$_SESSION = [];
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'], $params['secure'], $params['httponly']
    );
}
session_destroy();

respond(['success' => true, 'message' => 'Logged out']);
