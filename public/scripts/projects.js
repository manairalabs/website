/* =====================================================
   PROJECTS PAGE JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ----- Gallery Functionality -----
    const galleries = document.querySelectorAll('.project-gallery');

    galleries.forEach(gallery => {
        const mainImages = gallery.querySelectorAll('.gallery-image');
        const thumbs = gallery.querySelectorAll('.thumb');

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = thumb.dataset.index;

                // Update active states
                mainImages.forEach(img => img.classList.remove('active'));
                thumbs.forEach(t => t.classList.remove('active'));

                // Show selected image
                const targetImage = gallery.querySelector(`.gallery-image[data-index="${index}"]`);
                if (targetImage) {
                    targetImage.classList.add('active');
                }
                thumb.classList.add('active');
            });
        });

        // Auto-rotate gallery every 5 seconds
        let currentIndex = 0;
        const totalImages = mainImages.length;

        if (totalImages > 1) {
            setInterval(() => {
                // Only auto-rotate if user hasn't interacted recently
                currentIndex = (currentIndex + 1) % totalImages;

                mainImages.forEach(img => img.classList.remove('active'));
                thumbs.forEach(t => t.classList.remove('active'));

                mainImages[currentIndex].classList.add('active');
                thumbs[currentIndex].classList.add('active');
            }, 5000);
        }
    });

    // ----- Scroll Reveal Animation -----
    const projectCards = document.querySelectorAll('.project-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projectCards.forEach(card => {
        observer.observe(card);
    });

    // ----- Smooth Scroll for Anchor Links -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ----- Lazy Load YouTube Iframes -----
    const videoWrappers = document.querySelectorAll('.video-wrapper');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target.querySelector('iframe');
                if (iframe && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                }
                videoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    videoWrappers.forEach(wrapper => {
        videoObserver.observe(wrapper);
    });

});
