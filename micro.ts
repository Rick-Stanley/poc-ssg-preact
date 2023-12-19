import type { Plugin } from 'vite';
import fastGlob from 'fast-glob';

//#region Node.JS específico
import { writeFile, access, constants, copyFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
//#endregion

const pathToShared = 'dist/client/assets/shared/';

type SharedPluginParams = {
  shared?: string[];
};

const tryGetPackageJson = (module: string) => {
    try {
        return fileURLToPath(import.meta.resolve(`${module}/package.json`));
    } catch (err) {
        if (!(err.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED'))
            throw err;
        const pathSize = fileURLToPath(import.meta.resolve(module)).split('/').length - 1;

        for (const i of Array.from(Array(pathSize).keys())) {
            const path = join(fileURLToPath(import.meta.resolve(module)), ...Array(i + 1).fill('..'), 'package.json');
            if (existsSync(path))
                return path;
        }

        throw new Error('Package.json not found.');
    }
};

const micro = async (opts?: SharedPluginParams): Promise<Plugin> => {
    const dependenciesNormalized = opts.shared.map(module => module.replace(/\//g, '-'));
    const dependenciesVersions = await Promise.all(
        opts.shared
            .map(module => tryGetPackageJson(module))
            .map(async pkgPath => {
                const { default: d } = await import(pkgPath, { assert: { type: 'json' } });
                if (!d) throw new Error(`Não foi possível abrir o package.json de ${pkgPath}`);

                return d.version;
            })
    );
    const sharedName = dependenciesNormalized.map(
        (value, i) => `${value}.${dependenciesVersions[i].replace(/\./g, '_')}.module.js`,
    );
    const sharedPathModules = sharedName.map(
        (value) => join(pathToShared, value)
    );

    // Shared libraries
    const importmap = {
        imports: Object.fromEntries(
            opts.shared.map(
                (module, i) => [module, sharedPathModules[i]]
            )
        )
    };

    const importmapTemplate = `<script type="importmap">${JSON.stringify(importmap)}</script>`;
    const headTemplate = `<head>
${importmapTemplate}`;

  return {
    name: 'bundle-shared',
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
        await mkdir(pathToShared, { recursive: true });

        const pathsToModules = opts.shared.map(
            module => fileURLToPath(import.meta.resolve(module))
        );

        await Promise.all(pathsToModules.map(path => access(path, constants.R_OK)));

        opts.shared.map(
            (module, i) => copyFile(pathsToModules[i], importmap.imports[module]),
        );
    }
  };
};

export default
  micro;
