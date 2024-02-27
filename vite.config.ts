import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: '/src/components',
      api: '/src/api',
      types: '/src/types',
      data: '/src/data'
    }
  }
});
