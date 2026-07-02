/* ============================================================
   PORTFOLIO — script.js
   Handles: nav scroll, mobile menu, active states,
            scroll reveal, language bars, form validation
   ============================================================ */

'use strict';

/* ── Utilities ─────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ── Year ────────────────────────────────────────────────── */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Sticky Nav scroll behavior ──────────────────────────── */
const header = $('#nav-header');

function handleNavScroll() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run on load

/* ── Active nav links (Intersection Observer) ────────────── */
const sections = $$('section[id], header[id]');
const navLinks = $$('.nav-link');

function getSectionId(entry) {
  return entry.target.id;
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = getSectionId(entry);
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  },
  {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  }
);

sections.forEach((sec) => sectionObserver.observe(sec));

/* ── Mobile Menu ─────────────────────────────────────────── */
const menuToggle = $('#menu-toggle');
const mobileMenu = $('#mobile-menu');
const menuBars = $$('.menu-bar');
let menuOpen = false;

function toggleMenu(forceClose = false) {
  menuOpen = forceClose ? false : !menuOpen;
  menuToggle.setAttribute('aria-expanded', String(menuOpen));

  if (menuOpen) {
    mobileMenu.classList.remove('hidden');
    requestAnimationFrame(() => mobileMenu.classList.add('open'));
    // Animate hamburger to X
    if (menuBars[0]) menuBars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    if (menuBars[1]) menuBars[1].style.opacity = '0';
    if (menuBars[2]) {
      menuBars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      menuBars[2].style.width = '24px';
    }
  } else {
    mobileMenu.classList.remove('open');
    setTimeout(() => {
      if (!menuOpen) mobileMenu.classList.add('hidden');
    }, 350);
    // Reset hamburger
    if (menuBars[0]) menuBars[0].style.transform = '';
    if (menuBars[1]) menuBars[1].style.opacity = '';
    if (menuBars[2]) {
      menuBars[2].style.transform = '';
      menuBars[2].style.width = '';
    }
  }
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => toggleMenu());
}

// Close mobile menu on link click
$$('.mobile-nav-link').forEach((link) => {
  link.addEventListener('click', () => toggleMenu(true));
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (menuOpen && !header.contains(e.target)) {
    toggleMenu(true);
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) toggleMenu(true);
});

/* ── Smooth scroll for all anchor links ──────────────────── */
$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = $(targetId);
    if (!target) return;
    e.preventDefault();
    const headerHeight = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Scroll Reveal ───────────────────────────────────────── */
const revealElements = $$('.timeline-card, .skill-card, .contact-form-card, .contact-info-link, .cred-card');

revealElements.forEach((el) => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ── Language Bar Animations ─────────────────────────────── */
const langFills = $$('.lang-fill');

const langObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        langObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

langFills.forEach((bar) => langObserver.observe(bar));

/* ── Staggered reveal for skill cards ───────────────────── */
const skillCards = $$('.skill-card');
skillCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

/* ── Contact Form ─────────────────────────────────────────── */
const form = $('#contact-form');
const submitBtn = $('#submit-btn');
const btnText = $('#btn-text');
const btnIcon = $('#btn-icon');
const btnSpinner = $('#btn-spinner');
const formSuccess = $('#form-success');

function getField(id) {
  return $(`#${id}`);
}

function getError(id) {
  return $(`#${id}-error`);
}

function setError(fieldId, message) {
  const field = getField(fieldId);
  const err = getError(fieldId);
  if (field) field.classList.add('error');
  if (err) err.textContent = message;
}

function clearError(fieldId) {
  const field = getField(fieldId);
  const err = getError(fieldId);
  if (field) field.classList.remove('error');
  if (err) err.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  let valid = true;

  // Name
  const name = getField('name');
  if (!name || !name.value.trim()) {
    setError('name', 'Please enter your full name.');
    valid = false;
  } else if (name.value.trim().length < 2) {
    setError('name', 'Name must be at least 2 characters.');
    valid = false;
  } else {
    clearError('name');
  }

  // Email
  const email = getField('email');
  if (!email || !email.value.trim()) {
    setError('email', 'Please enter your email address.');
    valid = false;
  } else if (!validateEmail(email.value.trim())) {
    setError('email', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError('email');
  }

  // Subject
  const subject = getField('subject');
  if (!subject || !subject.value.trim()) {
    setError('subject', 'Please enter a subject.');
    valid = false;
  } else {
    clearError('subject');
  }

  // Message
  const message = getField('message');
  if (!message || !message.value.trim()) {
    setError('message', 'Please write a message.');
    valid = false;
  } else if (message.value.trim().length < 10) {
    setError('message', 'Message is too short (minimum 10 characters).');
    valid = false;
  } else {
    clearError('message');
  }

  return valid;
}

// Live validation on blur
['name', 'email', 'subject', 'message'].forEach((id) => {
  const field = getField(id);
  if (!field) return;
  field.addEventListener('blur', () => validateForm());
  field.addEventListener('input', () => {
    // Clear error on typing after blur
    if (field.classList.contains('error')) {
      clearError(id);
    }
  });
});

// Form submission
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.8';
    btnText.textContent = 'Sending...';
    btnIcon.classList.add('hidden');
    btnSpinner.classList.remove('hidden');

    // Simulate async send (replace with real fetch to a backend/form service)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Success state
    submitBtn.style.display = 'none';
    formSuccess.classList.remove('hidden');
    form.reset();

    // Reset button after 5 seconds (in case user wants to send again)
    setTimeout(() => {
      submitBtn.style.display = '';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      btnText.textContent = 'Send Message';
      btnIcon.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
      formSuccess.classList.add('hidden');
    }, 5000);
  });
}

/* ── About section stats counter animation ───────────────── */
function animateCounter(el, target, duration = 1200) {
  const isPercent = el.textContent.includes('%');
  const prefix = el.textContent.replace(/[0-9+%]/g, '').trim().replace(target.toString(), '');
  let start = 0;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + (isPercent ? '%' : '+');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statEls = $$('.font-display.text-3xl.font-800.text-indigo-400');
const statValues = [2, 3, 100]; // matches the stat numbers
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statEls.forEach((el, i) => {
        const val = statValues[i];
        if (val !== undefined) animateCounter(el, val);
      });
    }
  },
  { threshold: 0.5 }
);

const aboutStats = $('.grid.grid-cols-3');
if (aboutStats) statsObserver.observe(aboutStats);

/* ── Keyboard navigation for nav ─────────────────────────── */
const firstNavLink = $('.nav-link');
const lastNavCta = $('header .cta-secondary, header a[href^="mailto"]');

/* ── Performance: lazy load profile image ────────────────── */
const profileImg = $('.profile-img');
if (profileImg && 'loading' in HTMLImageElement.prototype) {
  profileImg.setAttribute('loading', 'lazy');
}
