// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // www.insighthub.au 301s to this apex host, and extensionless paths 301 to a trailing slash.
  site: 'https://insighthub.au',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  },

  output: 'static',

  integrations: [
    icon(),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return !pathname.startsWith("/admin") && !pathname.startsWith("/palette");
      },
    }),
  ],

  adapter: netlify()
});