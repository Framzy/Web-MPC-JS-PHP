<?php
session_start();
require "config.php";

$response = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Mengambil data JSON yang dikirim oleh klien
    $data = json_decode(file_get_contents('php://input'), true);
    $sort = $data['sortSave'] ?? '';
    $userId = $_SESSION['user_id'] ?? null;
    
    // Query dasar dengan INNER JOIN
    $query = "SELECT df.* 
    FROM datafilm df 
    INNER JOIN simpanfilm sf ON df.movie_id = sf.id_film 
    WHERE sf.id_akun = ?";

    // Menambahkan kondisi ORDER BY berdasarkan sort
    if (!empty($sort)) {
        if ($sort == "terbaru") {
            $query .= " ORDER BY sf.id_simpan DESC";
        } else if ($sort == "terlama") {
            $query .= " ORDER BY sf.id_simpan ASC";
        }
    } else {
        $query .= " ORDER BY sf.id_simpan DESC"; // Default sorting jika tidak ada parameter sort
    }

    
    // Menyiapkan statement
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);

    // Menjalankan statement
    $stmt->execute();
    $result = $stmt->get_result();

    // Memeriksa hasil dan menambahkan ke $response
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $response[] = [
                'movie_id' => $row['movie_id'],
                'poster' => $row['poster'],
                'title' => $row['title'],
                'release_year' => $row['release_year'],
                'genre' => $row['genre'],
                'rating' => $row['rating'],
                'star1' => $row['star1'],
                'star2' => $row['star2'],
                'star3' => $row['star3'],
                'star4' => $row['star4']
            ];        }
    } else {
        $response['error'] = "No results found or error: " . $conn->error;
    }

    // Menutup statement
    $stmt->close();
} else {
    $response['error'] = "Invalid request method.";
}

// Mengirimkan respons JSON ke klien
header('Content-Type: application/json');
echo json_encode($response);

// Menutup koneksi
$conn->close();
?>