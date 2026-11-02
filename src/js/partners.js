// Блок: partners — лента логотипов: стрелки, протягивание мышью, листание по кругу.
//
// Как устроен круг без плагинов: в разметке одна копия из шести ячеек,
// скрипт добавляет вторую (aria-hidden и без табиков, чтобы скринридер
// не читал логотипы дважды). Уехали на вторую копию — ставим scrollLeft = 0:
// вид в этой точке попиксельно тот же, стыка не видно.
// Назад с самого начала так же встаём на вторую копию и едем влево.
//
// Возврат в начало делаем по затиханию прокрутки, а не по scrollend:
// scrollend прилетает и от мгновенного прыжка и рвёт анимацию на середине.
//
// Открытое событие:
//   partners:scrolled — сменился первый видимый логотип, detail = { index, total }
export const initPartners = () => {
    const section = document.querySelector('.partners');
    if (!section) return null;

    const viewport = section.querySelector('.partners-viewport');
    const list = viewport ? viewport.querySelector('.partners-list') : null;
    const prev = section.querySelector('.partners-controls__prev');
    const next = section.querySelector('.partners-controls__next');
    if (!viewport || !list || !prev || !next) return null;

    const originals = [...list.children];
    if (originals.length < 2) return null;

    const perCopy = originals.length;

    originals.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a, button').forEach((node) => node.setAttribute('tabindex', '-1'));
        list.append(clone);
    });

    const items = [...list.children];
    const GAP = 24;

    // Шаг и длина копии — целыми числами: браузер отдаёт дробные ширины,
    // на них копится ошибка и круг «съезжает»
    const stride = () => Math.round((items[0].getBoundingClientRect().width || 260) + GAP);
    const period = () => perCopy * stride();
    const maxScroll = () => Math.max(0, Math.round(viewport.scrollWidth - viewport.clientWidth));

    let lastIndex = -1;
    let settleTimer = 0;

    const update = () => {
        const p = period();
        const index = p ? Math.round(viewport.scrollLeft / stride()) % perCopy : 0;

        if (index !== lastIndex) {
            lastIndex = index;
            viewport.dispatchEvent(
                new CustomEvent('partners:scrolled', {
                    detail: { index, total: perCopy },
                    bubbles: true,
                }),
            );
        }
    };

    // Доехали до второй копии — перескакиваем в начало без анимации
    const normalize = () => {
        const p = period();
        if (p && viewport.scrollLeft >= p - 0.5) {
            viewport.scrollLeft = 0;
        }
    };

    const settle = () => {
        update();
        clearTimeout(settleTimer);
        settleTimer = setTimeout(normalize, 160);
    };

    const move = (direction) => {
        const step = stride();
        const p = period();
        let from = viewport.scrollLeft;

        // Назад с самого начала: сначала встаём на вторую копию — картинка та же
        if (direction < 0 && from < 1) {
            from = p;
            viewport.scrollLeft = from;
        }

        viewport.scrollTo({ left: from + direction * step, behavior: 'smooth' });
    };

    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));

    // Протягивание мышью: тянем ленту, на отпускании доводим до ближайшей ячейки.
    // На тач-устройствах не вмешиваемся — там прокрутка своя
    const DRAG_THRESHOLD = 5;
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const snapToNearest = () => {
        const step = stride();
        const target = Math.min(Math.max(Math.round(viewport.scrollLeft / step) * step, 0), maxScroll());
        viewport.scrollTo({ left: target, behavior: 'smooth' });
    };

    viewport.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch' || event.button !== 0) return;

        dragging = true;
        moved = false;
        startX = event.clientX;
        startLeft = viewport.scrollLeft;
        viewport.setPointerCapture(event.pointerId);
        // Пока тянем — снап выключаем, иначе браузер дёргает ленту под курсором
        viewport.classList.add('partners-viewport--dragging');
    });

    viewport.addEventListener('pointermove', (event) => {
        if (!dragging) return;

        const delta = event.clientX - startX;
        if (Math.abs(delta) > DRAG_THRESHOLD) moved = true;
        viewport.scrollLeft = startLeft - delta;
    });

    const endDrag = (event) => {
        if (!dragging) return;

        dragging = false;
        viewport.classList.remove('partners-viewport--dragging');
        if (viewport.hasPointerCapture && viewport.hasPointerCapture(event.pointerId)) {
            viewport.releasePointerCapture(event.pointerId);
        }

        snapToNearest();
        settle();
    };

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    // После протягивания клик по логотипу не должен открывать ссылку
    list.addEventListener(
        'click',
        (event) => {
            if (!moved) return;
            event.preventDefault();
            event.stopPropagation();
            moved = false;
        },
        true,
    );

    viewport.addEventListener('scroll', settle, { passive: true });
    window.addEventListener('resize', update);

    update();

    return { update, move };
};
