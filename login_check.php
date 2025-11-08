<?php
session_start();

$user_id = $_SESSION['user_id'] ?? null;
$username = $_SESSION['username'] ?? null;

if (!$user_id) {
    echo json_encode(['isLoggedIn' => false]);
    exit;
}

require 'config.php';

$stmt = $conn->prepare("SELECT id_akun FROM akun WHERE id_akun = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$isLoggedIn = $result->num_rows > 0;

header('Content-Type: application/json');
echo json_encode(['isLoggedIn' => $isLoggedIn , 'user_id' => $user_id, 'username' => $username]);

$stmt->close();
$conn->close();
?>