// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            ':matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction, TSMethodSignature, TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSFunctionType) > :matches(Identifier, RestElement, ObjectPattern, ArrayPattern)[typeAnnotation]:has(TSAnyKeyword), :matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction, TSMethodSignature, TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSFunctionType) > AssignmentPattern > :matches(Identifier, ObjectPattern, ArrayPattern)[typeAnnotation]:has(TSAnyKeyword), TSParameterProperty[parameter.typeAnnotation]:has(TSAnyKeyword)',
          message: 'Avoid using any for parameter types.',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
