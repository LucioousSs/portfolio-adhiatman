<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

try {
  if (empty($_POST['title']) || empty($_POST['description'])) {
    throw new Exception('Title and description are required');
  }

  $thumbnailData = $_POST['thumbnail_data'] ?? '';
  if (empty($thumbnailData)) {
    throw new Exception('Thumbnail image is required');
  }

  $collageData = null;
  if (!empty($_POST['collage_data'])) {
    $collageArr = json_decode($_POST['collage_data'], true);
    if (is_array($collageArr) && count($collageArr) > 0) {
      $collageData = json_encode($collageArr);
    }
  }

  $stmt = $pdo->prepare("
    INSERT INTO projects (title, description, tags, demo_url, github_url, thumbnail_data, collage_data)
    VALUES (:title, :description, :tags, :demo_url, :github_url, :thumbnail_data, :collage_data)
  ");

  $stmt->execute([
    ':title'          => trim($_POST['title']),
    ':description'    => trim($_POST['description']),
    ':tags'           => trim($_POST['tags'] ?? ''),
    ':demo_url'       => !empty($_POST['demo_url']) ? trim($_POST['demo_url']) : null,
    ':github_url'     => !empty($_POST['github_url']) ? trim($_POST['github_url']) : null,
    ':thumbnail_data' => $thumbnailData,
    ':collage_data'   => $collageData,
  ]);

  echo json_encode([
    'success' => true,
    'id'      => (int) $pdo->lastInsertId(),
  ]);

} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}
