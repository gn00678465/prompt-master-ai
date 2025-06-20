import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      // https://react.dev/learn/react-compiler
      react: {
        babel: {
          plugins: [
            [
              'babel-plugin-react-compiler',
              {
                target: '19',
              },
            ],
          ],
        },
      },

      tsr: {
        quoteStyle: 'double',
        semicolons: true,
      },
    }),
  ],
})
