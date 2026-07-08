jQuery(document).ready(function ($) {
    
    //<!-- Header based on reference site -->
    let prevScrollPos = $(window).scrollTop();
    const $header = $('.elementor-location-header');

    $(window).on('scroll', function () {
        setTimeout(() => {
            let currentScrollPos = $(window).scrollTop();

            if (prevScrollPos > currentScrollPos) {
                // Scrolling up, show the header
                $header.css('transform', 'translateY(0)');
            } else if (prevScrollPos < currentScrollPos) {
                if (prevScrollPos > 200) {
                    // Scrolling down, hide the header
                    $header.css('transform', 'translateY(-100%)');
                }
            }

            if (currentScrollPos === 0) {
                // If at the top of the page, instantly show the header
                $header.css('transform', 'translateY(0)');
            }

            prevScrollPos = currentScrollPos;
        }, 250);
    });

    jQuery(".cross-selling-slider").slick({
        slidesToShow: 2,
        infinite: true,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        dots: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    });
    
    
});