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
  echo json_encode(['error' => 'Valid project ID is required']);
  exit;
}

try {
  $stmt = $pdo->prepare('SELECT thumbnail_url, collage_images FROM projects WHERE id = :id');
  $stmt->execute([':id' => $id]);
  $project = $stmt->fetch();

  if (!$project) {
    http_response_code(404);
    echo json_encode(['error' => 'Project not found']);
    exit;
  }

  $deleteFiles = [];
  if ($project['thumbnail_url']) {
    $deleteFiles[] = __DIR__ . '/../' . $project['thumbnail_url'];
  }
  if ($project['collage_images']) {
    $images = explode(',', $project['collage_images']);
    foreach ($images as $img) {
      $deleteFiles[] = __DIR__ . '/../' . trim($img);
    }
  }

  foreach ($deleteFiles as $file) {
    if (file_exists($file)) {
      unlink($file);
    }
  }

  $stmt = $pdo->prepare('DELETE FROM projects WHERE id = :id');
  $stmt->execute([':id' => $id]);

  echo json_encode(['success' => true]);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}