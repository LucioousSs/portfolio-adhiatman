<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

try {
  $id = $_POST['project_id'] ?? null;
  if (!$id || !is_numeric($id)) {
    throw new Exception('Valid project ID is required');
  }

  if (empty($_POST['title']) || empty($_POST['description'])) {
    throw new Exception('Title and description are required');
  }

  $stmt = $pdo->prepare('SELECT id, collage_data FROM projects WHERE id = :id');
  $stmt->execute([':id' => $id]);
  $existing = $stmt->fetch();

  if (!$existing) {
    http_response_code(404);
    throw new Exception('Project not found');
  }

  $thumbnailData = $_POST['thumbnail_data'] ?? '';

  $collageArr = [];
  if (!empty($existing['collage_data'])) {
    $decoded = json_decode($existing['collage_data'], true);
    if (is_array($decoded)) {
      $collageArr = $decoded;
    }
  }

  if (!empty($_POST['remove_collage']) && $_POST['remove_collage'] !== '') {
    $removeIds = array_filter(
      array_map('trim', explode(',', $_POST['remove_collage'])),
      fn($v) => $v !== ''
    );
    foreach ($removeIds as $rid) {
      $idx = (int) $rid;
      if (isset($collageArr[$idx])) {
        unset($collageArr[$idx]);
      }
    }
    $collageArr = array_values($collageArr);
  }

  if (!empty($_POST['collage_data'])) {
    $newCollage = json_decode($_POST['collage_data'], true);
    if (is_array($newCollage)) {
      $collageArr = array_merge($collageArr, $newCollage);
    }
  }

  $collageData = !empty($collageArr) ? json_encode($collageArr) : null;

  $params = [
    ':id'             => (int) $id,
    ':title'          => trim($_POST['title']),
    ':description'    => trim($_POST['description']),
    ':tags'           => trim($_POST['tags'] ?? ''),
    ':demo_url'       => !empty($_POST['demo_url']) ? trim($_POST['demo_url']) : null,
    ':github_url'     => !empty($_POST['github_url']) ? trim($_POST['github_url']) : null,
    ':collage_data'   => $collageData,
  ];

  if (!empty($thumbnailData)) {
    $params[':thumbnail_data'] = $thumbnailData;
    $stmt = $pdo->prepare("
      UPDATE projects
      SET title = :title, description = :description, tags = :tags,
          demo_url = :demo_url, github_url = :github_url,
          thumbnail_data = :thumbnail_data, collage_data = :collage_data
      WHERE id = :id
    ");
  } else {
    $stmt = $pdo->prepare("
      UPDATE projects
      SET title = :title, description = :description, tags = :tags,
          demo_url = :demo_url, github_url = :github_url,
          collage_data = :collage_data
      WHERE id = :id
    ");
  }

  $stmt->execute($params);

  echo json_encode([
    'success' => true,
    'id'      => (int) $id,
  ]);

} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}
