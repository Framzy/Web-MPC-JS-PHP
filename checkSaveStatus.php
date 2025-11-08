<?php
session_start();
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$userId = $_SESSION['user_id'] ?? null;
$filmId = $data['film_id'] ?? null;

if (!$userId || !$filmId) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM simpanfilm WHERE id_akun = ? AND id_film = ?");
$stmt->bind_param("ii", $userId, $filmId);
$stmt->execute();
$result = $stmt->get_result();

header('Content-Type: application/json');
echo json_encode(['isSaved' => $result->num_rows > 0, 'filmId' => $filmId]);

$stmt->close();
$conn->close();
?>