import neostandard from 'neostandard'

// Use javascript standard style with some relaxations to fix annoyances
export default [
  ...neostandard({
    env: ['browser'],
    ts: true,
  }),
  {
    rules: {
      // Conflicts with the if-else JSX workflow
      '@stylistic/multiline-ternary': 'off',
      // Conflicts with JSX comments
      '@stylistic/spaced-comment': 'off',
      // Skip blank lines because the IDE inserts alignment automatically
      '@stylistic/no-trailing-spaces': ['error', { skipBlankLines: true }],
      // Not recommended for new projects by typescript-eslint
      '@typescript-eslint/no-redeclare': 'off',
    }
  }
]
