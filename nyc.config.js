const covMin = process.env.COV_MIN || 100;

module.exports = {
  "require": [
    "ts-node/register",
    "source-map-support/register",
  ],
  "cache": false,
  "extension": [".ts"],
  "include": [
    "src/**/*.ts",
  ],
  "exclude": [
    "**/*_sql.ts",
    "**/*.test.ts",
    "**/src/@types/**/index.d.ts",
    "**/*.test_*.ts",
    "**/*.test.tsx",
    "**/*.test_*.tsx",
    "**/*.type.ts",
    "**/*.provider.ts",
    "**/*.default.ts",
    "**/*.default.tsx",
    "**/bootstrap.ts",
    "**/index.ts",
    "**/index.tsx",
    "src/ioc.ts"
  ],
  "check-coverage": true,
  "statements": covMin,
  "branches": covMin,
  "lines": covMin,
  "functions": covMin,
  "sourceMap": true,
  "instrument": true,
  "reporter": [
    "text",
    "html",
    "cobertura",
  ],
  "all": true,
};
