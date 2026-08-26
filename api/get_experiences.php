<?php
require __DIR__ . '/config.php';

$stmt = $pdo->query('SELECT * FROM experiences ORDER BY sort_order ASC, id DESC');
$rows = $stmt->fetchAll();

echo json_encode($rows);
