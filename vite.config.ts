import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'cross-spawn'

import { defineConfig } from 'vite'
import type { Plugin, ResolvedConfig, BuildOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import { NAMESPACE } from './src/constants'

export default defineConfig({
  base: './',

  plugins: [
    vue(),
    jsx(),
    copyChromeExtManifest(),
    buildThemes(),
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

function buildThemes() {
  let config: ResolvedConfig
  function copy() {
    const { root, build } = config
    const themesDist = path.join(root, 'themes', 'dist')

    if (!fs.existsSync(themesDist)) {
      throw new Error('themes dist not found')
    }

    const outDir = path.join(root, build.outDir)

    fs.cpSync(themesDist, path.join(outDir, 'themes'), {
      recursive: true
    })
  }

  return {
    name: 'build-themes',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    writeBundle() {
      if (config.build.watch) return;
      const build = spawn('pnpm', ['build'], { cwd: path.join(config.root, 'themes'), stdio: 'inherit' })

      build.on('close', (code) => {
        if (code !== 0) return;

        copy()
      })

    }
  } as Plugin

}

function copyChromeExtManifest() {
  let config: ResolvedConfig
  const extDir = 'chrome-extension'

  function copy() {
    const { root, build } = config

    const outDir = path.join(root, build.outDir)

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

    fs.cpSync(path.join(root, extDir), outDir, {
      recursive: true
    })

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
      const { watcher } = server

      watcher.add(path.join(config.root, extDir))

      watcher.on('change', (p) => {
        if (!p.startsWith(path.join(config.root, extDir))) return

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

  const result: BuildOptions['rollupOptions'] = {
    input,
    output: {
      entryFileNames({ name }) {
        if (name === 'background') return 'background.js'

        return `assets/[name]-[hash].js`
      },

      sourcemap: true
    },
  }

  return result
}