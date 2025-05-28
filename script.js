(function () {
    'use strict';

    // Ensure EmailJS is initialized once DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        emailjs.init('8sYByyvq4OhVG4hZn');  // Make sure this key is correct
        galleryInit();  // Call updated gallery init function
    });

    // 📸 GALLERY SLIDER LOGIC
    const galleryControls = (function () {
        const imagesContainer = document.querySelector('.images-container');
        const images = imagesContainer ? imagesContainer.querySelectorAll('img') : [];
        const leftArrow = document.querySelector('#left-arrow');
        const rightArrow = document.querySelector('#right-arrow');
        const dotsContainer = document.querySelector('.dots-container');
        const gallery = document.querySelector('.gallery');
        let currentIndex = 0;
        let autoSlideTimeout;

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
                const imageWidth = images[0].offsetWidth;
                imagesContainer.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
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
                    if (index === currentIndex) dot.classList.add('active');
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
            navLinks?.classList.toggle('active');
        }

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function galleryInit() {
            if (images.length === 0) {
                console.error('No images found in gallery.');
                return;
            }

            updateArrows();
            updateDots();
            startAutoSlide();

            leftArrow?.addEventListener('click', slideLeft);
            rightArrow?.addEventListener('click', slideRight);

            gallery?.addEventListener('mouseenter', () => clearTimeout(autoSlideTimeout));
            gallery?.addEventListener('mouseleave', startAutoSlide);
            gallery?.addEventListener('touchstart', () => clearTimeout(autoSlideTimeout));
            gallery?.addEventListener('touchend', startAutoSlide);

            window.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') slideLeft();
                if (e.key === 'ArrowRight') slideRight();
            });
        }

        return { toggleMenu, scrollToTop, galleryInit };
    })();

    const { toggleMenu, scrollToTop, galleryInit } = galleryControls;
    window.toggleMenu = toggleMenu;
    window.scrollToTop = scrollToTop;

    // 📧 EMAILJS FOR DONATIONS - UPDATED WITH PROPER TEMPLATE PARAMS
    function sendEmailToBoth(name, email, amount) {
        const currentTime = new Date().toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true
        });

        const emailData = {
            service_id: 'service_g0hhe8n',        // ✅ Your EmailJS service ID
            template_id: 'template_osqwphg',      // ✅ Your EmailJS template ID
            user_id: '8sYByyvq4OhVG4hZn',         // ✅ Your public key
            template_params: {
                name: name,                       // Must match {{name}} in EmailJS template
                amount: amount,                   // Must match {{amount}}
                time: currentTime,                // Must match {{time}}
                to_email: email                   // Must match {{to_email}}
            }
        };

        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        })
        .then(async response => {
            if (response.ok) {
                console.log('Email sent successfully!');
                alert('Thank you! We have received your request.');
            } else {
                const errorText = await response.text();
                console.error('Error response from EmailJS:', errorText);
                alert('Error sending email: ' + errorText);
            }
        })
        .catch(error => {
            console.error('Network or other error:', error);
            alert('Oops! Something went wrong: ' + error.message);
        });
        
    }

    // 🧾 HANDLE DONATION FORM
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const amount = document.getElementById('amount')?.value;
            const loadingMessage = document.getElementById('loadingMessage');
            const confirmationMessage = document.getElementById('confirmationMessage');

            if (loadingMessage) loadingMessage.style.display = 'block';

            setTimeout(() => {
                if (loadingMessage) loadingMessage.style.display = 'none';
                if (confirmationMessage) confirmationMessage.style.display = 'block';

                sendEmailToBoth(name, email, amount);
                donationForm.reset();

                setTimeout(() => {
                    if (confirmationMessage) confirmationMessage.style.display = 'none';
                }, 5000);
            }, 2000);
        });
    }

    // 🐶 ADOPT GALLERY
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
            const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';
            const filterType = document.getElementById('filterType')?.value || 'all';

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

    // 📬 CONTACT FORM
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const loadingMessage = document.getElementById('contactLoading');
            const successMessage = document.getElementById('contactSuccess');

            if (loadingMessage) loadingMessage.style.display = 'block';

            setTimeout(() => {
                if (loadingMessage) loadingMessage.style.display = 'none';
                if (successMessage) successMessage.style.display = 'block';

                const contactName = document.getElementById('contactName')?.value;
                const contactEmail = document.getElementById('contactEmail')?.value;
                const contactPhone = document.getElementById('contactPhone')?.value;
                const contactSubject = document.getElementById('contactSubject')?.value;
                const contactMessage = document.getElementById('contactMessage')?.value;

                emailjs.send('service_g0hhe8n', 'template_osqwphg', {
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
