// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.insighthub.au',
  vite: {
    plugins: [tailwindcss()]
  },

  output: 'static',

  integrations: [icon(), sitemap()],

  adapter: netlify()
});