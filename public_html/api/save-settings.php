<?php
require_once __DIR__ . '/../config.php';

// save-settings.php - Upsert site settings (POST)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

$business_name = isset($_POST['business_name']) ? cleanString($_POST['business_name']) : null;
$phone = isset($_POST['phone']) ? cleanString($_POST['phone']) : null;
$email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : null;
$whatsapp = isset($_POST['whatsapp']) ? cleanString($_POST['whatsapp']) : null;
$address = isset($_POST['address']) ? trim($_POST['address']) : null;
$working_hours = isset($_POST['working_hours']) ? cleanString($_POST['working_hours']) : null;

try {
    // Check if settings row exists
    $stmt = $pdo->query('SELECT id FROM settings LIMIT 1');
    $exists = (bool)$stmt->fetchColumn();

    if ($exists) {
        $sql = "UPDATE settings SET business_name = :business_name, phone = :phone, email = :email, whatsapp = :whatsapp, address = :address, working_hours = :working_hours WHERE id = 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':business_name' => $business_name,
            ':phone' => $phone,
            ':email' => $email,
            ':whatsapp' => $whatsapp,
            ':address' => $address,
            ':working_hours' => $working_hours,
        ]);
    } else {
        $sql = "INSERT INTO settings (business_name, phone, email, whatsapp, address, working_hours) VALUES (:business_name, :phone, :email, :whatsapp, :address, :working_hours)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':business_name' => $business_name,
            ':phone' => $phone,
            ':email' => $email,
            ':whatsapp' => $whatsapp,
            ':address' => $address,
            ':working_hours' => $working_hours,
        ]);
    }

    respond(['message' => 'Settings saved']);
} catch (Exception $e) {
    respond(['error' => 'Save failed', 'details' => $e->getMessage()], 500);
}
