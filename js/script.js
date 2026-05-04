// Smooth scroll to sections
function scrollToContact() {
    const element = document.getElementById('contact');
    element.scrollIntoView({ behavior: 'smooth' });
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const message = form.querySelector('textarea').value;
    
    // Create mailto link
    const subject = encodeURIComponent(`Новая заявка от ${name}`);
    const body = encodeURIComponent(
        `Имя: ${name}\n` +
        `Email: ${email}\n` +
        `Телефон: ${phone}\n\n` +
        `Сообщение:\n${message}`
    );
    
    // Open mail client
    window.location.href = `mailto:silkov_1969@mail.ru?subject=${subject}&body=${body}`;
    
    // Reset form
    form.reset();
    
    // Show success message
    showNotification('Спасибо! Ваша заявка будет обработана как можно скорее.');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 28px;
        right: 28px;
        background-color: #e8a020;
        color: #0d0d0d;
        padding: 1rem 1.75rem;
        border-radius: 3px;
        box-shadow: 0 8px 32px rgba(232, 160, 32, 0.35);
        z-index: 1000;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3500);
}

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(120%) translateY(10px);
            opacity: 0;
        }
        to {
            transform: translateX(0) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(120%) translateY(10px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ── Scroll Reveal ──────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.style.backgroundColor = 'rgba(240, 237, 232, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(240, 237, 232, 0.9)';
        navbar.style.boxShadow = 'none';
    }
}, { passive: true });

// ── Stat counter animation ──────────────────────────────────
function animateCounter(el) {
    const text = el.textContent;
    const suffix = text.replace(/[0-9]/g, '');
    const target = parseInt(text.replace(/\D/g, ''), 10);
    if (isNaN(target)) return;
    
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start) + suffix;
        }
    }, step);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(n => animateCounter(n));
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) statObserver.observe(statsSection);

// ── Cursor glow (desktop only) ──────────────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: #c8860a;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99998;
        transform: translate(-50%, -50%);
        transition: width 0.2s, height 0.2s, opacity 0.2s;
        mix-blend-mode: multiply;
    `;
    document.body.appendChild(cursor);

    const cursorRing = document.createElement('div');
    cursorRing.style.cssText = `
        position: fixed;
        width: 28px;
        height: 28px;
        border: 1px solid rgba(200, 134, 10, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 99997;
        transform: translate(-50%, -50%);
        transition: transform 0.12s ease, width 0.2s, height 0.2s, opacity 0.2s;
        mix-blend-mode: multiply;
    `;
    document.body.appendChild(cursorRing);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
    }, { passive: true });

    function animateRing() {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top = ry + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .service-card, .contact-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursorRing.style.width = '44px';
            cursorRing.style.height = '44px';
            cursorRing.style.borderColor = 'rgba(200, 134, 10, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '6px';
            cursor.style.height = '6px';
            cursorRing.style.width = '28px';
            cursorRing.style.height = '28px';
            cursorRing.style.borderColor = 'rgba(200, 134, 10, 0.5)';
        });
    });
}