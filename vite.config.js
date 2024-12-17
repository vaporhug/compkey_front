import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.178.252:9031', // 后端地址
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // },
  // devServer: {
  //   host: '0.0.0.0',
  //   port: 5174
  // }

})
