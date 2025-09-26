// js/playlist.js
$(document).ready(function() {
    const audioPlayer = $('#audio-player')[0]; // Get the raw HTML5 audio element
    let currentPlaylist = null;
    let currentSongIndex = -1;

    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = parseInt(urlParams.get('id'));

    const playlist = playlists.find(p => p.id === playlistId);

    if (playlist) {
        currentPlaylist = playlist.songs;
        renderPlaylistHeader(playlist);
        renderTracklist(playlist.songs);
    } else {
        $('main.container').html('<h1 class="text-center">Playlist not found!</h1>');
    }

    // Event Delegation for Play/Pause buttons
    $('#tracklist-body').on('click', '.btn-play-pause', function() {
        const songIndex = $(this).data('song-index');
        
        if (songIndex === currentSongIndex) {
            // It's the current song, so just toggle play/pause
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        } else {
            // It's a new song
            currentSongIndex = songIndex;
            const song = currentPlaylist[currentSongIndex];
            audioPlayer.src = song.filePath;
            audioPlayer.play();
        }
    });

    // Update UI when audio starts playing
    $(audioPlayer).on('play', function() {
        updatePlayingUI();
    });

    // Update UI when audio is paused
    $(audioPlayer).on('pause', function() {
        updatePausedUI();
    });

    // Automatically play the next song when one ends
    $(audioPlayer).on('ended', function() {
        playNextSong();
    });

    function playNextSong() {
        currentSongIndex++;
        if (currentSongIndex >= currentPlaylist.length) {
            currentSongIndex = 0; // Loop back to the first song
        }
        const song = currentPlaylist[currentSongIndex];
        audioPlayer.src = song.filePath;
        audioPlayer.play();
    }

    function updatePlayingUI() {
        // Highlight the current song row
        $('#tracklist-body tr').removeClass('now-playing');
        $(`#song-${currentSongIndex}`).addClass('now-playing');

        // Update all buttons to "play" icon
        $('.btn-play-pause i').removeClass('bi-pause-circle-fill').addClass('bi-play-circle-fill');

        // Update the current song's button to "pause" icon
        $(`#song-${currentSongIndex} .btn-play-pause i`).removeClass('bi-play-circle-fill').addClass('bi-pause-circle-fill');
    }

    function updatePausedUI() {
        // Update the current song's button back to "play" icon
        $(`#song-${currentSongIndex} .btn-play-pause i`).removeClass('bi-pause-circle-fill').addClass('bi-play-circle-fill');
    }
});

function renderPlaylistHeader(playlist) {
    const header = $('#playlist-header');
    const totalDuration = calculateTotalDuration(playlist.songs);

    const headerHtml = `
        <div class="col-md-3 text-center text-md-start">
            <img src="${playlist.cover}" id="playlist-cover" class="img-fluid" alt="${playlist.title}">
        </div>
        <div class="col-md-9 text-center text-md-start mt-3 mt-md-0">
            <h1 class="display-4">${playlist.title}</h1>
            <p class="lead text-body-secondary">${playlist.description}</p>
            <p>
                <span class="badge bg-primary">${playlist.songs.length} songs</span>
                <span class="badge bg-secondary">${totalDuration}</span>
            </p>
        </div>
    `;
    header.html(headerHtml);
}

function renderTracklist(songs) {
    const tracklistBody = $('#tracklist-body');
    tracklistBody.empty();

    songs.forEach((song, index) => {
        const rowHtml = `
            <tr id="song-${index}">
                <th scope="row">
                    <button class="action-btn btn-play-pause" data-song-index="${index}" title="Play">
                        <i class="bi bi-play-circle-fill"></i>
                    </button>
                </th>
                <td>${song.title}</td>
                <td>${song.artist}</td>
                <td><span class="badge bg-info-subtle text-info-emphasis">${song.genre}</span></td>
                <td>${song.duration}</td>
                <td class="text-end">
                    <button class="action-btn" title="Edit"><i class="bi bi-pencil-fill"></i></button>
                    <button class="action-btn btn-remove" title="Remove"><i class="bi bi-trash-fill"></i></button>
                </td>
            </tr>
        `;
        tracklistBody.append(rowHtml);
    });

    // Mock functionality for remove button
    $('.action-btn.btn-remove').on('click', function() {
        $(this).closest('tr').fadeOut(300, function() { $(this).remove(); });
    });
}

function calculateTotalDuration(songs) {
    let totalSeconds = 0;
    songs.forEach(song => {
        const parts = song.duration.split(':');
        totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1]);
    });
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
}
