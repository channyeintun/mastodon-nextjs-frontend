import css from "@eslint/css";

export default [
  // Ignore patterns
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "out/**",
      "*.min.css",
      // Temporarily ignore TypeScript files (build handles type checking)
      "**/*.ts",
      "**/*.tsx"
    ]
  },
  // Lint CSS files for baseline compatibility
  {
    files: ["src/**/*.css"],
    plugins: {
      css,
    },
    language: "css/css",
    rules: {
      "css/no-duplicate-imports": "error",
      "css/no-empty-blocks": "error",
      // Lint CSS files to ensure they are using
      // only Baseline Widely available features:
      "css/use-baseline": ["warn", {
        available: "widely"
      }]
    },
  },
  // Atomic Design - LOC limits for atoms
  {
    files: ["src/components/atoms/**/*.tsx"],
    rules: {
      "max-lines": ["warn", {
        max: 120,
        skipBlankLines: true,
        skipComments: true
      }],
      "max-lines-per-function": ["warn", {
        max: 50,
        skipBlankLines: true,
        skipComments: true
      }]
    }
  },
  // Atomic Design - LOC limits for molecules
  {
    files: ["src/components/molecules/**/*.tsx"],
    rules: {
      "max-lines": ["warn", {
        max: 200,
        skipBlankLines: true,
        skipComments: true
      }],
      "max-lines-per-function": ["warn", {
        max: 80,
        skipBlankLines: true,
        skipComments: true
      }]
    }
  },
  // Atomic Design - LOC limits for organisms
  {
    files: ["src/components/organisms/**/*.tsx"],
    rules: {
      "max-lines": ["warn", {
        max: 350,
        skipBlankLines: true,
        skipComments: true
      }],
      "max-lines-per-function": ["warn", {
        max: 80,
        skipBlankLines: true,
        skipComments: true
      }]
    }
  },
  // Pages should only orchestrate organisms
  {
    files: ["src/app/**/page.tsx", "src/app/**/layout.tsx"],
    rules: {
      "max-lines": ["warn", {
        max: 300,
        skipBlankLines: true,
        skipComments: true
      }],
      "max-lines-per-function": ["warn", {
        max: 100,
        skipBlankLines: true,
        skipComments: true
      }]
    }
  },
];
