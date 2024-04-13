import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import compressPlugin from 'vite-plugin-compression'
// import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueJsx({}),
    compressPlugin(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })]
    }),
    // VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.vue', '.ts', '.json']
  },
  assetsInclude: ['./src/assets'],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/scss/element.scss" as *;`
      }
    }
  }
})
