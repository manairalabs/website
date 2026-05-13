/**
 * MANAIRA LABS v2 - AI Era Interactive Experience
 * Neural networks, data streams, and immersive scrolling
 */

// ============================================
// THEME TOGGLE
// ============================================
function updateNavBackground() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const scrollY = window.scrollY;

    if (isDark) {
        nav.style.background = scrollY > 100 ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.8)';
    } else {
        nav.style.background = scrollY > 100 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)';
    }
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateNavBackground();
    });
}

// Initialize theme toggle on DOM ready
document.addEventListener('DOMContentLoaded', initThemeToggle);

// ============================================
// LOADING SCREEN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');

    // Fast loading - just enough for initial render
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAnimations();
    }, 800);
});

// ============================================
// ROBOT CURSOR WITH ARMS + CURSOR DOT
// ============================================
const cursorDot = document.getElementById('cursorDot');
const robotCursor = document.getElementById('robotCursor');
const robotArmLeft = document.getElementById('robotArmLeft');
const robotArmRight = document.getElementById('robotArmRight');

let mouseX = 0, mouseY = 0;
let robotX = 0, robotY = 0;
let prevMouseX = 0, prevMouseY = 0;
let velocityX = 0, velocityY = 0;

document.addEventListener('mousemove', (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Calculate velocity
    velocityX = mouseX - prevMouseX;
    velocityY = mouseY - prevMouseY;
});

// Smooth robot follow with arm physics
function animateRobot() {
    // Cursor dot - exact mouse position (instant)
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';

    // Robot follows mouse smoothly (with lag)
    robotX += (mouseX - robotX) * 0.12;
    robotY += (mouseY - robotY) * 0.12;

    // Position robot (offset so it follows behind/beside the cursor)
    robotCursor.style.left = robotX - 25 + 'px';
    robotCursor.style.top = robotY - 28 + 'px';

    // Calculate movement direction for arm swing
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const maxArmRotation = 35;

    // Arms swing based on horizontal movement (like running)
    const armSwing = Math.min(speed * 2, maxArmRotation);
    const direction = velocityX > 0 ? 1 : -1;

    // Add slight oscillation based on speed for natural movement
    const time = Date.now() * 0.01;
    const oscillation = speed > 2 ? Math.sin(time) * 10 : 0;

    // Apply arm rotations
    const leftArmRotation = (-armSwing * direction) + oscillation;
    const rightArmRotation = (armSwing * direction) - oscillation;

    robotArmLeft.style.transform = `rotate(${leftArmRotation}deg)`;
    robotArmRight.style.transform = `rotate(${rightArmRotation}deg)`;

    // Slight tilt of whole robot based on movement direction
    const tilt = Math.min(Math.max(velocityX * 0.5, -15), 15);
    robotCursor.style.transform = `rotate(${tilt}deg)`;

    requestAnimationFrame(animateRobot);
}
animateRobot();

// Robot hover effects
const hoverElements = document.querySelectorAll('a, button, .capability-card, .process-step');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        robotCursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        robotCursor.classList.remove('hover');
    });
});

// ============================================
// NEURAL NETWORK CANVAS
// ============================================
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');

let nodes = [];
let connections = [];
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initNeuralNetwork();
}

function initNeuralNetwork() {
    nodes = [];
    connections = [];

    // Create nodes
    const nodeCount = Math.floor((canvas.width * canvas.height) / 40000);
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 2 + 1,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }

    // Create connections based on proximity
    updateConnections();
}

function updateConnections() {
    connections = [];
    const maxDistance = 150;

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                connections.push({
                    from: i,
                    to: j,
                    distance: distance,
                    maxDistance: maxDistance
                });
            }
        }
    }
}

function animateNeuralNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.001;

    // Update and draw nodes
    nodes.forEach((node, index) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));

        // Pulsing effect
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.5 + 0.5;
        const radius = node.radius * (1 + pulse * 0.3);

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.3 + pulse * 0.4})`;
        ctx.fill();
    });

    // Update connections periodically
    if (Math.random() < 0.02) {
        updateConnections();
    }

    // Draw connections
    connections.forEach(conn => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        const opacity = 1 - (conn.distance / conn.maxDistance);

        // Animated data flow
        const flowPhase = (time * 0.5 + conn.from * 0.1) % 1;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Data packet traveling along connection
        if (Math.random() < 0.3) {
            const packetX = fromNode.x + (toNode.x - fromNode.x) * flowPhase;
            const packetY = fromNode.y + (toNode.y - fromNode.y) * flowPhase;

            ctx.beginPath();
            ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${opacity * 0.8})`;
            ctx.fill();
        }
    });

    // Draw particles near cursor
    if (mouseX && mouseY) {
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;

            ctx.beginPath();
            ctx.arc(
                mouseX + Math.cos(angle) * distance,
                mouseY + Math.sin(angle) * distance,
                1,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(123, 97, 255, ${Math.random() * 0.5})`;
            ctx.fill();
        }
    }

    requestAnimationFrame(animateNeuralNetwork);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateNeuralNetwork();

// ============================================
// NAVIGATION
// ============================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Nav background on scroll
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    updateNavBackground();
    lastScrollY = window.scrollY;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navHeight = nav.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initAnimations() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Trigger counters if in stat section
                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target);
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const revealElements = document.querySelectorAll(
        '.problem-item, .capability-card, .process-step, .stat-card, .compare-side'
    );

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
        revealObserver.observe(el);
    });

    // Add revealed styles
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Process timeline animation
    initProcessTimeline();
}

// ============================================
// PROCESS TIMELINE
// ============================================
function initProcessTimeline() {
    const steps = document.querySelectorAll('.process-step');
    const timelineProgress = document.getElementById('timelineProgress');

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepIndex = parseInt(entry.target.dataset.step);
                entry.target.classList.add('active');

                // Update progress line
                const progress = (stepIndex / steps.length) * 100;
                timelineProgress.style.height = progress + '%';
            }
        });
    }, {
        threshold: 0.5
    });

    steps.forEach(step => timelineObserver.observe(step));
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(card) {
    const numberEl = card.querySelector('.stat-number[data-count]');
    if (!numberEl) return;

    const target = parseInt(numberEl.dataset.count);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(target * easeOutQuart);

        numberEl.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);

    // Animate circle progress if present
    const circle = card.querySelector('.stat-progress');
    if (circle) {
        const value = circle.dataset.value;
        const circumference = 283; // 2 * PI * 45
        const offset = circumference - (value / 100) * circumference;

        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 100);
    }
}

// Contact-form submit handling lives in BaseLayout.astro (shared CTA forms)
// and src/pages/contact.astro (dedicated contact page). The previous
// Formspree-based handler that lived here would double-submit and surface
// a "Something went wrong" alert despite a successful lead capture.

// ============================================
// PARALLAX EFFECTS
// ============================================
const heroVisual = document.querySelector('.hero-visual');
const floatingStats = document.querySelector('.floating-stats');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Parallax for hero visual
    if (heroVisual && scrollY < window.innerHeight) {
        heroVisual.style.transform = `translateY(calc(-50% + ${scrollY * 0.3}px))`;
        heroVisual.style.opacity = 1 - (scrollY / window.innerHeight) * 1.5;
    }

    // Parallax for floating stats
    if (floatingStats && scrollY < window.innerHeight) {
        floatingStats.style.transform = `translateY(${scrollY * 0.2}px)`;
    }
});

// ============================================
// MAGNETIC BUTTONS
// ============================================
const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// TEXT SCRAMBLE EFFECT
// ============================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply text scramble to nav links on hover
document.querySelectorAll('.nav-link[data-text]').forEach(link => {
    const fx = new TextScramble(link);
    const originalText = link.dataset.text;

    link.addEventListener('mouseenter', () => {
        fx.setText(originalText);
    });
});

// ============================================
// CAPABILITY CARDS - 3D TILT
// ============================================
const cards = document.querySelectorAll('.capability-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

        // Move glow
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.left = x - rect.width + 'px';
            glow.style.top = y - rect.height + 'px';
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ============================================
// BRAIN PARTICLES
// ============================================
const brainParticles = document.getElementById('brainParticles');

if (brainParticles) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'brain-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(0, 240, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        brainParticles.appendChild(particle);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            50% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.5); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// GRADIENT DEFINITIONS FOR SVG
// ============================================
const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgDefs.innerHTML = `
    <defs>
        <linearGradient id="statGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00f0ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7b61ff;stop-opacity:1" />
        </linearGradient>
    </defs>
`;
svgDefs.style.position = 'absolute';
svgDefs.style.width = '0';
svgDefs.style.height = '0';
document.body.prepend(svgDefs);

// ============================================
// TYPING EFFECT FOR HERO (Optional Enhancement)
// ============================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ============================================
// PERFORMANCE: Reduce animations on low-end devices
// ============================================
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (mediaQuery.matches) {
    // Disable complex animations
    canvas.style.display = 'none';
    document.querySelectorAll('.ring, .stream, .pulse-ring').forEach(el => {
        el.style.animation = 'none';
    });
}

console.log('%c MANAIRA LABS ', 'background: #00f0ff; color: #000; font-weight: bold; font-size: 20px; padding: 10px;');
console.log('%c AI That Works. Results That Matter. ', 'color: #888; font-size: 12px;');
