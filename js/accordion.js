/* ===== accordion.js — раскрывающиеся категории меню ===== */

(function initAccordion() {
    const accordion = document.getElementById('accordion');
    if (!accordion) return;

    const items = accordion.querySelectorAll('.accordion__item');

    items.forEach((item) => {
        const header = item.querySelector('.accordion__header');
        if (!header) return;

        header.addEventListener('click', () => {
            // Закрываем остальные (режим "один открыт"), закомментируй — если нужен мульти
            items.forEach((other) => {
                if (other !== item) other.classList.remove('is-open');
            });
            item.classList.toggle('is-open');
        });

        // Доступность с клавиатуры: Enter/Space уже работают на <button>,
        // но добавим стрелки для навигации между заголовками
        header.addEventListener('keydown', (e) => {
            const list = Array.from(items);
            const index = list.indexOf(item);
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                list[(index + 1) % list.length].querySelector('.accordion__header').focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                list[(index - 1 + list.length) % list.length].querySelector('.accordion__header').focus();
            }
        });
    });
})();
