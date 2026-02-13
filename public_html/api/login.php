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

// Simple rate limiting (per-session): 5 attempts per 15 minutes
$attempts = $_SESSION['login_attempts'] ?? 0;
$lockUntil = $_SESSION['login_lock_until'] ?? 0;
if ($lockUntil && time() < $lockUntil) {
    respond(['success' => false, 'message' => 'Too many attempts. Try later.'], 429);
}

try {
    $stmt = $pdo->prepare('SELECT id, password FROM admin_users WHERE username = :username LIMIT 1');
    $stmt->execute([':username' => $username]);
    $row = $stmt->fetch();

    if (!$row || !password_verify($password, $row['password'])) {
        // increment attempts
        $_SESSION['login_attempts'] = $attempts + 1;
        if ($_SESSION['login_attempts'] >= 5) {
            // lock for 15 minutes
            $_SESSION['login_lock_until'] = time() + (15 * 60);
        }
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

    // Set CSRF token for subsequent requests
    $csrf = bin2hex(random_bytes(24));
    $_SESSION['csrf_token'] = $csrf;

    // Reset login attempts
    unset($_SESSION['login_attempts'], $_SESSION['login_lock_until']);

    respond(['success' => true, 'message' => 'Login successful', 'csrf_token' => $csrf]);
} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    respond(['success' => false, 'message' => 'Internal Server Error'], 500);
}
