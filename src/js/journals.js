import Swiper from 'swiper';
import { Navigation, Keyboard, A11y } from 'swiper/modules';

// Блок: journals — слайдер статей. Две карточки в ряд, шаг 24.
//
// Открытые события (чтобы программист заказчика цеплялся без доступа внутрь):
//   journals:ready        — слайдер инициализирован, detail = { total, realIndex }
//   journals:slide-change — смена слайда,      detail = { total, realIndex, previousIndex }
// Слушать: document.addEventListener('journals:slide-change', (e) => e.detail)
// initJournals возвращает экземпляр Swiper — можно дёрнуть swiper.slideTo(n) руками.
export const initJournals = () => {
    const element = document.querySelector('.journals__slider');
    if (!element) return null;

    const section = element.closest('.journals');
    const total = element.querySelectorAll('.swiper-slide').length;

    const emit = (name, detail) => {
        element.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
    };

    const swiper = new Swiper(element, {
        modules: [Navigation, Keyboard, A11y],

        // Ровно две карточки: 402 + 24 + 402 = 828 — ширина правой колонки.
        // Число целое специально: с 'auto' Swiper считает 828 / 402 = 2,06 слайда
        // и в конце докручивает «два с хвостиком» — появляется пустой зазор
        // после последнего слайда.
        slidesPerView: 2,
        spaceBetween: 24,
        slidesPerGroup: 1,

        // watchOverflow выключал навигацию, если Swiper успевал померить слайды
        // до загрузки PT Root UI (ширины нулевые → «всё влезло» → стрелки мертвы).
        // Держим false и пересчитываем размеры после шрифтов и картинок.
        watchOverflow: false,
        observer: true,
        observeParents: true,
        resizeObserver: true,
        keyboard: { enabled: true },
        navigation: {
            prevEl: section ? section.querySelector('.journals__prev') : null,
            nextEl: section ? section.querySelector('.journals__next') : null,
        },
        a11y: {
            prevSlideMessage: 'Предыдущие статьи',
            nextSlideMessage: 'Следующие статьи',
        },
    });

    const update = () => swiper.update();

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(update);
    }

    window.addEventListener('load', update, { once: true });

    let previous = swiper.realIndex;

    swiper.on('slideChange', (instance) => {
        emit('journals:slide-change', {
            total,
            realIndex: instance.realIndex,
            previousIndex: previous,
        });
        previous = instance.realIndex;
    });

    emit('journals:ready', { total, realIndex: swiper.realIndex });

    return swiper;
};
