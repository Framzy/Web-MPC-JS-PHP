<?php
session_start();

// Mengaktifkan Gzip Compression
if (!ob_start("ob_gzhandler")) {
    ob_start();
}

// Mengatur caching agar lebih optimal (1 hari)
header("Cache-Control: max-age=86400, public");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MPC | Master Piece Cinematography</title>

    <!-- CDN Stylesheets -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css"
        crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css"
        crossorigin="anonymous">

    <!-- Local Styles -->
    <link rel="stylesheet" href="css/global.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="css/homePage.css">
    <link rel="stylesheet" href="css/searchPage.css">
    <link rel="stylesheet" href="css/savePage.css">
    <link rel="stylesheet" href="css/popup.css">
    <link rel="icon" href="src/logo/mpc_logo.png">
</head>

<body>
    <div class="main-container">
        <!-- Header Section -->
        <header class="header-section">
            <div class="header-navbar">
                <div class="homePage-Icon" id="homePageButton">
                    <img src="src/logo/mpc_logo.png" alt="">
                </div>

                <div class="form-pencarian" id="searchPageButton">
                    <?php include 'layout/pencarianForm.html'?>
                </div>

                <div class="header-right">
                    <div class="menu-toggle">
                        <input type="checkbox">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <button type="button" class="btn btn-primary btnSavedPage" id="savePageButton">
                        <span class="icon-wrapper">
                            <img src="src/icon/saveHeader.png" alt="">
                        </span>
                        <div><span>Simpan</span></div>
                    </button>

                    <button type="button" class="btn btn-primary btnLogin" id="popupLoginButton">Login</button>
                    <div class="dropdown-center profile" id="profileButton">
                        <?php include 'layout/profileButton.html'?>
                    </div>
                </div>
            </div>
        </header>

        <!-- Container Section -->
        <section class="container-section">
            <!-- HomePage -->
            <div class="home-page active" id="homeContainer">
                <?php include 'layout/homePage.html'?>
            </div>

            <!-- SearchPage -->
            <div class="search-page active" id="searchContainer">
                <?php include 'layout/searchPage.html'?>
            </div>

            <!-- SavePage -->
            <div class="save-page active" id="saveContainer">
                <?php include 'layout/savePage.html'?>
            </div>
        </section>
    </div>

    <?php include 'layout/popupLogin.html'?>

    <!-- CDN Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js" defer></script>

    <!-- Local Scripts -->
    <script src="js/global.js" defer></script>
    <script src="js/auth.js" defer></script>
    <script src="js/homepage.js" defer></script>
    <script src="js/searchPage.js" defer></script>
    <script src="js/savePage.js" defer></script>
    <script src="js/main.js" defer></script>

</body>

</html>

<?php ob_end_flush(); // Kirim output setelah dikompresi ?>