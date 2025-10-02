import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

/**
 * Configuración PostCSS para Vite/Tailwind.
 * - Define options.from para eliminar el warning:
 *   "A PostCSS plugin did not pass the `from` option to postcss.parse"
 * - Desactiva sourcemaps en producción para builds más consistentes en Docker.
 */
export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
  // Estas opciones son consumidas por postcss-load-config y aplicadas a PostCSS
  options: {
    from: undefined,
    map: false,
  },
};
