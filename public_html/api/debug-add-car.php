<?php
// Debug script to test add-car.php issues
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config.php';

// Log all incoming data
error_log('=== ADD CAR DEBUG ===');
error_log('REQUEST METHOD: ' . $_SERVER['REQUEST_METHOD']);
error_log('POST DATA: ' . json_encode($_POST, JSON_PRETTY_PRINT));
error_log('FILES: ' . json_encode(array_keys($_FILES)));

// Simple test: try to check database
try {
    error_log('Testing database connection...');
    $stmt = $pdo->query("SELECT COUNT(*) FROM cars");
    $count = $stmt->fetchColumn();
    error_log('✓ Cars table exists. Count: ' . $count);
    respond(['success' => true, 'message' => 'DB connected', 'cars_count' => $count]);
} catch (Exception $e) {
    error_log('✗ ERROR querying cars table: ' . $e->getMessage());
    respond(['error' => 'Database error', 'details' => $e->getMessage()], 500);
}

