const imagesContainer = document.querySelector('.images-container');
const images = imagesContainer.querySelectorAll('img');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
const dotsContainer = document.querySelector('.dots-container');
let currentIndex = 0;
let autoSlideTimeout;

function updateArrows() {
    leftArrow.style.display = currentIndex === 0 ? 'none' : 'block';
    rightArrow.style.display =
        currentIndex === images.length - 1 ? 'none' : 'block';
}

function slideLeft() {
    if (currentIndex > 0) {
        currentIndex--;
        updateGallery();
    }
}

function slideRight() {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        updateGallery();
    }
}

function updateGallery() {
    imagesContainer.style.transform = `translateX(-${currentIndex * 100}vw)`;
    updateArrows();
    updateDots();
    resetAutoSlide();
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

// Initialize gallery
updateArrows();
startAutoSlide();

// Pause auto-slide on hover
const gallery = document.querySelector('.gallery');
gallery.addEventListener('mouseenter', () => {
    clearTimeout(autoSlideTimeout);
});

gallery.addEventListener('mouseleave', () => {
    startAutoSlide();
});

// Update dots
function updateDots() {
    dotsContainer.innerHTML = '';
    images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
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

// Initialize dots
updateDots();

// Keyboard navigation
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        slideLeft();
    } else if (e.key === 'ArrowRight') {
        slideRight();
    }
});

// Scroll to Top Functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

// Smooth Scroll for Navigation Links
function smoothScroll(event, targetId) {
    event.preventDefault();
    const target = document.querySelector(targetId);
    window.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth',
    });
}
