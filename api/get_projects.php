<?php
require __DIR__ . '/config.php';

$stmt = $pdo->query('SELECT * FROM projects ORDER BY id DESC');
$rows = $stmt->fetchAll();

$results = [];
foreach ($rows as $row) {
  $collage = null;
  if (!empty($row['collage_data'])) {
    $decoded = json_decode($row['collage_data'], true);
    if (is_array($decoded)) {
      $collage = implode(',', $decoded);
    }
  }

  $results[] = [
    'id'             => $row['id'],
    'title'          => $row['title'],
    'description'    => $row['description'],
    'tags'           => $row['tags'],
    'demo_url'       => $row['demo_url'],
    'github_url'     => $row['github_url'],
    'thumbnail_url'  => $row['thumbnail_data'],
    'collage_images' => $collage,
    'created_at'     => $row['created_at'],
  ];
}

echo json_encode($results);
