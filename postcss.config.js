import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

/**
 * Silence "A PostCSS plugin did not pass the `from` option to postcss.parse"
 * by setting a global default 'from' value. This is safe for Vite builds.
 */
export default {
  from: undefined,
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
};
