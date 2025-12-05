const canvas = document.getElementById('world-lines');
let ctx = null;
let lines = [];
if (canvas) {
    ctx = canvas.getContext('2d');

    // Debug helpers: log canvas presence and make it briefly visible with an outline
    try {
        console.log('[debug] world-lines canvas found:', canvas, 'size:', canvas.width, 'x', canvas.height);
        // add a visible outline to help spotting the canvas in the page
        canvas.style.outline = '3px solid rgba(255,0,0,0.6)';
        // remove the outline after 2s so it doesn't remain
        setTimeout(() => { canvas.style.outline = ''; }, 2000);
    } catch (e) { console.log('[debug] canvas debug failed', e); }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const NUM = 45;
    for (let i = 0; i < NUM; i++) {
        lines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            x2: Math.random() * canvas.width,
            y2: Math.random() * canvas.height,
            speed: 0.3 + Math.random() * 0.4
        });
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;

        lines.forEach(l => {
            ctx.beginPath();
            ctx.moveTo(l.x, l.y);
            ctx.lineTo(l.x2, l.y2);
            ctx.stroke();

            l.x += (Math.random() - 0.5) * l.speed;
            l.y += (Math.random() - 0.5) * l.speed;
            l.x2 += (Math.random() - 0.5) * l.speed;
            l.y2 += (Math.random() - 0.5) * l.speed;
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Hamburger menu
const toggle = document.getElementById("nav-toggle");
const menu = document.getElementById("nav-menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
});


// Hacker text animation
const hackerText = `Météorologue de formation et hacker citoyen,
Gaël Musquet place la technologie au service de l’humain.

À travers des initiatives comme HAND et OpenStreetMap,
il mobilise la cartographie et les données ouvertes
pour sauver des vies et redonner du pouvoir aux citoyens.

Son engagement illustre une conviction simple :
la technologie n’a de sens que si elle renforce
la solidarité et la résilience collective.`;

let i = 0;
const hackerElement = document.getElementById("hacker-text");

function typeWritter() {
    if (i < hackerText.length) {
        hackerElement.innerHTML += hackerText.charAt(i);
        i++;
        setTimeout(typeWritter, 35);
    }
}
typeWritter();

/* =================== Carousel functionality =================== */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return; // no carousel on this page

    const items = Array.from(track.children);
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    track.parentNode.appendChild(indicatorsContainer);

    let currentIndex = 0;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 4000;

    // set widths (items are 100% each, flexbox handles it)
    function updateTrackPosition() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        updateIndicators();
    }

    // indicators
    items.forEach((_, idx) => {
        const btn = document.createElement('button');
        btn.addEventListener('click', () => {
            currentIndex = idx;
            updateTrackPosition();
            restartAutoplay();
        });
        indicatorsContainer.appendChild(btn);
    });

    function updateIndicators() {
        const dots = Array.from(indicatorsContainer.children);
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    // next / prev
    function goTo(index) {
        currentIndex = (index + items.length) % items.length;
        updateTrackPosition();
    }

    nextBtn && nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); restartAutoplay(); });
    prevBtn && prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); restartAutoplay(); });

    // autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => goTo(currentIndex + 1), AUTOPLAY_DELAY);
    }
    function stopAutoplay() { if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; } }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    // pause on hover/focus
    const carouselEl = document.querySelector('.carousel');
    carouselEl.addEventListener('mouseenter', stopAutoplay);
    carouselEl.addEventListener('mouseleave', startAutoplay);
    carouselEl.addEventListener('focusin', stopAutoplay);
    carouselEl.addEventListener('focusout', startAutoplay);

    // touch swipe support
    let startX = 0;
    let isDragging = false;
    carouselEl.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; stopAutoplay(); });
    carouselEl.addEventListener('touchmove', (e) => { if (!isDragging) return; const dx = e.touches[0].clientX - startX; /* optionally implement drag preview */ });
    carouselEl.addEventListener('touchend', (e) => { if (!isDragging) return; const endX = e.changedTouches[0].clientX; const dx = endX - startX; isDragging = false; if (Math.abs(dx) > 40) { if (dx < 0) goTo(currentIndex + 1); else goTo(currentIndex - 1); } startAutoplay(); });

    // keyboard accessibility
    carouselEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { goTo(currentIndex - 1); restartAutoplay(); }
        if (e.key === 'ArrowRight') { goTo(currentIndex + 1); restartAutoplay(); }
    });

    // initial state
    updateTrackPosition();
    startAutoplay();
});
