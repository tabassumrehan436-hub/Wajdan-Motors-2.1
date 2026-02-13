<?php
require_once __DIR__ . '/../config.php';

// get-cars.php - Returns paginated list of cars (lightweight list view)
// Accepts: page (default 1), limit (default 20, max 100). Backwards compatible with per_page.
$page = max(1, (int)($_GET['page'] ?? ($_GET['p'] ?? 1)));
$perPage = (int)($_GET['limit'] ?? $_GET['per_page'] ?? 20);
$perPage = max(1, min(100, $perPage));
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
    // Count total
    $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM cars WHERE $where");
    $stmtCount->execute($params);
    $total = (int)$stmtCount->fetchColumn();

    // Select lightweight columns for list view (avoid large text fields)
    $cols = 'id, name, make, body_type, year, price, mileage, status, primary_image, created_at, updated_at';
    $stmt = $pdo->prepare("SELECT $cols FROM cars WHERE $where ORDER BY created_at DESC LIMIT :l OFFSET :o");
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->bindValue(':l', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':o', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $cars = $stmt->fetchAll();

    // Load images for the returned cars (only paths)
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
    respond(['error' => 'Fetch failed'], 500);
}
