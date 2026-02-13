<?php
require_once __DIR__ . '/../config.php';

// admin-login.php - authenticates admin, creates session and CSRF token
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(['success' => false, 'message' => 'Method not allowed']);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$username = isset($input['username']) ? trim($input['username']) : null;
$password = isset($input['password']) ? $input['password'] : null;

if (!$username || !$password) {
    respond(['success' => false, 'message' => 'Missing credentials'], 422);
}

try {
    $stmt = $pdo->prepare('SELECT id, username, password, is_active FROM admin_users WHERE username = :u LIMIT 1');
    $stmt->execute([':u' => $username]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row || !$row['is_active']) {
        respond(['success' => false, 'message' => 'Invalid credentials'], 401);
    }

    if (!password_verify($password, $row['password'])) {
        respond(['success' => false, 'message' => 'Invalid credentials'], 401);
    }

    // successful login -> create session + CSRF token
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['admin_id'] = (int)$row['id'];
    $_SESSION['admin_username'] = $row['username'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(24));

    respond(['success' => true, 'message' => 'Logged in', 'csrf_token' => $_SESSION['csrf_token']]);
} catch (Exception $e) {
    error_log('admin-login error: ' . $e->getMessage());
    respond(['success' => false, 'message' => 'Internal Server Error'], 500);
}
