<?php
require_once __DIR__ . '/../config.php';

// login.php - admin login (session-based)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'message' => 'Method not allowed'], 405);
}

$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
if ($username === '' || $password === '') {
    respond(['success' => false, 'message' => 'Missing credentials'], 422);
}

try {
    $stmt = $pdo->prepare('SELECT id, password FROM admin_users WHERE username = :username LIMIT 1');
    $stmt->execute([':username' => $username]);
    $row = $stmt->fetch();
    if (!$row || !password_verify($password, $row['password'])) {
        respond(['success' => false, 'message' => 'Invalid username or password'], 401);
    }

    // Secure session handling
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

    // Regenerate session id after successful login
    session_regenerate_id(true);
    $_SESSION['admin_id'] = (int)$row['id'];

    respond(['success' => true, 'message' => 'Login successful']);
} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    respond(['success' => false, 'message' => 'Internal Server Error'], 500);
}
