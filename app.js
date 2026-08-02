/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== TYPEWRITER (home page only) ===== */
const tw = document.getElementById('typewriter');
if (tw) {
  const phrases = [
    'Salesforce Support Engineer',
    'Agentforce Specialist',
    'Data Cloud Expert',
    'Einstein AI Debugger',
    'Problem Solver & Builder',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      tw.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      tw.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  type();
}

/* ===== INTERSECTION OBSERVER ===== */
const fadeEls = document.querySelectorAll('.glass-card, .section-header, .timeline-item, .fade-in');
fadeEls.forEach(el => {
  if (!el.classList.contains('fade-in')) el.classList.add('fade-in');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const bar = entry.target.querySelector('.skill-fill');
      if (bar) bar.style.width = bar.dataset.width + '%';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ===== TECH INDEX CLOCK ===== */
const tiClock = document.getElementById('ti-clock');
if (tiClock) {
  function updateClock() {
    const now = new Date();
    tiClock.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 1000);
}

/* ===== TICKER DUPLICATION (seamless loop) ===== */
const tickerItems = document.getElementById('ticker-items');
if (tickerItems) {
  tickerItems.innerHTML += tickerItems.innerHTML;
}

/* ===== SMOOTH ACTIVE NAV ===== */
const sections = document.querySelectorAll('section[id]');
if (sections.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
  }, { passive: true });
}
