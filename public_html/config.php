<?php
// config.php - Database connection + helpers
// Secure, environment-friendly, PDO (recommended for Hostinger)

declare(strict_types=1);

// ---- Configuration (use environment variables on Hostinger where possible) ----
$DB_HOST = getenv('DB_HOST') ?: '127.0.0.1';
$DB_NAME = getenv('DB_NAME') ?: 'car_dealer_db';
$DB_USER = getenv('DB_USER') ?: 'db_user_here';
$DB_PASS = getenv('DB_PASS') ?: 'db_pass_here';
$DB_PORT = getenv('DB_PORT') ?: '3306';

// Upload directory (relative path stored in DB)
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_PATH_PREFIX', 'uploads/');
// Increased to 15MB per image for VPS
define('MAX_FILE_SIZE', 15 * 1024 * 1024); // 15MB
$ALLOWED_TYPES = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

// ---- Global JSON responder ----
function respond($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// ---- Exception handler: convert to JSON ----
set_exception_handler(function ($e) {
    error_log($e->getMessage());
    respond(['error' => 'Internal Server Error'], 500);
});

// ---- Create PDO connection ----
$pdo = null;
try {
    $dsn = "mysql:host={$DB_HOST};port={$DB_PORT};dbname={$DB_NAME};charset=utf8mb4";
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    error_log('Database connected successfully');
} catch (PDOException $ex) {
    // Log but don't die - allow frontend-only mode
    error_log('DB Connection error: ' . $ex->getMessage());
    error_log('DB CONFIG - Host: ' . $DB_HOST . ', DB: ' . $DB_NAME . ', User: ' . $DB_USER);
    $pdo = null;
    // Don't call respond() here - let it continue for frontend mode
}

// ---- Ensure uploads directory exists and is not executable ----
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// ---- File upload helper ----
function uploadImage(array $file)
{
    global $ALLOWED_TYPES;

    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new RuntimeException('File upload error code: ' . $file['error']);
    }

    if ($file['size'] > MAX_FILE_SIZE) {
        throw new RuntimeException('File exceeds maximum size of 15MB');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    if (!isset($ALLOWED_TYPES[$mime])) {
        throw new RuntimeException('Invalid file type');
    }

    $ext = $ALLOWED_TYPES[$mime];

    // Use YYYY/MM directories for scalability
    $subdir = date('Y') . '/' . date('m') . '/';
    $dir = UPLOAD_DIR . $subdir;
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    // uniqid + random suffix
    $newName = uniqid('', true) . '-' . bin2hex(random_bytes(6)) . '.' . $ext;
    $destination = $dir . $newName;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new RuntimeException('Failed to move uploaded file');
    }

    // Set safe permissions
    chmod($destination, 0644);

    // Return relative path including subdir
    // Return path with leading slash for consistency (e.g. /uploads/2026/02/file.jpg)
    return '/' . UPLOAD_PATH_PREFIX . $subdir . $newName; // store relative path in DB
}

function deleteImageFile(?string $relativePath): void
{
    if (empty($relativePath)) return;

    // Accept relative paths like 'uploads/YYYY/MM/file.ext' or just filename
    $rel = $relativePath;
    // Normalize: allow paths with or without leading slash
    if (strpos($rel, '/' . UPLOAD_PATH_PREFIX) === 0) {
        $rel = substr($rel, strlen('/' . UPLOAD_PATH_PREFIX));
    } elseif (strpos($rel, UPLOAD_PATH_PREFIX) === 0) {
        $rel = substr($rel, strlen(UPLOAD_PATH_PREFIX));
    }

    // Prevent directory traversal
    $rel = str_replace(['..', './', "\\"], '', $rel);
    $abs = rtrim(UPLOAD_DIR, '/') . '/' . ltrim($rel, '/');

    if (is_file($abs)) {
        @unlink($abs);
    }
}

// ---- Input sanitizers ----
function cleanString($s)
{
    return trim(filter_var($s, FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES));
}

function cleanInt($v)
{
    return $v === null || $v === '' ? null : (int)$v;
}

?>