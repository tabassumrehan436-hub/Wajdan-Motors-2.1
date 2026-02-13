<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/auth.php';

// change-password.php - Protected endpoint to change admin password
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Read and validate input
$current = isset($_POST['current_password']) ? trim((string)$_POST['current_password']) : '';
$new = isset($_POST['new_password']) ? trim((string)$_POST['new_password']) : '';

if ($current === '' || $new === '') {
    respond(['success' => false, 'message' => 'Both current and new passwords are required'], 422);
}

if (strlen($new) < 8) {
    respond(['success' => false, 'message' => 'New password must be at least 8 characters long'], 422);
}

try {
    $adminId = (int)($_SESSION['admin_id'] ?? 0);
    if ($adminId <= 0) {
        respond(['success' => false, 'message' => 'Unauthorized'], 401);
    }

    // Fetch current hash
    $stmt = $pdo->prepare('SELECT password FROM admin_users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $adminId]);
    $row = $stmt->fetch();
    if (!$row) {
        // defensive: user disappeared
        session_unset();
        session_destroy();
        respond(['success' => false, 'message' => 'Unauthorized'], 401);
    }

    $hash = $row['password'];

    if (!password_verify($current, $hash)) {
        // do not reveal whether username exists or not
        respond(['success' => false, 'message' => 'Current password is incorrect'], 401);
    }

    if (password_verify($new, $hash)) {
        respond(['success' => false, 'message' => 'New password must be different from the current password'], 422);
    }

    $newHash = password_hash($new, PASSWORD_DEFAULT);
    if ($newHash === false) {
        error_log('Password hashing failed for admin id: ' . $adminId);
        respond(['success' => false, 'message' => 'Unable to change password'], 500);
    }

    $upd = $pdo->prepare('UPDATE admin_users SET password = :password WHERE id = :id');
    $upd->execute([':password' => $newHash, ':id' => $adminId]);

    // Regenerate session id after password change
    session_regenerate_id(true);

    respond(['success' => true, 'message' => 'Password changed successfully']);
} catch (Exception $e) {
    error_log('change-password error: ' . $e->getMessage());
    respond(['success' => false, 'message' => 'Internal Server Error'], 500);
}
