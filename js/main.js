document.addEventListener("DOMContentLoaded", function() {
    // Fetch all data when the page loads
    isLoggedIn();
    fetchDataListFilm();
    updateSaveStatusForAllFilms();
    fetchAndCreateSlides();
    fetchAndCreateRecommendation();

    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle input');
    const navbar = document.querySelector('.form-pencarian');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', function() {
            navbar.classList.toggle('slide');
            console.log("get click");
        });
    }
});
