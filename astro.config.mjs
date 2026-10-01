// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  server: {
    port: 4321,
  },
  redirects: {
    '/product/sewerlight-600': '/',
    '/product/sewerlight-1200': '/',
  },
});
