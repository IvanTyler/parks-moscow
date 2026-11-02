import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Номер слайда с ведущим нулём: 1 → «01»
const pad = (number) => String(number).padStart(2, '0');

// Системная настройка «меньше движения»: автопрокрутку тогда не включаем
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export const initHero = () => {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const progress = slider.querySelector('.hero-controls__progress');

    new Swiper(slider, {
        modules: [Autoplay, Navigation, Pagination],
        speed: 800,
        // Слайдов всего два — для loop нужно минимум три, поэтому rewind: после последнего вернётся к первому
        rewind: true,
        autoplay: reducedMotion.matches
            ? false
            : {
                  delay: 7000,
                  disableOnInteraction: false,
              },
        navigation: {
            prevEl: slider.querySelector('.hero-controls__prev'),
            nextEl: slider.querySelector('.hero-controls__next'),
        },
        // Счётчик «01 — 02»
        pagination: {
            el: slider.querySelector('.hero-controls__counter'),
            type: 'fraction',
            formatFractionCurrent: pad,
            formatFractionTotal: pad,
            renderFraction: (currentClass, totalClass) =>
                `<span class="${currentClass}"></span><span class="hero-controls__counter-total">  —  <span class="${totalClass}"></span></span>`,
        },
        on: {
            // progress идёт от 1 к 0, пока до смены слайда остаётся время — полоска растёт
            autoplayTimeLeft(swiper, time, timeProgress) {
                progress.style.setProperty('--progress', 1 - timeProgress);
            },
        },
    });
};
