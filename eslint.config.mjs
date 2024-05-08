import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  { files: ["**/*.js"], languageOptions: {sourceType: "commonjs"} },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    ignores: ["dist", "eslint.config.mjs"],
  },
  {
    rules: {
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-unused-vars': 'warn',
      'no-undef': 'warn'
    }
  },
];