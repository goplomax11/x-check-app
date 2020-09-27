module.exports = {
  extends: ['airbnb-typescript-prettier'],
  overrides: [
    Object.assign(
      {
        files: ['**/*.test.js'],
        env: { jest: true },
        plugins: ['jest'],
      },
      require('eslint-plugin-jest').configs.recommended
    ),
  ],
};
