<?php
// auth.php - session middleware for admin endpoints
// Include after config.php has been required (or require config.php if needed).

// Secure session cookie settings (call before session_start)
if (session_status() !== PHP_SESSION_ACTIVE) {
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

// Check authentication
if (empty($_SESSION['admin_id'])) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// CSRF protection for state-changing requests (POST/PUT/DELETE)
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'OPTIONS') {
    $csrfHeader = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    $csrfPost = $_POST['csrf_token'] ?? null;
    $token = $_SESSION['csrf_token'] ?? null;
    if (!$token || (!hash_equals($token, (string)$csrfHeader) && !hash_equals($token, (string)$csrfPost))) {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
        exit;
    }
}

// Optional: verify admin user still exists (defensive)
try {
    $stmt = $pdo->prepare('SELECT id FROM admin_users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $_SESSION['admin_id']]);
    $exists = $stmt->fetchColumn();
    if (!$exists) {
        // invalid session
        session_unset();
        session_destroy();
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }
} catch (Exception $e) {
    // on DB error, deny access
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => 'Internal Server Error']);
    exit;
}
