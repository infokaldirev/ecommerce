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

    // Copy the user's webp image to public/products/ (only if missing)
    const rootWebp = path.resolve(__dirname, '1295618666295402496.webp');
    const destWebp = path.resolve(destDir, 'cordycafe.webp');
    const destWebpAlt = path.resolve(destDir, '1295618666295402496.webp');
    if (fs.existsSync(rootWebp)) {
      if (!fs.existsSync(destWebp)) {
        fs.copyFileSync(rootWebp, destWebp);
        console.log(`[Vite Startup] Copied Cordycafe webp to ${destWebp}`);
      }
      if (!fs.existsSync(destWebpAlt)) {
        fs.copyFileSync(rootWebp, destWebpAlt);
        console.log(`[Vite Startup] Copied Cordycafe webp alt to ${destWebpAlt}`);
      }
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
            if (!fs.existsSync(destPath)) {
              fs.copyFileSync(srcPath, destPath);
              console.log(`[Vite Startup] Copied product asset: ${file} -> ${destName}`);
            }
          }
        }
      });
    }
  }
});

// Custom middleware to save optimized images directly from browser canvas
const saveImagePlugin = () => ({
  name: 'save-image-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/save-optimized-image' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { filename, base64 } = JSON.parse(body);
            const buffer = Buffer.from(base64.split(',')[1], 'base64');
            const destPath = path.resolve(__dirname, 'public/products', filename);
            fs.writeFileSync(destPath, buffer);
            console.log(`[Vite Image Optimizer] Saved compressed asset: ${filename} (${buffer.length} bytes)`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, bytes: buffer.length }));
          } catch (err) {
            console.error('[Vite Image Optimizer] Error saving image:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyImagesPlugin(), saveImagePlugin()],
  base: './',
  server: {
    allowedHosts: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor-core';
          }
        }
      }
    }
  }
})
