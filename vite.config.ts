import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE')

  return {
    base: env.VITE_BASE,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.vue', '.ts', '.json']
    },
    root: process.cwd(),
    assetsInclude: ['./src/assets'],
    plugins: [
      vue(),
      // vueJsx({}),
      // compressPlugin(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver({
          importStyle: 'sass'
        })]
      }),
      // ElementPlus({
      //   useSource: true,
      //   defaultLocale: 'ru'
      // }),
      Inspect()
    ],
    define: {
      __APP_ENV__: env.APP_ENV
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/element.scss" as *;`
        }
      }
    }
  }
})
