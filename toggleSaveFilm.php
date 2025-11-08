<?php
session_start();
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$userId = $_SESSION['user_id'] ?? null;
$filmId = $data['filmId'] ?? null;

if (!$userId || !$filmId) {
    echo json_encode(['success' => false]);
    exit;
}

// Cek apakah kombinasi id_akun dan id_film sudah ada
$checkStmt = $conn->prepare("SELECT id_simpan FROM simpanfilm WHERE id_akun = ? AND id_film = ?");
$checkStmt->bind_param("ii", $userId, $filmId);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    // Jika sudah ada, hapus
    $stmt = $conn->prepare("DELETE FROM simpanfilm WHERE id_akun = ? AND id_film = ?");
    $action = 'unsave';
} else {
    // Jika belum ada, tambahkan
    $stmt = $conn->prepare("INSERT INTO simpanfilm (id_akun, id_film) VALUES (?, ?)");
    $action = 'save';
}

$stmt->bind_param("ii", $userId, $filmId);

$result = $stmt->execute();
if (!$result) {
    error_log("Execute error: " . $stmt->error);
    echo json_encode(['success' => false, 'error' => $stmt->error]);
} else {
    echo json_encode([
        'success' => true, 
        'action' => $action, 
        'idUser' => $userId, 
        'idFilm' => $filmId
    ]);
}

$checkStmt->close();
$stmt->close();
$conn->close();
?>