/* =====================================================
   LENDEX – PORTFÓLIO PESSOAL  |  script.js
   ===================================================== */

// ========== NAVBAR SCROLL ==========
const mainNav  = document.getElementById('mainNav');
const scrollBtn = document.getElementById('scrollTop');

function updateNavHeight() {
    document.documentElement.style.setProperty('--nav-h', mainNav.offsetHeight + 'px');
}
updateNavHeight();

window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
        mainNav.classList.add('scrolled');
        scrollBtn.classList.add('visible');
    } else {
        mainNav.classList.remove('scrolled');
        scrollBtn.classList.remove('visible');
    }
    updateNavHeight();
}, { passive: true });

// ========== SMOOTH SCROLL NAV LINKS ==========
function scrollToSection(target) {
    const navHeight = document.getElementById('mainNav').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            scrollToSection(target);
        }
        // Fechar menu mobile
        const navCollapse = document.getElementById('navbarNav');
        if (navCollapse && navCollapse.classList.contains('show')) {
            new bootstrap.Collapse(navCollapse).hide();
        }
    });
});

// ========== ACTIVE NAV LINK ON SCROLL ==========
window.addEventListener('scroll', function () {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.navbar-nav .nav-link');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}, { passive: true });

// ========== FADE IN ON SCROLL ==========
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
} else {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
}

// ========== SKILL BARS ANIMATION ==========
if (!prefersReducedMotion) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.fill').forEach(bar => {
                    bar.classList.add('animated');
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.about-section, .skills-section').forEach(el => skillObserver.observe(el));
} else {
    document.querySelectorAll('.fill').forEach(bar => bar.classList.add('animated'));
}

// ========== COUNTER ANIMATION ==========
const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const suffix  = '+';
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.about-stat-num[data-target]').forEach(animateCounter);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.about-section').forEach(el => counterObserver.observe(el));

// ========== HERO STATS COUNTER ==========
const heroAnimateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const suffix  = '+';
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
};

const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.hero-stat-num[data-target]').forEach(heroAnimateCounter);
            heroStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.hero-stats').forEach(el => heroStatsObserver.observe(el));

// ========== CAROUSEL SETUP — fixa a altura antes de esconder slides ==========
function initCarousel(carouselId, dotsId, prevId, nextId, sectionId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    const section = document.getElementById(sectionId);
    const slides  = carousel.querySelectorAll('.portfolio-slide');
    const dotsEl  = document.getElementById(dotsId);
    const dots    = dotsEl ? dotsEl.querySelectorAll('.dot') : [];
    let cur = 0;

    // 1. Mostra todos para medir a maior altura
    slides.forEach(s => { s.style.display = 'block'; s.style.position = 'static'; });
    const maxH = Math.max(...Array.from(slides).map(s => s.offsetHeight));
    // 2. Trava a altura do container
    carousel.style.minHeight = maxH + 'px';
    // 3. Esconde todos menos o primeiro
    slides.forEach((s, i) => {
        s.style.position = '';
        s.style.display  = '';
        if (i !== 0) s.classList.remove('active');
        else         s.classList.add('active');
    });
    if (dots.length) dots.forEach((d, i) => i === 0 ? d.classList.add('active') : d.classList.remove('active'));

    function scrollToNav() {
        if (!section) return;
        const navHeight = mainNav.offsetHeight;
        const top = section.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    function goTo(index) {
        slides[cur].classList.remove('active');
        if (dots.length) dots[cur].classList.remove('active');
        cur = ((index % slides.length) + slides.length) % slides.length;
        slides[cur].classList.add('active');
        if (dots.length) dots[cur].classList.add('active');
        carousel.style.minHeight = slides[cur].scrollHeight + 'px';
        scrollToNav();
    }

    document.getElementById(prevId).addEventListener('click', e => { e.preventDefault(); goTo(cur - 1); });
    document.getElementById(nextId).addEventListener('click', e => { e.preventDefault(); goTo(cur + 1); });
    dots.forEach(dot => dot.addEventListener('click', e => { e.preventDefault(); goTo(+dot.dataset.index); }));
}

// ========== PORTFOLIO CAROUSEL ==========
initCarousel('portfolioCarousel', 'carouselDots', 'prevBtn', 'nextBtn', 'portfolio');

// ========== TESTIMONIAL CAROUSEL ==========
initCarousel('testimonialCarousel', 'testimonialDots', 'testimonialPrev', 'testimonialNext', 'testimonials');

// ========== NEWSLETTER SUBMIT ==========
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('newsletterEmail');
    if (input.checkValidity()) {
        const btn = e.target.querySelector('.btn-subscribe');
        btn.textContent = 'Assinado!';
        btn.style.background = 'var(--accent-green)';
        btn.style.borderColor = 'var(--accent-green)';
        input.value = '';
        setTimeout(() => {
            btn.textContent = 'Assinar Agora';
            btn.style.background = '';
            btn.style.borderColor = '';
        }, 3000);
    } else {
        input.reportValidity();
    }
}
