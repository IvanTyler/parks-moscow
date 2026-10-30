import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

// Слайдер «Ваши увлечения»: карточки фиксированной ширины, листаются стрелками по кругу
export const initHobbies = () => {
    const slider = document.querySelector('.hobbies__slider');
    if (!slider) return;

    const section = slider.closest('.hobbies');

    new Swiper(slider, {
        modules: [Navigation],
        slidesPerView: 'auto', // ширину карточки задаёт CSS (402px)
        spaceBetween: 24,
        loop: true, // бесконечная прокрутка: после последней карточки — первая, и наоборот
        navigation: {
            prevEl: section.querySelector('.hobbies__prev'),
            nextEl: section.querySelector('.hobbies__next'),
        },
    });
};
