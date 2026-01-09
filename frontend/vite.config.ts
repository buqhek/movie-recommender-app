import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.MAC_BACKEND_URL || env.DESKTOP_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
