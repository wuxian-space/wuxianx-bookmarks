import fs from 'node:fs'
import path from 'node:path'

import { defineConfig } from 'vite'
import type { Plugin, ResolvedConfig, BuildOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// @ts-ignore
import importmap from 'vite-plugin-importmap'

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import { NAMESPACE } from './src/constants'

const context = process.env.VITE_CONTEXT_TYPE
const isNetEnv = context === 'net'

export default defineConfig({
  base: './',

  plugins: [
    importmap(context),
    vue(),
    jsx(),
    copyChromeExtManifest(),
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next',
      })],
      dts: false
    }),
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next',
        resolveIcons: true
      })],
      dts: false
    }),
    vueDevTools()
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        $namespace:${NAMESPACE};
        @import "@/styles/index.scss";
        `
      }
    }
  },

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


function createRollupOptions() {
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
      entryFileNames({ name }) {
        if (name === 'background') return 'background.js'

        return `assets/[name]-[hash].js`
      }
    },
  }

  return result
}