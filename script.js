// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Trigger hero reveals immediately on load
document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));

// ── MOBILE MENU ──
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeBtn = mobileMenu.querySelector('.close-btn');
const mobileLinks = mobileMenu.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.add('open');
});

closeBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});
