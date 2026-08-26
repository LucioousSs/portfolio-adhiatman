<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
  http_response_code(400);
  echo json_encode(['error' => 'Valid experience ID is required']);
  exit;
}

try {
  $stmt = $pdo->prepare('SELECT id FROM experiences WHERE id = :id');
  $stmt->execute([':id' => $id]);
  if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Experience not found']);
    exit;
  }

  $stmt = $pdo->prepare('DELETE FROM experiences WHERE id = :id');
  $stmt->execute([':id' => $id]);

  echo json_encode(['success' => true]);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
