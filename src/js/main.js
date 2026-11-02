// Точка входа: стили и скрипты блоков.
// Стили Swiper — первыми, чтобы наши стили блоков их перекрывали
import 'swiper/css';
import '../styles/main.scss';
import { initHero } from './hero';
import { initHobbies } from './hobbies';
import { initMap } from './map';
import { initJournals } from './journals';
import { initPartners } from './partners';
import { initSubscribe } from './subscribe';

// Блоки инициализируем по очереди, но каждый — в своём try/catch:
// иначе исключение в одном слайдере оставляет остальные блоки без JS
const safely = (init) => {
    try {
        init();
    } catch (error) {
        console.error('[parks] блок не инициализирован:', error);
    }
};

safely(initHero);
safely(initHobbies);
safely(initMap);
safely(initJournals);
safely(initPartners);
safely(initSubscribe);
