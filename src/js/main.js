// Точка входа: стили и скрипты блоков.
// Стили Swiper — первыми, чтобы наши стили блоков их перекрывали
import 'swiper/css';
import '../styles/main.scss';
import { initHero } from './hero';
import { initHobbies } from './hobbies';

initHero();
initHobbies();
