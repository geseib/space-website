import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When deployed to GitHub Pages at https://<user>.github.io/<repo>/, the
// workflow sets BASE_PATH=/<repo>/. Locally, fall back to './' so assets
// resolve for plain file-based previews as well.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || './',
})
