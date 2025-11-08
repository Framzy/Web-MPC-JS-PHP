<?php
session_start();
require 'config.php';
$response = [];

$data = json_decode(file_get_contents('php://input'), true);
$type = $data['type'] ?? '';

if($type === 'slide'){
    $sql = "SELECT * FROM slidefilm";
}else if($type === 'recommendation'){
    $sql = "SELECT * FROM datafilm ORDER BY rating DESC LIMIT 5";
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $response[] = $row;
    }
} else {
    $response = ["message" => "Tidak ada data film ditemukan"];
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>