(function () {
    'use strict';

    const galleryControls = (function () {
        const imagesContainer = document.querySelector('.images-container');
        const images = imagesContainer ? imagesContainer.querySelectorAll('img') : [];
        const leftArrow = document.getElementById('left-arrow');
        const rightArrow = document.getElementById('right-arrow');
        const dotsContainer = document.querySelector('.dots-container');
        const gallery = document.querySelector('.gallery');
        let currentIndex = 0;
        let autoSlideTimeout;

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
                rightArrow.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
            }
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
            if (imagesContainer && images.length > 0) {
                imagesContainer.style.transform = `translateX(-${currentIndex * 100}vw)`;
                updateArrows();
                updateDots();
                resetAutoSlide();
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

        function toggleMenu() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('active');
        }

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function init() {
            if (images.length === 0) {
                console.error('No images found in gallery.');
                return;
            }
            updateArrows();
            updateDots();
            startAutoSlide();

            if (leftArrow) leftArrow.addEventListener('click', slideLeft);
            if (rightArrow) rightArrow.addEventListener('click', slideRight);

            if (gallery) {
                gallery.addEventListener('mouseenter', () => clearTimeout(autoSlideTimeout));
                gallery.addEventListener('mouseleave', () => startAutoSlide());
                gallery.addEventListener('touchstart', () => clearTimeout(autoSlideTimeout));
                gallery.addEventListener('touchend', () => startAutoSlide());
            }

            window.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') slideLeft();
                else if (e.key === 'ArrowRight') slideRight();
            });
        }

        document.addEventListener('DOMContentLoaded', init);

        return { toggleMenu, scrollToTop };
    })();

    window.toggleMenu = galleryControls.toggleMenu;
    window.scrollToTop = galleryControls.scrollToTop;

    // EmailJS Donation Handling
    function sendEmailToBoth() {
        const donorName = document.getElementById('name')?.value;
        const donorEmail = document.getElementById('email')?.value;
        const donorAmount = document.getElementById('amount')?.value;

        // Email to NGO Owner
        emailjs.send('service_ou9h6z4', 'template_slw0vbb', {
            name: donorName,
            email: donorEmail,
            amount: donorAmount,
            to_email: 'srijansarv1345@gmail.com'
        }).then(() => {
            console.log('NGO email sent!');
        }).catch(error => {
            console.error('Error sending NGO email:', error);
        });

        // Email to Donor
        emailjs.send('service_ou9h6z4', 'template_b2unv72', {
            name: donorName,
            amount: donorAmount,
            email: donorEmail
        }).then(() => {
            console.log('Client email sent!');
        }).catch(error => {
            console.error('Error sending client email:', error);
        });
    }

    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const loadingMessage = document.getElementById('loadingMessage');
            const confirmationMessage = document.getElementById('confirmationMessage');

            if (loadingMessage) loadingMessage.style.display = 'block';
            setTimeout(() => {
                if (loadingMessage) loadingMessage.style.display = 'none';
                if (confirmationMessage) confirmationMessage.style.display = 'block';
                sendEmailToBoth();
                donationForm.reset();
                setTimeout(() => {
                    if (confirmationMessage) confirmationMessage.style.display = 'none';
                }, 5000);
            }, 2000);
        });
    }

    // Adopt Gallery Dynamic Content
    const adoptGallery = document.getElementById('gallery');
    if (adoptGallery) {
        const animals = [
            { name: 'Bella', type: 'dog', location: 'Delhi', image: 'bella.png' },
            { name: 'Luna', type: 'cat', location: 'Mumbai', image: 'luna.png' },
            { name: 'Max', type: 'dog', location: 'Bangalore', image: 'max.png' }
        ];

        function renderGallery(animals) {
            adoptGallery.innerHTML = '';
            animals.forEach(animal => {
                const item = document.createElement('div');
                item.classList.add('adopt-item');
                item.innerHTML = `
                    <img src="${animal.image}" alt="${animal.name}" loading="lazy">
                    <p>${animal.name} - ${animal.type} (${animal.location})</p>
                `;
                adoptGallery.appendChild(item);
            });
        }

        function filterAnimals() {
            const searchInput = document.getElementById('searchInput')?.value.toLowerCase();
            const filterType = document.getElementById('filterType')?.value;

            const filteredAnimals = animals.filter(animal => {
                const matchesSearch = animal.name.toLowerCase().includes(searchInput) || animal.location.toLowerCase().includes(searchInput);
                const matchesType = filterType === 'all' || animal.type === filterType;
                return matchesSearch && matchesType;
            });

            renderGallery(filteredAnimals);
        }

        document.getElementById('searchInput')?.addEventListener('input', filterAnimals);
        document.getElementById('filterType')?.addEventListener('change', filterAnimals);
        renderGallery(animals);
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const loadingMessage = document.getElementById('contactLoading');
            const successMessage = document.getElementById('contactSuccess');
            const errorMessage = document.getElementById('contactError');

            if (loadingMessage) loadingMessage.style.display = 'block';
            setTimeout(() => {
                if (loadingMessage) loadingMessage.style.display = 'none';
                if (successMessage) successMessage.style.display = 'block';
                const contactName = document.getElementById('contactName')?.value;
                const contactEmail = document.getElementById('contactEmail')?.value;
                const contactPhone = document.getElementById('contactPhone')?.value;
                const contactSubject = document.getElementById('contactSubject')?.value;
                const contactMessage = document.getElementById('contactMessage')?.value;

                emailjs.send('service_ou9h6z4', 'template_slw0vbb', {
                    name: contactName,
                    email: contactEmail,
                    phone: contactPhone,
                    subject: contactSubject,
                    message: contactMessage,
                    to_email: 'srijansarv1345@gmail.com'
                }).then(() => {
                    console.log('Contact email sent!');
                }).catch(error => {
                    console.error('Error sending contact email:', error);
                });

                contactForm.reset();
                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'none';
                }, 5000);
            }, 2000);
        });
    }
})();
