<?php
require_once __DIR__ . '/../config.php';

// admin-session.php - returns current admin session info + csrf token (if logged in)
if (session_status() !== PHP_SESSION_ACTIVE) session_start();

if (empty($_SESSION['admin_id'])) {
    respond(['logged_in' => false]);
}

try {
    $stmt = $pdo->prepare('SELECT id, username FROM admin_users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $_SESSION['admin_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) {
        // invalid session
        $_SESSION = [];
        session_destroy();
        respond(['logged_in' => false]);
    }

    respond([
        'logged_in' => true,
        'admin' => [ 'id' => (int)$user['id'], 'username' => $user['username'] ],
        'csrf_token' => $_SESSION['csrf_token'] ?? null,
    ]);
} catch (Exception $e) {
    respond(['error' => 'Internal Server Error'], 500);
}
