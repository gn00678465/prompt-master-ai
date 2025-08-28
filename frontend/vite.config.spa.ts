import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { mergeConfig } from 'vite'
import config from './vite.config'

export default mergeConfig(config, {
  plugins: [
    tanstackStart({
      // https://react.dev/learn/react-compiler
      customViteReactPlugin: true,

      tsr: {
        quoteStyle: 'double',
        semicolons: true,
      },
      spa: {
        enabled: true,
      },
    }),
    viteReact(),
  ],
})
