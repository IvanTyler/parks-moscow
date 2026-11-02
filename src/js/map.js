// Блок: map — фильтры по округам и интересам.
// Метки скрываются, если не подходят ни под один выбранный фильтр.

export const initMap = () => {
    const section = document.querySelector('.map');
    if (!section) return;

    const pins = Array.from(section.querySelectorAll('.map__pin'));
    const districts = Array.from(section.querySelectorAll('.map-chips__button[data-district]'));
    const interests = Array.from(section.querySelectorAll('.map-chips__button[data-interest]'));
    const resetButton = section.querySelector('[data-map-reset]');

    // Активные значения фильтров: округа и интересы
    const getActive = (buttons, attribute) =>
        new Set(
            buttons
                .filter((button) => button.classList.contains('is-active'))
                .map((button) => button.dataset[attribute]),
        );

    const applyFilters = () => {
        const activeDistricts = getActive(districts, 'district');
        const activeInterests = getActive(interests, 'interest');

        pins.forEach((pin) => {
            const matchesDistrict = !activeDistricts.size || activeDistricts.has(pin.dataset.district);
            const matchesInterest = !activeInterests.size || activeInterests.has(pin.dataset.interest);

            pin.classList.toggle('is-hidden', !(matchesDistrict && matchesInterest));
        });
    };

    // Клик по фильтру переключает его и пересчитывает видимость меток
    [...districts, ...interests].forEach((button) => {
        button.addEventListener('click', () => {
            button.classList.toggle('is-active');
            applyFilters();
        });
    });

    // «Все парки Москвы» — сброс фильтров
    resetButton?.addEventListener('click', () => {
        districts.forEach((button) => button.classList.remove('is-active'));
        interests.forEach((button) => button.classList.remove('is-active'));
        applyFilters();
    });
};
