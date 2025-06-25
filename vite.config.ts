// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/budget/', // это важно для GitHub Pages
  plugins: [react()],
})
