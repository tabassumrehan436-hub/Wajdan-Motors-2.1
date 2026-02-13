<?php
require_once __DIR__ . '/../config.php';

// get-cars.php - Returns paginated list of cars with images
$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = min(100, max(1, (int)($_GET['per_page'] ?? 20)));
$offset = ($page - 1) * $perPage;

// Basic search/filter support (optional)
$search = isset($_GET['q']) ? trim($_GET['q']) : null;
$where = '1';
$params = [];
if ($search) {
    $where = '(name LIKE :q OR make LIKE :q OR description LIKE :q)';
    $params[':q'] = "%$search%";
}

try {
    $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM cars WHERE $where");
    $stmtCount->execute($params);
    $total = (int)$stmtCount->fetchColumn();

    $stmt = $pdo->prepare("SELECT * FROM cars WHERE $where ORDER BY created_at DESC LIMIT :l OFFSET :o");
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->bindValue(':l', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':o', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $cars = $stmt->fetchAll();

    // Load images for the returned cars
    $ids = array_column($cars, 'id');
    $imagesMap = [];
    if (!empty($ids)) {
        $in = str_repeat('?,', count($ids) - 1) . '?';
        $stmtImgs = $pdo->prepare("SELECT car_id, image_path FROM car_images WHERE car_id IN ($in) ORDER BY id");
        $stmtImgs->execute($ids);
        while ($row = $stmtImgs->fetch()) {
            $imagesMap[$row['car_id']][] = $row['image_path'];
        }
    }

    foreach ($cars as &$c) {
        $c['images'] = $imagesMap[$c['id']] ?? [];
    }

    respond([
        'total' => $total,
        'page' => $page,
        'per_page' => $perPage,
        'data' => $cars,
    ]);
} catch (Exception $e) {
    respond(['error' => 'Fetch failed', 'details' => $e->getMessage()], 500);
}
