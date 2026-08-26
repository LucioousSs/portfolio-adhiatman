<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
$uploadDir   = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0755, true);
}

function uploadSingleFile(array $file, array $allowedExts, string $uploadDir): string {
  if ($file['error'] !== UPLOAD_ERR_OK) {
    throw new Exception('File upload error: ' . $file['error']);
  }

  $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
  if (!in_array($ext, $allowedExts)) {
    throw new Exception('Invalid file type: ' . $ext . '. Allowed: ' . implode(', ', $allowedExts));
  }

  $maxSize = 5 * 1024 * 1024;
  if ($file['size'] > $maxSize) {
    throw new Exception('File too large (max 5MB)');
  }

  $newName = uniqid('proj_', true) . '.' . $ext;
  $dest    = $uploadDir . $newName;

  if (!move_uploaded_file($file['tmp_name'], $dest)) {
    throw new Exception('Failed to save uploaded file');
  }

  return 'uploads/' . $newName;
}

function uploadMultipleFiles(array $files, array $allowedExts, string $uploadDir): array {
  $paths  = [];
  $count  = count($files['name']);

  for ($i = 0; $i < $count; $i++) {
    if ($files['error'][$i] !== UPLOAD_ERR_OK) {
      continue;
    }

    $ext = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExts)) {
      continue;
    }

    $tmpFile = [
      'name'     => $files['name'][$i],
      'type'     => $files['type'][$i],
      'tmp_name' => $files['tmp_name'][$i],
      'error'    => $files['error'][$i],
      'size'     => $files['size'][$i],
    ];

    try {
      $path = uploadSingleFile($tmpFile, $allowedExts, $uploadDir);
      $paths[] = $path;
    } catch (Exception $e) {
      continue;
    }
  }

  return $paths;
}

try {
  if (empty($_POST['title']) || empty($_POST['description'])) {
    throw new Exception('Title and description are required');
  }

  if (!isset($_FILES['thumbnail']) || $_FILES['thumbnail']['error'] !== UPLOAD_ERR_OK) {
    throw new Exception('Thumbnail image is required');
  }

  $thumbnailUrl = uploadSingleFile($_FILES['thumbnail'], $allowedExts, $uploadDir);

  $collagePaths = [];
  $hasCollage = isset($_FILES['collage_images'])
    && !empty($_FILES['collage_images']['name'])
    && $_FILES['collage_images']['error'] !== UPLOAD_ERR_NO_FILE;

  if ($hasCollage) {
    $cf = $_FILES['collage_images'];
    if (!is_array($cf['name'])) {
      $cf = [
        'name'     => [$cf['name']],
        'type'     => [$cf['type']],
        'tmp_name' => [$cf['tmp_name']],
        'error'    => [$cf['error']],
        'size'     => [$cf['size']],
      ];
    }
    $collagePaths = uploadMultipleFiles($cf, $allowedExts, $uploadDir);
  }

  $stmt = $pdo->prepare("
    INSERT INTO projects (title, description, tags, demo_url, github_url, thumbnail_url, collage_images)
    VALUES (:title, :description, :tags, :demo_url, :github_url, :thumbnail_url, :collage_images)
  ");

  $stmt->execute([
    ':title'          => trim($_POST['title']),
    ':description'    => trim($_POST['description']),
    ':tags'           => trim($_POST['tags'] ?? ''),
    ':demo_url'       => !empty($_POST['demo_url']) ? trim($_POST['demo_url']) : null,
    ':github_url'     => !empty($_POST['github_url']) ? trim($_POST['github_url']) : null,
    ':thumbnail_url'  => $thumbnailUrl,
    ':collage_images' => !empty($collagePaths) ? implode(',', $collagePaths) : null,
  ]);

  echo json_encode([
    'success' => true,
    'id'      => (int) $pdo->lastInsertId(),
  ]);

} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}