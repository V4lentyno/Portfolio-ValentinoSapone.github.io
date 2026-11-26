import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const projectSlugs = ['nology', 'cosem', 'loopup', 'ajedrez', 'audiovisual'];

/**
 * Inserta los parciales compartidos (nav, footer…) en cada página.
 * En el HTML: <!-- partial:nav -->. Dentro del parcial, {{root}} se reemplaza
 * por la ruta relativa a la raíz del sitio ("./" en la home, "../" en /proyectos/),
 * así el sitio funciona tanto en la raíz de un dominio como en una subcarpeta.
 */
function htmlPartials() {
    return {
        name: 'html-partials',
        transformIndexHtml: {
            order: 'pre',
            handler(html, ctx) {
                const pageDir = dirname(resolve(root, '.' + ctx.path));
                const rel = relative(pageDir, root).replace(/\\/g, '/');
                const toRoot = rel ? rel + '/' : './';
                return html.replace(/<!--\s*partial:([\w-]+)\s*-->/g, (_, name) =>
                    readFileSync(resolve(root, 'partials', `${name}.html`), 'utf8').replaceAll('{{root}}', toRoot)
                );
            },
        },
    };
}

export default defineConfig({
    base: './',
    plugins: [htmlPartials()],
    build: {
        chunkSizeWarningLimit: 600, // three.js va en un chunk aparte que solo carga la home
        rollupOptions: {
            input: {
                main: resolve(root, 'index.html'),
                ...Object.fromEntries(projectSlugs.map((s) => [s, resolve(root, `proyectos/${s}.html`)])),
            },
        },
    },
});
