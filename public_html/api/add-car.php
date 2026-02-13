<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/auth.php';

// add-car.php - Adds a car record and handles image uploads
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

// Basic validation + sanitization
$name = isset($_POST['name']) ? cleanString($_POST['name']) : null;
$price = isset($_POST['price']) ? (is_numeric($_POST['price']) ? (int)$_POST['price'] : null) : null;

if (!$name || $price === null) {
    respond(['error' => 'Missing or invalid required fields: name and price'], 422);
}

$make = isset($_POST['make']) ? cleanString($_POST['make']) : null;
$body_type = isset($_POST['body_type']) ? cleanString($_POST['body_type']) : null;
$year = isset($_POST['year']) ? (is_numeric($_POST['year']) ? (int)$_POST['year'] : null) : null;
$mileage = isset($_POST['mileage']) ? cleanString($_POST['mileage']) : null;
$status = isset($_POST['status']) ? cleanString($_POST['status']) : null;
$engine = isset($_POST['engine']) ? cleanString($_POST['engine']) : null;
$transmission = isset($_POST['transmission']) ? cleanString($_POST['transmission']) : null;
$fuel_type = isset($_POST['fuel_type']) ? cleanString($_POST['fuel_type']) : null;
$color = isset($_POST['color']) ? cleanString($_POST['color']) : null;
$seating = isset($_POST['seating']) ? (is_numeric($_POST['seating']) ? (int)$_POST['seating'] : null) : null;
$description = isset($_POST['description']) ? trim($_POST['description']) : null;
$features = isset($_POST['features']) ? trim($_POST['features']) : null;

try {
    $pdo->beginTransaction();

    // Handle primary image
    $primaryImagePath = null;
    if (isset($_FILES['primary_image']) && $_FILES['primary_image']['error'] !== UPLOAD_ERR_NO_FILE) {
        $primaryImagePath = uploadImage($_FILES['primary_image']);
    }

    $stmt = $pdo->prepare("INSERT INTO cars
        (name, make, body_type, year, price, mileage, status, engine, transmission, fuel_type, color, seating, primary_image, description, features)
        VALUES
        (:name, :make, :body_type, :year, :price, :mileage, :status, :engine, :transmission, :fuel_type, :color, :seating, :primary_image, :description, :features)");

    $stmt->execute([
        ':name' => $name,
        ':make' => $make,
        ':body_type' => $body_type,
        ':year' => $year,
        ':price' => $price,
        ':mileage' => $mileage,
        ':status' => $status,
        ':engine' => $engine,
        ':transmission' => $transmission,
        ':fuel_type' => $fuel_type,
        ':color' => $color,
        ':seating' => $seating,
        ':primary_image' => $primaryImagePath,
        ':description' => $description,
        ':features' => $features,
    ]);

    $carId = (int)$pdo->lastInsertId();

    // Additional images (optional, multi)
    if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
        $images = [];
        for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
            if ($_FILES['images']['error'][$i] === UPLOAD_ERR_NO_FILE) continue;
            $file = [
                'name' => $_FILES['images']['name'][$i],
                'type' => $_FILES['images']['type'][$i],
                'tmp_name' => $_FILES['images']['tmp_name'][$i],
                'error' => $_FILES['images']['error'][$i],
                'size' => $_FILES['images']['size'][$i],
            ];
            $path = uploadImage($file);
            $images[] = $path;
            $stmtImg = $pdo->prepare("INSERT INTO car_images (car_id, image_path) VALUES (:car_id, :image_path)");
            $stmtImg->execute([':car_id' => $carId, ':image_path' => $path]);
        }
    }

    $pdo->commit();

    respond(['message' => 'Car created', 'id' => $carId], 201);
} catch (Exception $e) {
    $pdo->rollBack();
    // If file uploaded but DB failed, try to remove files
    if (!empty($primaryImagePath)) deleteImageFile($primaryImagePath);
    respond(['error' => 'Failed to create car', 'details' => $e->getMessage()], 500);
}
