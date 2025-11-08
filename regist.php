<?php
session_start();
require 'config.php';

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $username = $data['newUsername'] ?? '';
    $password = $data['newPassword'] ?? '';
        
    if (empty($username) || empty($password)) {
        $response['error'] = 'Username and password are required.';
        http_response_code(400);
        echo json_encode($response);
        exit;
    }
    
    $stmt = $conn->prepare("SELECT id_akun FROM akun WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result(); 
    
    if ($stmt->num_rows > 0) {
        $response['error'] = 'Username already exists.';
        http_response_code(400);
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $insertStmt = $conn->prepare("INSERT INTO akun (username, password) VALUES (?, ?)");
        $insertStmt->bind_param("ss", $username, $hashedPassword);

        if ($insertStmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Account created successfully!';
            http_response_code(201);
        } else {
            $response['error'] = 'Error creating account.';
            http_response_code(500);
        }
        
        $insertStmt->close();
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