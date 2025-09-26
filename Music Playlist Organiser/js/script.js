// js/script.js
$(document).ready(function() {
    populateFilters();
    renderPlaylists(playlists);

    // Event listeners for filters
    $('#searchInput, #genreFilter, #moodFilter').on('keyup change', function() {
        applyFilters();
    });
});

function populateFilters() {
    const genres = new Set();
    const moods = new Set();
    playlists.forEach(p => {
        p.songs.forEach(s => {
            genres.add(s.genre);
            moods.add(s.mood);
        });
    });

    genres.forEach(genre => {
        $('#genreFilter').append(`<option value="${genre}">${genre}</option>`);
    });

    moods.forEach(mood => {
        $('#moodFilter').append(`<option value="${mood}">${mood}</option>`);
    });
}

function renderPlaylists(playlistsToRender) {
    const grid = $('#playlist-grid');
    grid.empty(); // Clear existing cards

    if (playlistsToRender.length === 0) {
        grid.html('<p class="text-center col-12">No playlists found matching your criteria. 😢</p>');
        return;
    }

    playlistsToRender.forEach(playlist => {
        const cardHtml = `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card playlist-card h-100" data-id="${playlist.id}">
                    <a href="playlist.html?id=${playlist.id}" class="playlist-link">
                        <img src="${playlist.cover}" class="card-img-top" alt="${playlist.title}">
                        <div class="card-body">
                            <h5 class="card-title">${playlist.title}</h5>
                            <p class="card-text">${playlist.description}</p>
                        </div>
                    </a>
                </div>
            </div>
        `;
        grid.append(cardHtml);
    });

    // UPDATED CLICK LOGIC FOR ANIMATION
    $('.playlist-link').on('click', function(e) {
        // Prevent the link from navigating immediately
        e.preventDefault();

        const destination = $(this).attr('href');
        const card = $(this).closest('.playlist-card');

        // Add the animation class to the card
        card.addClass('clicked');

        // Wait for the animation to finish (400ms) before changing the page
        setTimeout(() => {
            window.location.href = destination;
        }, 400); // This duration must match the CSS transition duration
    });
}

function applyFilters() {
    const searchTerm = $('#searchInput').val().toLowerCase();
    const selectedGenre = $('#genreFilter').val();
    const selectedMood = $('#moodFilter').val();

    const filteredPlaylists = playlists.filter(playlist => {
        const titleMatch = playlist.title.toLowerCase().includes(searchTerm);
        const songMatch = playlist.songs.some(song =>
            song.artist.toLowerCase().includes(searchTerm) ||
            song.title.toLowerCase().includes(searchTerm)
        );

        const genreMatch = selectedGenre ? playlist.songs.some(song => song.genre === selectedGenre) : true;
        const moodMatch = selectedMood ? playlist.songs.some(song => song.mood === selectedMood) : true;

        return (titleMatch || songMatch) && genreMatch && moodMatch;
    });

    renderPlaylists(filteredPlaylists);
}
