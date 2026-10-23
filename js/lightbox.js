/* ===== lightbox.js — просмотр фото блюд ===== */

(function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const imgEl = document.getElementById('lightboxImg');
    const captionEl = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    // Собираем все карточки меню как "слайды"
    const cards = Array.from(document.querySelectorAll('.menu-card'));
    if (!cards.length) return;

    let currentIndex = 0;

    function render(index) {
        const card = cards[index];
        if (!card) return;
        imgEl.textContent = card.querySelector('.menu-card__img').textContent;
        captionEl.textContent = card.dataset.name || '';
        currentIndex = index;
    }

    function open(index) {
        render(index);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
    }

    function close() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    function next() {
        render((currentIndex + 1) % cards.length);
    }

    function prev() {
        render((currentIndex - 1 + cards.length) % cards.length);
    }

    // Открытие по клику на карточку
    cards.forEach((card, i) => {
        card.addEventListener('click', () => open(i));
    });

    // Кнопки
    closeBtn.addEventListener('click', close);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    // Клик по оверлею (вне контента) закрывает
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    // Клавиатура
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
    });
})();
