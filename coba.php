<?php
session_start();

// Cek apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    // Redirect ke halaman login jika belum login
    exit();
}

// Mengakses user_id
$user_id = $_SESSION['user_id'];

// Lakukan operasi lain yang membutuhkan user_id
echo "Selamat datang, user ID Anda adalah: " . $user_id;
?>