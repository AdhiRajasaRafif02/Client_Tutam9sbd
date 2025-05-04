import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_APP_API_BASE_URL': JSON.stringify(
      process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000' // Fallback to localhost
    ),
  },
});
