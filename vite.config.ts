import { createRequire } from 'module'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact({
      babel: {
        // Change cwd to load Preact Babel plugins
        cwd: createRequire(import.meta.url).resolve('@preact/preset-vite')
      }
    })
  ],
  build: {
    minify: false,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      external: ['preact', 'preact-router', 'preact/compat', 'preact/jsx-runtime', 'preact-iso', 'preact/hooks'],
      preserveEntrySignatures: 'exports-only',
      input: {
        local: fileURLToPath(new URL('./index.html', import.meta.url)),
        remote: fileURLToPath(new URL('./src/index.tsx', import.meta.url)),
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`
      }
    }
  }
})
