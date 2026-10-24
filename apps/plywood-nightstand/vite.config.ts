import { defineConfig } from 'vite';
export default defineConfig({
  build: { rollupOptions: {
    input: { main: 'index.html', capture: 'capture.html' },
    output: { manualChunks(id) {
      if(id.includes('/three/build/three.core')) return 'three-core';
      if(id.includes('/three/build/')) return 'three-renderer';
      if(id.includes('/three/')) return 'three-tools';
    } }
  } }
});
