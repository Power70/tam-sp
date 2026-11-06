import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import { globalIgnores } from 'eslint/config';

export default tseslint.config(
  globalIgnores(['dist/**', 'node_modules/**']),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    ignores: ['dist/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'react-hooks/set-state-in-effect': 'off',
    },
  }
);
