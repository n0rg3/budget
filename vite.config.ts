// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/budget/', // ⚠️ обязательно с косыми чертами
  plugins: [react()],
})
