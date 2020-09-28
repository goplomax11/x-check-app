module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  plugins: ["react", "@typescript-eslint", "prettier"],
  env: {
    "browser": true,
    "jasmine": true,
    "jest": true
  },
  ignorePatterns: ['src/**/*.test.js'],
  rules: {
    "prettier/prettier": ["error", { "singleQuote": true }],
    "react/display-name": 0,
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"]
  },
  settings: {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  parser: "@typescript-eslint/parser",
  extends: ['airbnb-typescript-prettier'],
};
