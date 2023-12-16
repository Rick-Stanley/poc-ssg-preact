import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8');
const { render } = await import('./dist/server/entry-server.js');

const routesToPrerender = fs
  .readdirSync(toAbsolute('src/pages'))
  .map((file) => {
    const name = file.replace(/\.tsx$/, '').toLowerCase()
    return name === 'home' ? '/' : `/${name}`
  })

for (const url of routesToPrerender) {
  const context = {}
  console.log(url);
  const { html: appHtml } = await render(url, context)

  const html = template.replace(`<!--app-html-->`, appHtml)

  const filePath = `dist/static${url === '/' ? '/index' : url}.html`
  fs.writeFileSync(toAbsolute(filePath), html)
  console.log('pre-rendered:', filePath)
}
