<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/auth.php';

// delete-car.php - Deletes a car and its images
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
if ($id <= 0) respond(['error' => 'Missing car id'], 422);

try {
    // Fetch files to delete
    $stmt = $pdo->prepare('SELECT primary_image FROM cars WHERE id = :id');
    $stmt->execute([':id' => $id]);
    $primary = $stmt->fetchColumn();

    $stmtImgs = $pdo->prepare('SELECT image_path FROM car_images WHERE car_id = :id');
    $stmtImgs->execute([':id' => $id]);
    $images = $stmtImgs->fetchAll(PDO::FETCH_COLUMN);

    // Delete DB row (FK will cascade to car_images)
    $stmtDel = $pdo->prepare('DELETE FROM cars WHERE id = :id');
    $stmtDel->execute([':id' => $id]);

    // Delete files from filesystem
    if ($primary) deleteImageFile($primary);
    foreach ($images as $img) deleteImageFile($img);

    respond(['message' => 'Car deleted']);
} catch (Exception $e) {
    respond(['error' => 'Delete failed', 'details' => $e->getMessage()], 500);
}
