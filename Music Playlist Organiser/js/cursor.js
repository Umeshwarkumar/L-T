// js/cursor.js

$(document).ready(function() {
    // Custom Glowing Cursor Effect
    // 1. Create the cursor element once and add it to the body
    // We check if it exists first to avoid adding it multiple times
    if ($('.custom-cursor').length === 0) {
        const customCursor = $('<div class="custom-cursor"></div>');
        $('body').append(customCursor);
    }
    const customCursor = $('.custom-cursor');

    // 2. Update its position on mousemove
    $(document).on('mousemove', function(e) {
        customCursor.css({
            left: e.pageX,
            top: e.pageY
        });
    });

    // 3. Add interactive states (e.g., make it bigger on hover)
    $(document).on('mouseover', 'a, button, .playlist-card, input, select', function() {
        customCursor.addClass('active');
    }).on('mouseout', 'a, button, .playlist-card, input, select', function() {
        customCursor.removeClass('active');
    });
});
