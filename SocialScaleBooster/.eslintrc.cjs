module.exports = {
  root: true,

  overrides: [
    {
      files: ['client/src/**/*.{ts,tsx}'],
      rules: {
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },

    {
      files: ['server/**/*.ts', 'shared/**/*.ts'],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
  ],
};