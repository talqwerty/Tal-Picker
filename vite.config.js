import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ThaiDatePicker',
      fileName: (format) => `thai-datepicker.${format}.js`,
      formats: ['es', 'umd', 'iife']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'thai-datepicker.css'
          }
          return assetInfo.name
        }
      }
    },
    cssCodeSplit: false,
    extract: true
  }
})