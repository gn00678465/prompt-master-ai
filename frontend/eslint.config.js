import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  jsonc: false,
  yaml: false,
  jsx: true,
  javascript: true,
  markdown: false,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  ignores: [
    '**/routeTree.gen.ts',
  ],
})
