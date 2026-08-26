<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

try {
  $id = $_POST['id'] ?? null;
  if (!$id || !is_numeric($id)) {
    throw new Exception('Valid experience ID is required');
  }

  $stmt = $pdo->prepare('SELECT id FROM experiences WHERE id = :id');
  $stmt->execute([':id' => $id]);
  if (!$stmt->fetch()) {
    http_response_code(404);
    throw new Exception('Experience not found');
  }

  if (empty($_POST['role']) || empty($_POST['event_name']) || empty($_POST['year'])) {
    throw new Exception('Role, event name, and year are required');
  }

  $stmt = $pdo->prepare("
    UPDATE experiences
    SET role = :role, event_name = :event_name, year = :year, description = :description, sort_order = :sort_order
    WHERE id = :id
  ");

  $stmt->execute([
    ':id'          => $id,
    ':role'        => trim($_POST['role']),
    ':event_name'  => trim($_POST['event_name']),
    ':year'        => trim($_POST['year']),
    ':description' => trim($_POST['description'] ?? ''),
    ':sort_order'  => (int) ($_POST['sort_order'] ?? 0),
  ]);

  echo json_encode(['success' => true]);

} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}
