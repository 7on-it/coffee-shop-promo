/* ===== builder.js — конструктор напитка + форма заказа ===== */

(function initBuilder() {
    const builder = document.querySelector('.builder');
    if (!builder) return;

    // Ссылки на элементы превью
    const cupEl = document.getElementById('builderCup');
    const nameEl = document.getElementById('builderName');
    const compEl = document.getElementById('builderComposition');
    const priceEl = document.getElementById('builderPrice');

    // Состояние выбора
    const state = {
        base: null,
        milk: null,
        size: null,
        toppings: []
    };

    // Все пикеры
    const pickers = builder.querySelectorAll('.picker');

    // Инициализируем активные элементы по умолчанию
    pickers.forEach((picker) => {
        const group = picker.dataset.group;
        picker.querySelectorAll('.picker__item').forEach((item) => {
            if (item.classList.contains('picker__item--active')) {
                if (group === 'toppings') state.toppings.push(item);
                else state[group] = item;
            }
        });
    });

    // Пересчёт и обновление превью
    function updatePreview() {
        let total = 0;
        const parts = [];

        // Основа: цена + название
        if (state.base) {
            total += Number(state.base.dataset.price) || 0;
            nameEl.textContent = state.base.dataset.label;
            cupEl.textContent = state.base.dataset.emoji || '☕';
            parts.push(state.base.dataset.label);
        }

        // Размер: доп. цена (mult можно тоже использовать, но для наглядности — фикс)
        if (state.size) {
            total += Number(state.size.dataset.price) || 0;
            parts.push(state.size.dataset.label);
        }

        // Молоко
        if (state.milk) {
            total += Number(state.milk.dataset.price) || 0;
            parts.push(state.milk.dataset.label.toLowerCase());
        }

        // Топпинги
        if (state.toppings.length) {
            state.toppings.forEach((top) => {
                total += Number(top.dataset.price) || 0;
            });
            parts.push('+ ' + state.toppings.map((t) => t.dataset.label.toLowerCase()).join(', '));
        }

        // Вывод
        compEl.textContent = parts.join(' · ');
        priceEl.textContent = total + ' ₽';

        // Анимации-вспышки
        priceEl.classList.add('is-flash');
        cupEl.classList.add('is-bump');
        setTimeout(() => {
            priceEl.classList.remove('is-flash');
            cupEl.classList.remove('is-bump');
        }, 300);

        return total;
    }

    // Клики по опциям
    pickers.forEach((picker) => {
        const group = picker.dataset.group;
        const isMulti = picker.dataset.multi === 'true';

        picker.addEventListener('click', (e) => {
            const item = e.target.closest('.picker__item');
            if (!item) return;

            if (isMulti) {
                // Мультивыбор — переключаем
                item.classList.toggle('picker__item--active');
                const index = state.toppings.indexOf(item);
                if (index === -1) state.toppings.push(item);
                else state.toppings.splice(index, 1);
            } else {
                // Одиночный — снимаем активность со всех
                picker.querySelectorAll('.picker__item').forEach((el) =>
                    el.classList.remove('picker__item--active')
                );
                item.classList.add('picker__item--active');
                state[group] = item;
            }

            updatePreview();
        });
    });

    // Клавиатурная навигация внутри пикера (стрелки ←/→/↑/↓, Enter/Space)
    pickers.forEach((picker) => {
        picker.addEventListener('keydown', (e) => {
            const items = Array.from(picker.querySelectorAll('.picker__item'));
            const current = document.activeElement;
            const index = items.indexOf(current);

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                items[(index + 1) % items.length]?.focus();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                items[(index - 1 + items.length) % items.length]?.focus();
            }
        });
    });

    // Инициализация превью
    updatePreview();

    // ===== МОДАЛКА ЗАКАЗА =====
    const orderBtn = document.getElementById('builderOrderBtn');
    const modal = document.getElementById('orderModal');
    const modalClose = document.getElementById('orderModalClose');
    const summaryEl = document.getElementById('orderSummary');
    const form = document.getElementById('orderForm');

    function openModal() {
        // Составляем сводку заказа
        const total = priceEl.textContent;
        summaryEl.textContent = `${nameEl.textContent} — ${compEl.textContent} · Итого: ${total}`;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        // Фокус на первое поле
        document.getElementById('orderName').focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        clearErrors();
    }

    orderBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // ===== ВАЛИДАЦИЯ ФОРМЫ =====
    const nameInput = document.getElementById('orderName');
    const phoneInput = document.getElementById('orderPhone');

    function showError(input, message) {
        const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
        if (errorEl) errorEl.textContent = message;
        input.classList.add('is-invalid');
    }

    function clearErrors() {
        [nameInput, phoneInput].forEach((input) => {
            input.classList.remove('is-invalid');
            const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
            if (errorEl) errorEl.textContent = '';
        });
    }

    // Живая валидация: при вводе убираем ошибку
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 2) {
            nameInput.classList.remove('is-invalid');
            document.querySelector('[data-error-for="orderName"]').textContent = '';
        }
    });

    phoneInput.addEventListener('input', () => {
        if (phoneInput.value.replace(/\D/g, '').length >= 10) {
            phoneInput.classList.remove('is-invalid');
            document.querySelector('[data-error-for="orderPhone"]').textContent = '';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        let valid = true;

        if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Введите имя (минимум 2 символа)');
            valid = false;
        }

        const digits = phoneInput.value.replace(/\D/g, '');
        if (digits.length < 10) {
            showError(phoneInput, 'Введите телефон (минимум 10 цифр)');
            valid = false;
        }

        if (!valid) return;

        // Успех — показываем сообщение и закрываем
        alert(`Спасибо, ${nameInput.value.trim()}! Заказ принят.`);
        form.reset();
        closeModal();
    });
})();
