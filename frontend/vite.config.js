import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/canvas-konva-annotation-app/',
  plugins: [react()],
})
