/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Предупреждает, если явно указанный аргумент типа является значением по умолчанию для этого параметра типа.
    '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    // Проверка чтобы имена компонентов всегда состояли из нескольких слов.
    'vue/multi-word-component-names': 'off',
    // Проверка регистра для стиля именования компонентов в шаблоне.
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: true
      }
    ],
    // Проверка порядка атрибутов.
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ],
        alphabetical: false
      }
    ],
    // Проверка на максимальное количество атрибутов в строке.
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1
        },
        multiline: {
          max: 1
        }
      }
    ],
    // Проверка на самозакрывающийся тег или компонент.
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    // Проверка последовательного отступа в шаблоне <template>.
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: []
      }
    ],
    // Проверка нерегулярных пробелов.
    'vue/no-irregular-whitespace': [
      'error',
      {
        skipStrings: true,
        skipComments: false,
        skipRegExps: false,
        skipTemplates: false,
        skipHTMLAttributeValues: false,
        skipHTMLTextContents: false
      }
    ],
    // Проверка на определенный регистр для имени компонента.
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    // Проверка имени компонента — оно должно соответствовать имени файла, в котором он находится.
    'vue/match-component-file-name': [
      'error',
      {
        extensions: ['vue'],
        shouldMatchCase: false
      }
    ],
    // Запретить дублирование имен полей.
    'vue/no-dupe-keys': [
      'error',
      {
        groups: []
      }
    ],
    // Проверка запятых.
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    // Стиль разрыва строки linebreak-style: ["error", "unix || windows"].
    'linebreak-style': ['error', 'unix'],
    // Без console.log.
    'no-console': 'error',
    // Без debugger.
    'no-debugger': 'error',
    // Скобки в стрелочной функции.
    'arrow-parens': ['error', 'as-needed'],
    // Запрещает унарные операторы ++и --.
    'no-plusplus': 'off',
    // конструкторы производных классов должны вызывать super().
    // Конструкторы не производных классов не должны вызывать super().
    'constructor-super': 'off',
    // Заключение сложных выражений в круглые скобки проясняет замысел разработчика.
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['+', '-', '*', '/', '%', '**'],
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof']
        ],
        allowSamePrecedence: true
      }
    ],
    // Обеспечить согласованное использование расширения файла в пути импорта.
    'import/extensions': 'off',
    // ESLint предпочитает экспорт по умолчанию импорт/предпочитает экспорт по умолчанию.
    'import/prefer-default-export': 'off',
    // Нет неиспользуемых выражений.
    'no-unused-expressions': 'error',
    // Без переназначения параметров.
    'no-param-reassign': 'off',
    // Требуется деструктуризация массивов и/или объектов.
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    // Запрещает побитовые операторы.
    'no-bitwise': [
      'error',
      {
        allow: ['~']
      }
    ],
    // Запрещает неиспользуемые переменные.
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_'
      }
    ],
    // Обеспечивает максимальную длину строки.
    'max-len': [
      'error',
      {
        code: 120
      }
    ],
    // Применяет согласованные разрывы строк после открытия и перед закрытием фигурных скобок.
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          consistent: true
        },
        ObjectPattern: {
          multiline: true,
          consistent: true
        }
      }
    ],
    // Требует или запрещает пустую строку между членами класса.
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true
      }
    ]
  }
}
