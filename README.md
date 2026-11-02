# Парки Москвы — тестовое задание

Вёрстка главной страницы по макету Figma (1920). Только десктоп — так в ТЗ.
Без jQuery и CSS-фреймворков: разметка, SCSS и ES-модули. 56 компонентов, один блок — одна папка.

## Стек

| Технология | Зачем |
|---|---|
| Vite 5 | сборка, dev-сервер, хеши ассетов |
| vite-plugin-handlebars | партиалы: блок = отдельный HTML-файл |
| SCSS | стили, файл на блок, переменные из макета |
| Swiper 11 | слайдеры: hero, увлечения, журнал, партнёры |
| ES-модули | остальной интерактив |
| PT Root UI | шрифт из макета, локальные `woff` |

`dependencies` — только `swiper`.

## Как запустить

```bash
npm install      # или npm ci
npm run dev      # http://localhost:5173
npm run build    # сборка в dist/
npm run preview  # посмотреть собранное
```

Node 18+. В `dist/` один CSS (~58 КБ), один JS (~100 КБ), картинки с хешами. Итого 6,5 МБ.

## Структура

```
index.html                 шапка → крошки → <main> → подвал
public/og-image.jpg        обложка 1200 × 630
src/
  components/<блок>/       <блок>.html + _<блок>.scss
  js/                      main.js и модуль на блок: hero, hobbies, journals, map, partners, subscribe
  styles/                  main.scss (@use всех блоков), переменные, шрифты, сброс, база
  assets/                  images, icons, fonts
COVER-LETTER.md            письмо с решениями по ТЗ
NOTES.md                   что осталось за рамками
```

Подключение разметки — `{{> блок}}`, стилей — `@use '../components/блок/блок';` в `main.scss`.

## Имена классов

Блок — плоское имя через дефис, его потомки — элементы этого блока через `__`:

```scss
.footer-menu { display: flex; gap: 40px; }

.footer-menu-list {
    flex: 0 0 351px;

    &__item { display: block; }     // .footer-menu-list__item
    &__link { color: #fff; }        // .footer-menu-list__link
}
```

Так же устроены `map-filters`, `map-canvas`, `footer-legal`, `journals-controls`,
`subscribe-field`, `partners-viewport`. Модификаторы — `--` (`hobby-card--kids`, `button--filled`),
состояния — `is-` (`is-active`). Всего 204 класса: 92 блока, 112 элементов.

Контейнер: `.container` — `max-width: 1920px; padding: 0 120px` (контент 1680).
У карты свой `.container-map` с правым отступом 78 px: панель 634 + карта 1088 = 1722.

## Решения по ТЗ

- **Крошки отдельным партиалом.** `{{> breadcrumbs}}` в `index.html` между шапкой и `<main>`,
  вне контейнера динамического контента. На главной вызывается без данных и ничего не рисует;
  на внутренней странице получает `crumbs = [{ text, href }]` и выводит `nav` с `aria-current="page"`.
  Подвал тоже вне `<main>`.
- **Sticky-шапка:** `position: sticky; top: 0; z-index: 20` у `.header`.
- **Без скриптов для селектов.** «Все парки Москвы» — кнопка сброса фильтров (`data-map-reset`),
  нативных `<select>` на странице нет, `select2` не понадобился.
- **События плагинов** всплывают на `document`:

| Событие | Модуль | `detail` |
|---|---|---|
| `journals:ready` | `src/js/journals.js` | — |
| `journals:slide-change` | `src/js/journals.js` | `{ index }` |
| `partners:scrolled` | `src/js/partners.js` | `{ index, total }` |
| `subscribe:subscribed` | `src/js/subscribe.js` | `{ email }` |

- **Валидация e-mail своя**, без библиотек: «Укажите e-mail» и «Похоже, в адресе опечатка»,
  `aria-invalid` у поля.
- **Подвал прижат к низу:** `html { height: 100% }`, `body` — flex-колонка, `main { flex: 1 1 auto }`.

## Доступность

- Ссылка «Перейти к содержанию» первой в табуляции, ведёт на `<main id="main">`.
- `:focus-visible` с собственным кольцом.
- При `prefers-reduced-motion: reduce` автоплей hero не включается, анимации сведены к нулю.
- У полей `<label>` (визуально скрытый), у кнопок и навигации — `aria-label`.

## Картинки и мета

- Фотографии — WebP без изменения размеров: 42,1 МБ PNG → 5,5 МБ (`hero-poster` 4,8 МБ → ~300 КБ).
- Логотипы — PNG (по 1–13 КБ), иконки и маски — SVG.
- `og:image` 1200 × 630 в `public/og-image.jpg`, мета в `<head>`. Путь относительный.

## Ограничения

- Данные моковые: события, новости, журнал и партнёры — статичные карточки в партиалах, бэкенда нет.
- Мобильная и планшетная вёрстка в ТЗ не требуются.
- Даты в карточке события в макете набраны Inter 16/20.8, здесь PT Root UI 16/21 — второй шрифт
  ради шести строк не подключал.
- Шрифт PT Root UI с открытого CDN-зеркала: для тестового допустимо, в продакшене нужны
  файлы от дизайнера.
- Проход глазами в браузере на 1440 и 1920 не приложен: headless-браузер здесь не запускается,
  размеры сверены с макетом по числам.
