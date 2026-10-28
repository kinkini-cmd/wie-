// IEEE WIE SLTC Main Application Script

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollSpy();
  initCountdowns();
  initGallery();
  initFAQ();
  initRoadmap();
  initForms();
  initNavbarFade();
  initWelcomeModal();
  initCounterAnimation();
  try {
    initScrollReveal();
  } catch (e) {
    console.error('Error initializing scroll reveal:', e);
  }
  try {
    initBackgroundAnimation();
  } catch (e) {
    console.error('Error initializing background animation:', e);
  }
  try {
    initHeroBackground();
  } catch (e) {
    console.error('Error initializing hero background:', e);
  }
});

// Navigation & Mobile Drawer
function initNavigation() {
  const hamburger = document.getElementById('nav-hamburger');
  const menu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('mobile-open');
      const isOpen = menu.classList.contains('mobile-open');
      document.body.classList.toggle('nav-open', isOpen);
      hamburger.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menu) menu.classList.remove('mobile-open');
      document.body.classList.remove('nav-open');
      if (hamburger) hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

// Scroll Spy - highlight nav link based on scroll position
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

// Navbar bottom line fade on scroll
function initNavbarFade() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;

  function updateNavbarFade() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 50) {
      navbar.classList.add('faded-bottom');
    } else {
      navbar.classList.remove('faded-bottom');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbarFade);
      ticking = true;
    }
  }, { passive: true });

  updateNavbarFade();
}

// Counter Animation for Annual Highlights
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let hasAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        if (target >= 100) {
          counter.textContent = current + '+';
        } else {
          counter.textContent = current;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + '+';
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  function checkVisibility() {
    if (hasAnimated) return;

    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight * 0.8) {
      hasAnimated = true;
      animateCounters();
    }
  }

  window.addEventListener('scroll', checkVisibility, { passive: true });
  checkVisibility();
}

// Live Countdown Timers for Upcoming Events
function initCountdowns() {
  const events = [
    { id: 'inspiher-timer', date: new Date('2026-10-15T09:00:00') },
    { id: 'wie-day-timer', date: new Date('2026-11-20T10:00:00') },
    { id: 'workshop-timer', date: new Date('2026-09-05T14:00:00') }
  ];

  function updateTimers() {
    const now = new Date().getTime();

    events.forEach(evt => {
      const container = document.getElementById(evt.id);
      if (!container) return;

      const diff = evt.date.getTime() - now;

      if (diff <= 0) {
        container.innerHTML = '<span class="gradient-text">Event Live Now!</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      container.innerHTML = `
        <div class="countdown-unit"><span class="countdown-num">${days}</span><span class="countdown-label">Days</span></div>
        <div class="countdown-unit"><span class="countdown-num">${hours}</span><span class="countdown-label">Hours</span></div>
        <div class="countdown-unit"><span class="countdown-num">${mins}</span><span class="countdown-label">Mins</span></div>
        <div class="countdown-unit"><span class="countdown-num">${secs}</span><span class="countdown-label">Secs</span></div>
      `;
    });
  }

  updateTimers();
  setInterval(updateTimers, 1000);
}

// Gallery Lightbox Modal (filter buttons removed)
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }
}

// FAQ Accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Volunteer Roadmap Step selector
function initRoadmap() {
  const steps = document.querySelectorAll('.roadmap-step');
  steps.forEach(step => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });
}

// Form Handlers
function initForms() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for contacting IEEE WIE SLTC! We will get back to you shortly.');
      contactForm.reset();
    });
  }

  const partnerForm = document.getElementById('partner-form');
  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your interest in partnering with IEEE WIE SLTC! Our team will contact you soon.');
      partnerForm.reset();
    });
  }
}


// Subtle background technical animation for all pages
function initBackgroundAnimation() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  const orbs = [
    { x: 0.25, y: 0.25, r: 0.55, color: [161, 0, 242] },
    { x: 0.75, y: 0.3, r: 0.5, color: [140, 0, 210] },
    { x: 0.5, y: 0.7, r: 0.6, color: [120, 0, 180] },
    { x: 0.3, y: 0.75, r: 0.5, color: [155, 68, 255] },
    { x: 0.8, y: 0.7, r: 0.55, color: [109, 0, 192] },
    { x: 0.6, y: 0.4, r: 0.45, color: [137, 0, 242] }
  ];

  function getScrollProgress() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    return maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const shift = getScrollProgress();

    orbs.forEach((orb, i) => {
      const offsetX = Math.sin(shift * Math.PI * 2 + i * 1.2) * width * 0.12;
      const offsetY = Math.cos(shift * Math.PI * 2 + i * 1.2) * height * 0.12;
      const cx = orb.x * width + offsetX;
      const cy = orb.y * height + offsetY;
      const radius = Math.max(1, orb.r * Math.min(width, height));

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const [r, g, b] = orb.color;
      const alpha = 0.65 + shift * 0.25;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${alpha * 0.7})`);
      gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.25})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });
  }

  function animate() {
    draw();
    animationFrameId = requestAnimationFrame(animate);
  }

  resize();
  animate();

  window.addEventListener('resize', resize);
}

// Welcome Modal - Show on first visit
function initWelcomeModal() {
  const modal = document.getElementById('welcome-modal');
  const closeBtn = document.getElementById('welcome-modal-close');
  const closeBottomBtn = document.getElementById('welcome-close-btn');
  
  if (!modal) return;

  // Only show on first visit (localStorage gated)
  const alreadyShown = localStorage.getItem('wieWelcomeShown');
  if (alreadyShown === 'true') return;

  // Show modal after a short delay
  setTimeout(() => {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }, 800);

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    localStorage.setItem('wieWelcomeShown', 'true');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (closeBottomBtn) {
    closeBottomBtn.addEventListener('click', closeModal);
  }

  // Close on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Hero Background Animation - purple gradients, glowing orbs, particles, network lines
function initHeroBackground() {
  const canvas = document.querySelector('.hero-background');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let mouseX = 0;
  let mouseY = 0;
  let mouseActive = false;

  const orbs = [];
  const particles = [];
  const orbCount = 4;
  const particleCount = 40;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  class Orb {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.radius = Math.random() * 150 + 200;
      this.color = [
        137 + Math.random() * 40,
        0 + Math.random() * 60,
        242 - Math.random() * 40
      ];
      this.alpha = Math.random() * 0.15 + 0.05;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -this.radius || this.x > width + this.radius) this.vx *= -1;
      if (this.y < -this.radius || this.y > height + this.radius) this.vy *= -1;

      if (mouseActive) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          this.x -= (dx / dist) * 0.3;
          this.y -= (dy / dist) * 0.3;
        }
      }
    }

    draw() {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      gradient.addColorStop(0, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha})`);
      gradient.addColorStop(0.4, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.hue = 260 + Math.random() * 40;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouseActive) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.x -= (dx / dist) * 0.5;
          this.y -= (dy / dist) * 0.5;
        }
      }
    }

    draw() {
      ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initOrbs() {
    orbs.length = 0;
    for (let i = 0; i < orbCount; i++) {
      orbs.push(new Orb());
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawNetworkLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.strokeStyle = `hsla(270, 60%, 60%, ${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    orbs.forEach(orb => {
      orb.update();
      orb.draw();
    });

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawNetworkLines();

    animationFrameId = requestAnimationFrame(animate);
  }

  function onMouseMove(e) {
    mouseActive = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onMouseLeave() {
    mouseActive = false;
  }

  resize();
  initOrbs();
  initParticles();
  animate();

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', resize);
}
