// Блок: subscribe — простая проверка e-mail в форме подписки.
// Без плагинов: регулярка + своё сообщение, нативный пузырь браузера отключён
// атрибутом novalidate в разметке, чтобы вид ошибки совпадал с дизайном.
//
// Открытое событие:
//   subscribe:subscribed — письмо прошло проверку, detail = { email }
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Zа-яА-Я]{2,}$/;

export const initSubscribe = () => {
    const form = document.querySelector('.subscribe__form');
    if (!form) return null;

    const input = form.querySelector('.subscribe__input');
    const error = form.querySelector('.subscribe__error');
    if (!input || !error) return null;

    const showError = (message) => {
        error.textContent = message;
        error.classList.remove('subscribe__error--success');
        error.hidden = false;
        input.setAttribute('aria-invalid', 'true');
        form.classList.add('subscribe__form--invalid');
    };

    const clearError = () => {
        error.hidden = true;
        error.textContent = '';
        error.classList.remove('subscribe__error--success');
        input.removeAttribute('aria-invalid');
        form.classList.remove('subscribe__form--invalid');
    };

    const validate = () => {
        const value = input.value.trim();

        if (!value) {
            showError('Укажите e-mail');
            return false;
        }

        if (!EMAIL.test(value)) {
            showError('Похоже, в адресе опечатка — нужен вид name@example.ru');
            return false;
        }

        clearError();
        return true;
    };

    // Ошибку снимаем, как только человек начал править поле
    input.addEventListener('input', clearError);

    // На выходе из поля проверяем только заполненное — пустое не ругаем
    input.addEventListener('blur', () => {
        if (input.value.trim()) validate();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validate()) {
            input.focus();
            return;
        }

        const email = input.value.trim();
        form.reset();

        error.textContent = 'Готово: письма будут приходить на этот адрес';
        error.classList.add('subscribe__error--success');
        error.hidden = false;

        // Отправку на сервер подключим вместе с бэкендом — сейчас только подтверждение
        form.dispatchEvent(new CustomEvent('subscribe:subscribed', { detail: { email }, bubbles: true }));
    });

    return { validate };
};
