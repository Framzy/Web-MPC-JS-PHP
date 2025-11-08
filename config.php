<?php
if (!ob_start("ob_gzhandler")) {
    ob_start();
}
$hostname = "localhost";
$username = "root";
$password = "";
$database = "mpc_db";

$conn = new mysqli($hostname, $username, $password, $database);

if ($conn -> connect_error){
    die(json_encode(["error" => "Koneksi gagal: " . $conn->connect_error]));
}
?>