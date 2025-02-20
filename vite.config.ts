import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://maas-api.cn-huabei-1.xf-yun.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*'
            proxyRes.headers['Access-Control-Allow-Methods'] = '*'
            proxyRes.headers['Access-Control-Allow-Headers'] = '*'
          })
        }
      }
    }
  },
  envPrefix: 'VITE_'
})
