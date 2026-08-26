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
  $paths = [];
  $count = count($files['name']);

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

function deleteOldFiles(string $thumbnailUrl, ?string $collageImages, string $baseDir) {
  if ($thumbnailUrl) {
    $file = $baseDir . $thumbnailUrl;
    if (file_exists($file)) {
      unlink($file);
    }
  }
  if ($collageImages) {
    $images = explode(',', $collageImages);
    foreach ($images as $img) {
      $file = $baseDir . trim($img);
      if (file_exists($file)) {
        unlink($file);
      }
    }
  }
}

try {
  $id = $_POST['project_id'] ?? null;
  if (!$id || !is_numeric($id)) {
    throw new Exception('Valid project ID is required');
  }

  if (empty($_POST['title']) || empty($_POST['description'])) {
    throw new Exception('Title and description are required');
  }

  $stmt = $pdo->prepare('SELECT thumbnail_url, collage_images FROM projects WHERE id = :id');
  $stmt->execute([':id' => $id]);
  $existing = $stmt->fetch();

  if (!$existing) {
    http_response_code(404);
    throw new Exception('Project not found');
  }

  $thumbnailUrl = $existing['thumbnail_url'];
  if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === UPLOAD_ERR_OK) {
    deleteOldFiles($existing['thumbnail_url'], null, __DIR__ . '/../');
    $thumbnailUrl = uploadSingleFile($_FILES['thumbnail'], $allowedExts, $uploadDir);
  }

  $collagePaths = $existing['collage_images'] ? explode(',', $existing['collage_images']) : [];

  if (isset($_POST['remove_collage']) && $_POST['remove_collage'] !== '') {
    $removeIds = array_filter(
      array_map('trim', explode(',', $_POST['remove_collage'])),
      fn($v) => $v !== ''
    );
    foreach ($removeIds as $rid) {
      $idx = (int) $rid;
      if (isset($collagePaths[$idx])) {
        $file = __DIR__ . '/../' . $collagePaths[$idx];
        if (file_exists($file)) {
          unlink($file);
        }
        unset($collagePaths[$idx]);
      }
    }
    $collagePaths = array_values($collagePaths);
  }

  $hasNewCollage = isset($_FILES['collage_images'])
    && !empty($_FILES['collage_images']['name'])
    && $_FILES['collage_images']['error'] !== UPLOAD_ERR_NO_FILE;

  if ($hasNewCollage) {
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
    $newPaths = uploadMultipleFiles($cf, $allowedExts, $uploadDir);
    $collagePaths = array_merge($collagePaths, $newPaths);
  }

  $collageStr = !empty($collagePaths) ? implode(',', $collagePaths) : null;

  $stmt = $pdo->prepare("
    UPDATE projects
    SET title = :title, description = :description, tags = :tags,
        demo_url = :demo_url, github_url = :github_url,
        thumbnail_url = :thumbnail_url, collage_images = :collage_images
    WHERE id = :id
  ");

  $stmt->execute([
    ':id'             => (int) $id,
    ':title'          => trim($_POST['title']),
    ':description'    => trim($_POST['description']),
    ':tags'           => trim($_POST['tags'] ?? ''),
    ':demo_url'       => !empty($_POST['demo_url']) ? trim($_POST['demo_url']) : null,
    ':github_url'     => !empty($_POST['github_url']) ? trim($_POST['github_url']) : null,
    ':thumbnail_url'  => $thumbnailUrl,
    ':collage_images' => $collageStr,
  ]);

  echo json_encode([
    'success' => true,
    'id'      => (int) $id,
  ]);

} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['error' => $e->getMessage()]);
}
