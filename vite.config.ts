// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/budget/', // ⚠️ имя репозитория с косыми чертами
  plugins: [react()],
})
