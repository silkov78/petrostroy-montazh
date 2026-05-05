// ── Theme toggle ─────────────────────────────────────
const html = document.documentElement;
const themeBtn = document.getElementById('theme-btn');

function getTheme() {
    return localStorage.getItem('theme') || 'dark';
}

function applyTheme(t) {
    html.setAttribute('data-theme', t);
    themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
    themeBtn.title = t === 'dark' ? 'Светлая тема' : 'Тёмная тема';
}

applyTheme(getTheme());

themeBtn.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
});

// ── Hamburger menu ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
}

// Close on outside click
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        closeMenu();
    }
});

// ── Scroll to contact ────────────────────────────────
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    closeMenu();
}

// ── Form submission ──────────────────────────────────
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name    = form.querySelector('input[type="text"]').value;
    const email   = form.querySelector('input[type="email"]').value;
    const phone   = form.querySelector('input[type="tel"]').value;
    const message = form.querySelector('textarea').value;

    const subject = encodeURIComponent(`Новая заявка от ${name}`);
    const body    = encodeURIComponent(
        `Имя: ${name}\nEmail: ${email}\nТелефон: ${phone}\n\nСообщение:\n${message}`
    );

    window.location.href = `mailto:silkov_1969@mail.ru?subject=${subject}&body=${body}`;
    form.reset();
    showNotification('Спасибо! Ваша заявка будет обработана в ближайшее время.');
}

// ── Notification ─────────────────────────────────────
function showNotification(message) {
    const n = document.createElement('div');
    n.textContent = message;
    n.style.cssText = `
        position:fixed; bottom:20px; right:16px;
        background:#d4920f; color:#0d0d0d;
        padding:0.9rem 1.4rem; border-radius:3px;
        box-shadow:0 8px 28px rgba(212,146,15,0.35);
        z-index:9998; font-family:'Barlow Condensed',sans-serif;
        font-weight:700; font-size:0.85rem;
        letter-spacing:0.05em; text-transform:uppercase;
        max-width:calc(100vw - 32px);
        animation:slideIn 0.35s cubic-bezier(0.16,1,0.3,1);
    `;
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => n.remove(), 300);
    }, 3500);
}

// ── Navbar scroll effect ─────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    const dark = html.getAttribute('data-theme') !== 'light';
    if (window.scrollY > 50) {
        navbar.style.boxShadow = dark
            ? '0 4px 30px rgba(0,0,0,0.5)'
            : '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
}, { passive: true });

// ── Scroll reveal ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

// ── Counter animation ────────────────────────────────
function animateCounter(el) {
    const text = el.textContent;
    const suffix = text.replace(/[0-9]/g, '');
    const target = parseInt(text.replace(/\D/g, ''), 10);
    if (isNaN(target) || target === 0) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
    }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.stat-number').forEach(animateCounter);
            statObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.stats');
if (statsEl) statObserver.observe(statsEl);

// ── Animation keyframes ───────────────────────────────
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(110%); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0);    opacity: 1; }
        to   { transform: translateX(110%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ── Cursor glow (desktop only) ───────────────────────
if (window.matchMedia('(pointer:fine) and (min-width:1024px)').matches) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.style.cssText = `
        position:fixed; width:6px; height:6px; background:#d4920f;
        border-radius:50%; pointer-events:none; z-index:99998;
        transform:translate(-50%,-50%); mix-blend-mode:screen;
        transition:width 0.2s,height 0.2s;
    `;
    ring.style.cssText = `
        position:fixed; width:28px; height:28px;
        border:1px solid rgba(212,146,15,0.45); border-radius:50%;
        pointer-events:none; z-index:99997;
        transform:translate(-50%,-50%); mix-blend-mode:screen;
        transition:width 0.2s,height 0.2s,border-color 0.2s;
    `;
    document.body.append(dot, ring);

    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e => {
        mx=e.clientX; my=e.clientY;
        dot.style.left=mx+'px'; dot.style.top=my+'px';
    }, {passive:true});

    (function animRing() {
        rx+=(mx-rx)*0.13; ry+=(my-ry)*0.13;
        ring.style.left=rx+'px'; ring.style.top=ry+'px';
        requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a,button,.service-card,.contact-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.style.width=dot.style.height='10px';
            ring.style.width=ring.style.height='44px';
            ring.style.borderColor='rgba(212,146,15,0.75)';
        });
        el.addEventListener('mouseleave', () => {
            dot.style.width=dot.style.height='6px';
            ring.style.width=ring.style.height='28px';
            ring.style.borderColor='rgba(212,146,15,0.45)';
        });
    });
}