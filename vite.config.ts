import fs from 'node:fs'
import path from 'node:path'

import { defineConfig } from 'vite'
import type { Plugin, ResolvedConfig, BuildOptions } from 'vite'
import vue from '@vitejs/plugin-vue'

// @ts-ignore
import importmap from 'vite-plugin-importmap'

const context = process.env.VITE_CONTEXT_TYPE
const isNetEnv = context === 'net'

const createRollupOptions = () => {
  const input: Record<string, string> = {
    main: './index.html',
    popup: './popup.html',
    background: './src/background-scripts/index.ts'
  }

  if (isNetEnv) {
    delete input.background
    delete input.popup
  }

  const result: BuildOptions['rollupOptions'] = {
    input,
    output: {
      entryFileNames({ facadeModuleId }) {
        if (facadeModuleId?.includes('background-scripts')) {
          return 'background.js'
        }

        return `assets/[name]-[hash].js`
      },
    },
  }

  return result
}

export default defineConfig({
  plugins: [
    importmap(context),
    vue(),
    copyChromeExtManifest()
  ],

  resolve: {
    alias: {
      '@': '/src'
    }
  },

  server: {
    host: true,
    port: 7493,
  },

  build: {
    minify: false,

    rollupOptions: createRollupOptions()
  }
})

function copyChromeExtManifest() {
  let config: ResolvedConfig
  const manifestName = 'chrome-ext-manifest.json'

  function copy() {
    if (isNetEnv) return;

    const { root, build } = config

    const outDir = path.join(root, build.outDir)

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

    fs.cpSync(path.join(root, manifestName), path.join(outDir, 'manifest.json'))

    fs.cpSync(path.join(root, 'icons'), path.join(outDir, 'icons'), {
      recursive: true
    })
  }

  return {
    name: 'copy-chrome-ext-manifest',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    configureServer(server) {
      if (isNetEnv) return;

      const { watcher } = server

      watcher.add(path.join(config.root, manifestName))

      watcher.on('change', (p) => {
        if (path.basename(p) !== manifestName) return

        copy()
      })
    },

    writeBundle() {
      copy()
    }
  } as Plugin
}
