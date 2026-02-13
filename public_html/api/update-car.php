<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/auth.php';

// update-car.php - Update car and manage images
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
if ($id <= 0) respond(['error' => 'Missing car id'], 422);

// Collect fields (only update provided values)
$fields = [];
$params = [':id' => $id];
$updatable = ['name','make','body_type','year','price','mileage','status','engine','transmission','fuel_type','color','seating','description','features'];
foreach ($updatable as $f) {
    if (isset($_POST[$f])) {
        // Validate numeric fields
        if (in_array($f, ['year','price','seating'])) {
            $val = $_POST[$f];
            if (!is_numeric($val)) continue; // ignore invalid numeric updates
            $params[":$f"] = (int)$val;
        } else {
            $params[":$f"] = cleanString($_POST[$f]);
        }
        $fields[] = "`$f` = :$f";
    }
}

if (empty($fields) && !isset($_FILES['primary_image']) && !isset($_FILES['images']) && empty($_POST['remove_image_ids'])) {
    respond(['error' => 'No fields to update'], 400);
}

try {
    $pdo->beginTransaction();

    // Replace primary image if provided
    if (isset($_FILES['primary_image']) && $_FILES['primary_image']['error'] !== UPLOAD_ERR_NO_FILE) {
        // fetch old primary to delete
        $stmtOld = $pdo->prepare('SELECT primary_image FROM cars WHERE id = :id');
        $stmtOld->execute([':id' => $id]);
        $old = $stmtOld->fetchColumn();
        $newPrimary = uploadImage($_FILES['primary_image']);
        $fields[] = "primary_image = :primary_image";
        $params[':primary_image'] = $newPrimary;
        if ($old) deleteImageFile($old);
    }

    if (!empty($fields)) {
        $sql = 'UPDATE cars SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }

    // Add additional images if any
    if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
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
            $stmtImg = $pdo->prepare("INSERT INTO car_images (car_id, image_path) VALUES (:car_id, :image_path)");
            $stmtImg->execute([':car_id' => $id, ':image_path' => $path]);
        }
    }

    // Remove images by id (optional)
    if (!empty($_POST['remove_image_ids'])) {
        $ids = array_filter(array_map('intval', explode(',', $_POST['remove_image_ids'])));
        if (!empty($ids)) {
            // fetch paths to delete files
            $in  = str_repeat('?,', count($ids) - 1) . '?';
            $stmtSel = $pdo->prepare("SELECT image_path FROM car_images WHERE id IN ($in) AND car_id = ?");
            $stmtSel->execute(array_merge($ids, [$id]));
            $paths = $stmtSel->fetchAll(PDO::FETCH_COLUMN);
            foreach ($paths as $p) deleteImageFile($p);

            $stmtDel = $pdo->prepare("DELETE FROM car_images WHERE id IN ($in) AND car_id = ?");
            $stmtDel->execute(array_merge($ids, [$id]));
        }
    }

    $pdo->commit();
    respond(['message' => 'Car updated']);
} catch (Exception $e) {
    $pdo->rollBack();
    respond(['error' => 'Update failed', 'details' => $e->getMessage()], 500);
}
