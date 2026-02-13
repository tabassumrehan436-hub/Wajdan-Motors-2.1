<?php
require_once __DIR__ . '/../config.php';

// get-car.php?id=123
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) respond(['error' => 'Missing id'], 422);

try {
    $stmt = $pdo->prepare('SELECT * FROM cars WHERE id = :id');
    $stmt->execute([':id' => $id]);
    $car = $stmt->fetch();
    if (!$car) respond(['error' => 'Not found'], 404);

    $stmtImgs = $pdo->prepare('SELECT id, image_path FROM car_images WHERE car_id = :id ORDER BY id');
    $stmtImgs->execute([':id' => $id]);
    $images = $stmtImgs->fetchAll();

    $car['images'] = $images;
    respond($car);
} catch (Exception $e) {
    respond(['error' => 'Fetch failed', 'details' => $e->getMessage()], 500);
}
