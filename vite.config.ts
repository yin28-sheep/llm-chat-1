import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://maas-api.cn-huabei-1.xf-yun.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'Authorization': 'sk-4et9jiY6FXWulZNX94295c643b52446bA3A04370C9412c44'
        }
      }
    }
  },
  envPrefix: 'VITE_'
})
