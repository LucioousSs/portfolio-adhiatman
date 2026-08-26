<?php
require __DIR__ . '/config.php';

$stmt = $pdo->query('SELECT * FROM projects ORDER BY id DESC');
$rows = $stmt->fetchAll();

echo json_encode($rows);