<?php
require_once __DIR__ . '/../config.php';

// add-car.php - Adds a car record and handles image uploads
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

// Log incoming data for debugging
error_log('ADD-CAR REQUEST: ' . json_encode([
    'post' => $_POST,
    'files' => array_keys($_FILES)
]));

// Basic validation + sanitization
$name = isset($_POST['name']) ? cleanString($_POST['name']) : null;
$price = isset($_POST['price']) && $_POST['price'] !== '' ? (is_numeric($_POST['price']) ? (int)$_POST['price'] : 0) : 0;

// Require at least name
if (!$name) {
    error_log('ADD-CAR ERROR: Missing name');
    respond(['error' => 'Car name is required'], 422);
}

// If price is 0 or empty, default to 0
if ($price < 0) {
    $price = 0;
}

$make = isset($_POST['make']) && $_POST['make'] !== '' ? cleanString($_POST['make']) : null;
$body_type = isset($_POST['body_type']) && $_POST['body_type'] !== '' ? cleanString($_POST['body_type']) : null;
$year = isset($_POST['year']) && $_POST['year'] !== '' ? (is_numeric($_POST['year']) ? (int)$_POST['year'] : null) : null;
$mileage = isset($_POST['mileage']) && $_POST['mileage'] !== '' ? (is_numeric($_POST['mileage']) ? (int)$_POST['mileage'] : 0) : 0;
$status = isset($_POST['status']) && $_POST['status'] !== '' ? strtolower(cleanString($_POST['status'])) : 'available';

if (!in_array($status, ['available', 'sold'], true)) {
    $status = 'available';
}

$engine = isset($_POST['engine']) && $_POST['engine'] !== '' ? cleanString($_POST['engine']) : null;
$transmission = isset($_POST['transmission']) && $_POST['transmission'] !== '' ? cleanString($_POST['transmission']) : null;
$fuel_type = isset($_POST['fuel_type']) && $_POST['fuel_type'] !== '' ? cleanString($_POST['fuel_type']) : null;
$color = isset($_POST['color']) && $_POST['color'] !== '' ? cleanString($_POST['color']) : null;
$seating = isset($_POST['seating']) && $_POST['seating'] !== '' ? (is_numeric($_POST['seating']) ? (int)$_POST['seating'] : null) : null;
$description = isset($_POST['description']) ? trim($_POST['description']) : null;
$features = isset($_POST['features']) ? trim($_POST['features']) : null;

try {
    // Check if database is connected
    if ($pdo === null) {
        error_log('ADD-CAR ERROR: Database not connected');
        respond(['error' => 'Database temporary unavailable. Hostinger credentials need to be configured.'], 503);
    }

    // Handle primary image
    $primaryImagePath = null;
    if (isset($_FILES['primary_image']) && $_FILES['primary_image']['error'] !== UPLOAD_ERR_NO_FILE) {
        try {
            $primaryImagePath = uploadImage($_FILES['primary_image']);
        } catch (Exception $imgErr) {
            error_log('Image upload warning: ' . $imgErr->getMessage());
            // Don't fail entire request if image fails
        }
    }

    $stmt = $pdo->prepare("INSERT INTO cars
        (name, make, body_type, year, price, mileage, status, engine, transmission, fuel_type, color, seating, primary_image, description, features)
        VALUES
        (:name, :make, :body_type, :year, :price, :mileage, :status, :engine, :transmission, :fuel_type, :color, :seating, :primary_image, :description, :features)");

    $bindings = [
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
    ];

    error_log('ADD-CAR BINDINGS: ' . json_encode($bindings));

    $result = $stmt->execute($bindings);

    if (!$result) {
        throw new Exception('Execute failed - no rows affected');
    }

    $carId = (int)$pdo->lastInsertId();
    error_log('ADD-CAR SUCCESS: Car ID ' . $carId);

    // Additional images (optional, multi)
    if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
        for ($i = 0; $i < count($_FILES['images']['name']); $i++) {
            if ($_FILES['images']['error'][$i] === UPLOAD_ERR_NO_FILE) continue;
            try {
                $file = [
                    'name' => $_FILES['images']['name'][$i],
                    'type' => $_FILES['images']['type'][$i],
                    'tmp_name' => $_FILES['images']['tmp_name'][$i],
                    'error' => $_FILES['images']['error'][$i],
                    'size' => $_FILES['images']['size'][$i],
                ];
                $path = uploadImage($file);
                $stmtImg = $pdo->prepare("INSERT INTO car_images (car_id, image_path) VALUES (:car_id, :image_path)");
                $stmtImg->execute([':car_id' => $carId, ':image_path' => $path]);
            } catch (Exception $imgErr) {
                error_log('Image ' . $i . ' upload failed: ' . $imgErr->getMessage());
            }
        }
    }

    respond(['message' => 'Car created', 'id' => $carId, 'primary_image' => $primaryImagePath], 201);
} catch (Exception $e) {
    error_log('ADD-CAR ERROR: ' . $e->getMessage());
    error_log('ADD-CAR TRACE: ' . $e->getTraceAsString());
    respond(['error' => 'Failed to add car: ' . $e->getMessage()], 500);
}


