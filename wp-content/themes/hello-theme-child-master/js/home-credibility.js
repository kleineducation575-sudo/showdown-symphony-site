jQuery(document).ready(function($) {
    // Optional smooth fade animation
    $('.cred-usp-block').hover(
        function() {
            $(this).find('.cred-usp-popup').stop(true, true).fadeIn(200);
        },
        function() {
            $(this).find('.cred-usp-popup').stop(true, true).fadeOut(200);
        }
    );
});
