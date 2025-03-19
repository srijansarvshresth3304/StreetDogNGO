(function () {
    'use strict';

    const galleryControls = (function () {
        const imagesContainer = document.querySelector('.images-container');
        const images = imagesContainer
            ? imagesContainer.querySelectorAll('img')
            : [];
        const leftArrow = document.getElementById('left-arrow');
        const rightArrow = document.getElementById('right-arrow');
        const dotsContainer = document.querySelector('.dots-container');
        const gallery = document.querySelector('.gallery');
        let currentIndex = 0;
        let autoSlideTimeout;

        // Debug: Log initial values
        console.log('Images found:', images.length);
        console.log('Left Arrow:', leftArrow);
        console.log('Right Arrow:', rightArrow);

        function debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        function updateArrows() {
            if (leftArrow && rightArrow) {
                leftArrow.style.display = currentIndex === 0 ? 'none' : 'block';
                rightArrow.style.display =
                    currentIndex === images.length - 1 ? 'none' : 'block';
            }
        }

        function slideLeft() {
            console.log('Sliding Left, Current Index:', currentIndex); // Debug
            if (currentIndex > 0) {
                currentIndex--;
                updateGallery();
            } else {
                console.log('At start, cannot slide left');
            }
        }

        function slideRight() {
            console.log('Sliding Right, Current Index:', currentIndex); // Debug
            if (currentIndex < images.length - 1) {
                currentIndex++;
                updateGallery();
            } else {
                console.log('At end, cannot slide right');
            }
        }

        function updateGallery() {
            if (imagesContainer && images.length > 0) {
                imagesContainer.style.transform = `translateX(-${
                    currentIndex * 100
                }vw)`;
                updateArrows();
                updateDots();
                resetAutoSlide();
                console.log('Gallery updated to index:', currentIndex); // Debug
            } else {
                console.error('No images or container found');
            }
        }

        function startAutoSlide() {
            autoSlideTimeout = setTimeout(() => {
                currentIndex = (currentIndex + 1) % images.length;
                updateGallery();
                startAutoSlide();
            }, 5000);
        }

        function resetAutoSlide() {
            clearTimeout(autoSlideTimeout);
            startAutoSlide();
        }

        function updateDots() {
            if (dotsContainer && images.length > 0) {
                dotsContainer.innerHTML = '';
                images.forEach((_, index) => {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    dot.setAttribute('role', 'tab');
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    }
                    dot.addEventListener('click', () => {
                        currentIndex = index;
                        updateGallery();
                    });
                    dotsContainer.appendChild(dot);
                });
            }
        }

        function openDonateModal() {
            alert('Donate modal would open here! (Add your donation logic)');
        }

        function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('active');
        }

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function smoothScroll(event, targetId) {
            event.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
            }
        }

        // Initialize when DOM is fully loaded
        function init() {
            if (images.length === 0) {
                console.error(
                    'No images found in gallery. Check HTML structure.'
                );
                return;
            }
            updateArrows();
            updateDots();
            startAutoSlide();

            // Ensure arrows are clickable
            if (leftArrow) leftArrow.addEventListener('click', slideLeft);
            if (rightArrow) rightArrow.addEventListener('click', slideRight);

            // Event Listeners
            gallery.addEventListener('mouseenter', () =>
                clearTimeout(autoSlideTimeout)
            );
            gallery.addEventListener('mouseleave', () => startAutoSlide());
            gallery.addEventListener('touchstart', () =>
                clearTimeout(autoSlideTimeout)
            );
            gallery.addEventListener('touchend', () => startAutoSlide());
            window.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') slideLeft();
                else if (e.key === 'ArrowRight') slideRight();
            });
        }

        // Run init when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);

        return { openDonateModal, toggleMenu, scrollToTop, smoothScroll };
    })();

    // Expose functions globally for HTML onclick
    window.toggleMenu = galleryControls.toggleMenu;
    window.smoothScroll = galleryControls.smoothScroll;
    window.scrollToTop = galleryControls.scrollToTop;
    window.openDonateModal = galleryControls.openDonateModal;
})();
