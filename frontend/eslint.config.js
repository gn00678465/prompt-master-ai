import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  jsonc: false,
  yaml: false,
  jsx: true,
  javascript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  ignores: [
    '**/routeTree.gen.ts'
  ]
})
