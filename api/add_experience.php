<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

try {
  if (empty($_POST['role']) || empty($_POST['event_name']) || empty($_POST['year'])) {
    throw new Exception('Role, event name, and year are required');
  }

  $stmt = $pdo->prepare("
    INSERT INTO experiences (role, event_name, year, description, sort_order)
    VALUES (:role, :event_name, :year, :description, :sort_order)
  ");

  $stmt->execute([
    ':role'        => trim($_POST['role']),
    ':event_name'  => trim($_POST['event_name']),
    ':year'        => trim($_POST['year']),
    ':description' => trim($_POST['description'] ?? ''),
    ':sort_order'  => (int) ($_POST['sort_order'] ?? 0),
  ]);

  echo json_encode([
    'success' => true,
    'id'      => (int) $pdo->lastInsertId(),
  ]);

} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}
