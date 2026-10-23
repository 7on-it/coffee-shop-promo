/* ===== carousel.js — карусель хитов на главной ===== */

(function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (!track || !prevBtn || !nextBtn) return;

    // Данные напитков (в реальном проекте можно грузить через fetch из JSON)
    const drinks = [
        { emoji: '☕', name: 'Эспрессо', price: 120 },
        { emoji: '🥛', name: 'Латте',    price: 190 },
        { emoji: '🧋', name: 'Капучино', price: 180 },
        { emoji: '🍫', name: 'Мокко',    price: 210 },
        { emoji: '🍵', name: 'Матча-латте', price: 220 },
        { emoji: '🧊', name: 'Айс-кофе', price: 200 }
    ];

    // Рендерим карточки
    drinks.forEach((drink) => {
        const card = document.createElement('div');
        card.className = 'carousel__card';
        card.innerHTML = `
            <div class="carousel__emoji">${drink.emoji}</div>
            <div class="carousel__name">${drink.name}</div>
            <div class="carousel__price">${window.formatPrice(drink.price)}</div>
        `;
        track.appendChild(card);
    });

    // Прокрутка на ширину одной карточки + gap
    function scrollStep() {
        const card = track.querySelector('.carousel__card');
        if (!card) return 0;
        const gap = parseInt(getComputedStyle(track).gap) || 0;
        return card.offsetWidth + gap;
    }

    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: scrollStep(), behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
    });

    // Управление с клавиатуры, когда фокус внутри карусели
    track.setAttribute('tabindex', '0');
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            track.scrollBy({ left: scrollStep(), behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            track.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
        }
    });

    // Автопрокрутка каждые 4 секунды (останавливается при наведении)
    let autoId = setInterval(() => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: scrollStep(), behavior: 'smooth' });
        }
    }, 4000);

    track.addEventListener('mouseenter', () => clearInterval(autoId));
    track.addEventListener('mouseleave', () => {
        autoId = setInterval(() => {
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: scrollStep(), behavior: 'smooth' });
            }
        }, 4000);
    });
})();
