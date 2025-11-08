<?php
session_start();
require 'config.php';

$response = [];

// Change password
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $userId = $_SESSION['user_id'];
    $username = $_SESSION['username'];

    $password = $data['password']; // Password lama
    $newPassword = $data['newPassword']; // Password baru

    // Validasi input
    if (empty($password) || empty($newPassword)) {
        $response['error'] = 'Password and new password are required.';
        http_response_code(400);
        echo json_encode($response);
        exit;
    }

    // Ambil data pengguna dari database
    $stmt = $conn->prepare("SELECT id_akun, password FROM akun WHERE username = ?");
    if (!$stmt) {
        $response['error'] = 'Database error: ' . $conn->error;
        http_response_code(500);
        echo json_encode($response);
        exit;
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    // Jika username ditemukan
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($userId, $hashed_password);
        $stmt->fetch();

        // Verifikasi password lama
        if (password_verify($password, $hashed_password)) {
            // Hash password baru
            $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            // Update password baru di database
            $updateStmt = $conn->prepare("UPDATE akun SET password = ? WHERE id_akun = ?");
            if (!$updateStmt) {
                $response['error'] = 'Database error: ' . $conn->error;
                http_response_code(500);
                echo json_encode($response);
                exit;
            }

            $updateStmt->bind_param("si", $newHashedPassword, $userId);
            $updateStmt->execute();

            // Periksa apakah update berhasil
            if ($updateStmt->affected_rows > 0) {
                $response['success'] = 'Password updated successfully.';
                http_response_code(200);
            } else {
                $response['error'] = 'Failed to update password.';
                http_response_code(500);
            }

            $updateStmt->close();
        } else {
            $response['error'] = 'Current password is incorrect.';
            http_response_code(401); // Unauthorized
        }
    } else {
        $response['error'] = 'User not found.';
        http_response_code(404); // Not Found
    }

    $stmt->close();
    $conn->close();

} else {
    $response['error'] = 'Invalid request method.';
    http_response_code(405); // Method Not Allowed
}

header('Content-Type: application/json');
echo json_encode($response);
?>