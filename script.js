/* =============================================
   ROYAL DÉCOR WEDDINGS — JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    function handleNavScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ===== MOBILE NAV TOGGLE =====
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ===== GALLERY FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach((item, index) => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                    item.style.animation = `fadeInUp 0.5s ease ${index * 0.08}s both`;
                } else {
                    item.style.display = 'none';
                    item.style.animation = '';
                }
            });
        });
    });

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxInfo = document.getElementById('lightbox-info');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    let currentLightboxIndex = 0;
    let visibleItems = [];

    function getVisibleGalleryItems() {
        return Array.from(galleryItems).filter(item => item.style.display !== 'none');
    }

    function openLightbox(index) {
        visibleItems = getVisibleGalleryItems();
        currentLightboxIndex = index;
        const item = visibleItems[index];
        const img = item.querySelector('img');
        const overlayH4 = item.querySelector('.gallery-overlay h4');

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxInfo.textContent = overlayH4 ? overlayH4.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        visibleItems = getVisibleGalleryItems();
        currentLightboxIndex = (currentLightboxIndex + direction + visibleItems.length) % visibleItems.length;
        const item = visibleItems[currentLightboxIndex];
        const img = item.querySelector('img');
        const overlayH4 = item.querySelector('.gallery-overlay h4');

        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxInfo.textContent = overlayH4 ? overlayH4.textContent : '';
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const visList = getVisibleGalleryItems();
            const visIndex = visList.indexOf(item);
            openLightbox(visIndex >= 0 ? visIndex : 0);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ===== FORM VALIDATION & SUBMISSION =====
    const form = document.getElementById('bookingForm');
    const formSuccess = document.getElementById('formSuccess');

    function showError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (field) field.classList.add('error');
        if (error) error.textContent = message;
    }

    function clearError(fieldId, errorId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (field) field.classList.remove('error');
        if (error) error.textContent = '';
    }

    function validateForm() {
        let isValid = true;

        // Name
        const name = document.getElementById('name').value.trim();
        if (!name) {
            showError('name', 'nameError', 'Please enter your name');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'nameError', 'Name must be at least 2 characters');
            isValid = false;
        } else {
            clearError('name', 'nameError');
        }

        // Phone
        const phone = document.getElementById('phone').value.trim();
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phone) {
            showError('phone', 'phoneError', 'Please enter your phone number');
            isValid = false;
        } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showError('phone', 'phoneError', 'Please enter a valid phone number');
            isValid = false;
        } else {
            clearError('phone', 'phoneError');
        }

        // Wedding Date
        const weddingDate = document.getElementById('weddingDate').value;
        if (!weddingDate) {
            showError('weddingDate', 'dateError', 'Please select your wedding date');
            isValid = false;
        } else {
            const selectedDate = new Date(weddingDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                showError('weddingDate', 'dateError', 'Date must be in the future');
                isValid = false;
            } else {
                clearError('weddingDate', 'dateError');
            }
        }

        return isValid;
    }

    // Real-time validation
    ['name', 'phone', 'weddingDate'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => {
                validateForm();
            });
            field.addEventListener('input', () => {
                const errorId = fieldId === 'weddingDate' ? 'dateError' :
                               fieldId === 'name' ? 'nameError' : 'phoneError';
                clearError(fieldId, errorId);
            });
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Show loading
        const btnText = form.querySelector('.btn-text');
        const btnLoading = form.querySelector('.btn-loading');
        const submitBtn = document.getElementById('submit-btn');
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;

        // Simulate submission (replace with actual API call)
        setTimeout(() => {
            form.style.display = 'none';
            formSuccess.style.display = 'block';
            formSuccess.style.animation = 'fadeInUp 0.5s ease both';
        }, 1500);
    });

    // ===== SCROLL REVEAL ANIMATIONS =====
    const animateElements = document.querySelectorAll(
        '.service-card, .gallery-item, .why-card, .testimonial-card, .about-feature, .contact-card'
    );

    animateElements.forEach(el => el.classList.add('animate-on-scroll'));

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // ===== COUNTER ANIMATION (Hero trust numbers) =====
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const suffix = element.textContent.includes('+') ? '+' : '';

        function updateCounter() {
            start += increment;
            if (start >= target) {
                element.textContent = target + suffix;
                return;
            }
            element.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(updateCounter);
        }
        updateCounter();
    }

    const trustObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.trust-number');
                numbers.forEach(num => {
                    const text = num.textContent;
                    const value = parseInt(text);
                    if (value) {
                        num.textContent = '0+';
                        animateCounter(num, value);
                    }
                });
                trustObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroTrust = document.querySelector('.hero-trust');
    if (heroTrust) trustObserver.observe(heroTrust);

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ===== PARALLAX EFFECT ON HERO =====
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(${1 + scrolled * 0.0003}) translateY(${scrolled * 0.3}px)`;
            }
        }, { passive: true });
    }

    // ===== SET MIN DATE FOR WEDDING DATE INPUT =====
    const dateInput = document.getElementById('weddingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // ===== LIGHTBOX IMAGE TRANSITION =====
    if (lightboxImg) {
        lightboxImg.style.transition = 'opacity 0.3s ease';
    }
});
