// PostCSS configuration for Next.js + Tailwind CSS v4
//
// @tailwindcss/postcss replaces the @tailwindcss/vite plugin used in the
// Vite build. Functionality is identical — Tailwind v4 features (@theme,
// @custom-variant, @source, etc.) are all supported.
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
