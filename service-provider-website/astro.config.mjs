// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  output: 'hybrid',

  integrations: [icon()],

  adapter: netlify()
});