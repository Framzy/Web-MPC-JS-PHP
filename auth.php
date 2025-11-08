<?php
session_start();
require 'config.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        $response['error'] = 'Username and password are required.';
        http_response_code(400);
        echo json_encode($response);
        exit;
    }

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

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($userId, $hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            session_regenerate_id();
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $response['success'] = true;
            $response['message'] = 'Login successful!';
            http_response_code(200);
        } else {
            $response['error'] = 'Invalid password.';
            http_response_code(401);
        }

    } else {
        $response['error'] = 'Invalid username or password.';
        http_response_code(401);
    }

    $stmt->close();
    $conn->close();
    // END

} else {
    $response['error'] = 'Invalid request method.';
    http_response_code(405);
}

header('Content-Type: application/json');
echo json_encode($response);
?>