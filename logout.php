<?php
session_start();
// Cek apakah session 'user_id' ada
if (isset($_SESSION['user_id'])) {
    // Hapus semua data session
    session_unset();
    
    // Hancurkan session
    session_destroy();
    $isLoggedOut = true;
}else{
    $isLoggedOut = false;
}

header('Content-Type: application/json');
echo json_encode(['isLoggedOut' => $isLoggedOut]);
?>