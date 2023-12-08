import type { Plugin } from 'vite';
import pkg from './package.json';

// Node.JS específico
import { writeFile, access, constants, copyFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import fg from 'fast-glob';

const pathToShared = 'dist/client/assets/shared/';
const preactFile = `preact.${pkg.devDependencies.preact.match(/[\d\.]+/)[0].replace(/\./g, '_')}.module.js`;
const pathToPreactShared = join(pathToShared, preactFile);

const bundlePreactPlugin = (): Plugin => {
  return {
    name: 'bundle-preact',
    apply: 'build',
    enforce: 'post',
    async generateBundle(options, bundle) {
      const pathToCompiledPreactModule = 'node_modules/preact/dist/preact.module.js';

      // Podemos acessar Preact?
      await access(pathToCompiledPreactModule, constants.R_OK);

      await mkdir(pathToShared, { recursive: true });

      await copyFile(pathToCompiledPreactModule, pathToPreactShared);
    }
  };
}

const htmlPlugin = (): Plugin => {
  // Bibliotecas compartilhadas
  const importmap = {
    imports: {
      preact: pathToPreactShared,
    }
  };

  const importmapTemplate = `<script type="importmap">${JSON.stringify(importmap)}</script>`;

  return {
    name: 'html-transform',
    apply: 'build',
    enforce: 'post',
    async generateBundle() {
      console.log('auiq');

      const filesToTransform = await fg('dist/client/**/*.html');

      console.log(filesToTransform);

      await Promise.all(
        filesToTransform.map(
          async file => {
            const html = await readFile(file, 'utf8');

            return writeFile(
              file,
              html.replace(
                /<head>/,
                `<head>${importmapTemplate}`,
              ),
              'utf8'
            );
          }
        )
      );
    },
  }
};

const htmlPlugin2 = () => {
  return {
    name: 'html-transform',
    async transformIndexHtml(html) {

      console.log('oi: ', html);

      console.log('teste');

      const filesToTransform = await fg('dist/client/**/*.html');

      console.log(filesToTransform);

      return html.replace(
        /<title>(.*?)<\/title>/,
        `<title>Title replaced!</title>`,
      )
    },
  }
}

export {
  bundlePreactPlugin,
  htmlPlugin,
  htmlPlugin2,
};
