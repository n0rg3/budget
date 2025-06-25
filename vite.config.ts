import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/budget/', // важно для GitHub Pages
  plugins: [react()],
});
