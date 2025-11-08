<?php
require "config.php";

$response = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Mengambil data JSON yang dikirim oleh klien
    $data = json_decode(file_get_contents('php://input'), true);
    $search = $data['search'] ?? '';
    $release = $data['release'] ?? '';
    $genre = $data['genre'] ?? '';
    $sort = $data['sort'] ?? '';
    
    // Query dasar untuk tabel slidefilm
    $query = "SELECT * FROM datafilm WHERE 1=1";

    // Filter berdasarkan search
    if (!empty($search)) {
        $query .= " AND (title LIKE ? OR star1 LIKE ? OR director LIKE ?)";
    }

    if (!empty($release)) {
        $query .= " AND release_year LIKE ?";
    }
    
    // Filter berdasarkan genre
    if (!empty($genre)) {
        $query .= " AND genre LIKE ?";
    }

    // Sorting berdasarkan rating
    if (!empty($sort)) {
        if ($sort == "tertinggi") {
            $query .= " ORDER BY rating DESC";
        } else if ($sort == "terendah") {
            $query .= " ORDER BY rating ASC";
        }
    } else {
        $query .= " ORDER BY rating DESC";
    }

    // Menyiapkan statement
    $stmt = $conn->prepare($query);

    // Mengikat parameter berdasarkan input search dan genre
    if (!empty($search)) {
        $searchParam = "%" . $search . "%";
        $stmt->bind_param("sss", $searchParam, $searchParam, $searchParam);
    } elseif (!empty($release)) {
        $releaseParam = "%" . $release . "%";
        $stmt->bind_param("s", $releaseParam);
    } elseif (!empty($genre)) {
        $genreParam = "%" . $genre . "%";
        $stmt->bind_param("s", $genreParam);
    }

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
            ];
        }
    } else {
        $response['error'] = "Error: " . $conn->error;
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