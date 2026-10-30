import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

// Каждая папка в src/components — отдельный блок со своей разметкой (partial)
const componentsDir = resolve(__dirname, 'src/components');
const partialDirectory = readdirSync(componentsDir).map((name) => resolve(componentsDir, name));

export default defineConfig({
    plugins: [
        // Подключает блоки в index.html через {{> header}}, {{> footer}} и т.д.
        handlebars({ partialDirectory }),
    ],
});
