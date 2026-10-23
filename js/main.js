/* ===== main.js — общие утилиты и эффекты ===== */

// ---------- Параллакс hero при движении мыши ----------
(function initHeroParallax() {
    const hero = document.getElementById('hero');
    const bg = document.getElementById('heroBg');
    if (!hero || !bg) return;

    let rafId = null;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        // Нормализуем координаты курсора в диапазон [-1, 1]
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            bg.style.transform = `translate(${x * 30}px, ${y * 30}px) scale(1.05)`;
        });
    });

    // Плавный возврат в исходное положение
    hero.addEventListener('mouseleave', () => {
        bg.style.transform = 'translate(0, 0) scale(1)';
    });
})();

// ---------- Подсветка активного пункта меню ----------
(function initActiveNav() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach((link) => {
        const href = link.getAttribute('href');
        if (href === current) {
            link.classList.add('nav__link--active');
        }
    });
})();

// ---------- Утилита: форматирование цены ----------
window.formatPrice = function (value) {
    return value + ' ₽';
};
