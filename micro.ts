import type { Plugin } from 'vite';
import fastGlob from 'fast-glob';

//#region Node.JS específico
import pkg from './package.json';
import { writeFile, access, constants, copyFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
//#endregion

const pathToShared = 'dist/client/assets/shared/';
const preactFile = `preact.${pkg.dependencies.preact.match(/[\d\.]+/)[0].replace(/\./g, '_')}.module.js`;
const pathToPreactShared = join(pathToShared, preactFile);

type IfDefined<T, K> =
  K extends keyof T ? keyof T[K] : undefined;

type SharedPluginParams = {
  shared?: (IfDefined<typeof pkg, 'devDependencies'> | IfDefined<typeof pkg, 'dependencies'>)[];
};

const micro = (opts?: SharedPluginParams): Plugin => {
  // Shared libraries
  const importmap = {
    imports: {
      preact: pathToPreactShared,
    }
  };

  const importmapTemplate = `<script type="importmap">${JSON.stringify(importmap)}</script>`;
  const headTemplate = `<head>
${importmapTemplate}`;

  return {
    name: 'bundle-preact',
    apply: 'build',
    enforce: 'post',
    async closeBundle() {
      const filesToTransform = await fastGlob('dist/client/**/*.html');
      const processFile =
        async (filePath: string) => {
          const html = await readFile(filePath, 'utf8');

          return writeFile(
            filePath,
            html.replace(
              /<head>/,
              headTemplate,
            ),
            'utf8'
          );
        };

      await Promise.all(
        filesToTransform.map(
          processFile
        )
      );
    },
    async generateBundle(options, bundle) {
      const pathToCompiledPreactModule = 'node_modules/preact/dist/preact.module.js';

      // Is Preact accessible?
      await access(pathToCompiledPreactModule, constants.R_OK);

      // Create shared folder
      await mkdir(pathToShared, { recursive: true });

      // Copy Preact module over
      await copyFile(pathToCompiledPreactModule, pathToPreactShared);
    }
  };
};

export default
  micro;
