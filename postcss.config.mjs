/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind CSS v4 usa su propio plugin de PostCSS directamente
    "@tailwindcss/postcss": {},
  },
};

export default config;
