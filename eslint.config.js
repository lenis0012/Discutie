import neostandard from 'neostandard'

export default [
  ...neostandard({
    env: ['browser'],
    ts: true,
    files: ['src/**/*.js', 'src/**/*.jsx'],
    filesTs: ['src/**/*.ts', 'src/**/*.tsx'],
  }),
  {
    rules: {
      '@stylistic/multiline-ternary': 'off'
    }
  }
]
