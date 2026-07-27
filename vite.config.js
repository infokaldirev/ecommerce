import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Auto-copy images on dev server start
const copyImagesPlugin = () => ({
  name: 'copy-tiens-images',
  buildStart() {
    const srcDir = 'C:\\Users\\Juan Andres\\.gemini\\antigravity\\brain\\185d602c-7d36-4290-8603-32040b660493';
    const destDir = path.resolve(__dirname, 'public/products');
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcDir)) {
      const files = fs.readdirSync(srcDir);
      const mapping = {
        'kit_energia_diaria': 'kit_energia_diaria.jpg',
        'kit_bienestar_huesos': 'kit_bienestar_huesos.jpg',
        'kit_antojo_saludable': 'kit_antojo_saludable.jpg'
      };

      files.forEach(file => {
        for (const [key, destName] of Object.entries(mapping)) {
          if (file.startsWith(key) && (file.endsWith('.jpg') || file.endsWith('.png'))) {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(destDir, destName);
            fs.copyFileSync(srcPath, destPath);
            console.log(`[Vite Startup] Copied product asset: ${file} -> ${destName}`);
          }
        }
      });
    }
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyImagesPlugin()],
})
