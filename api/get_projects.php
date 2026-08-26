<?php
require __DIR__ . '/config.php';

$stmt = $pdo->query('SELECT * FROM projects ORDER BY id DESC');
$rows = $stmt->fetchAll();

$results = [];
foreach ($rows as $row) {
  $results[] = [
    'id'             => $row['id'],
    'title'          => $row['title'],
    'description'    => $row['description'],
    'tags'           => $row['tags'],
    'demo_url'       => $row['demo_url'],
    'github_url'     => $row['github_url'],
    'thumbnail_url'  => $row['thumbnail_data'],
    'collage_images' => $row['collage_data'],
    'created_at'     => $row['created_at'],
  ];
}

echo json_encode($results);
