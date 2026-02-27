#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { extractCoverage } = require('@nicolawealth/code_coverage_extractor');

let coverageData;
try {
  const coverageRaw = fs.readFileSync('./coverage/coverage-final.json', 'utf-8');
  coverageData = JSON.parse(coverageRaw);
} catch (error) {
  console.error('Failed to read or parse ./coverage/coverage-final.json:', error);
  process.exit(1);
}

let coverage;
try {
  coverage = extractCoverage(coverageData, './codecov/badge.json');
} catch (error) {
  console.error('Failed to extract coverage from parsed data:', error);
  process.exit(1);
}

if (typeof coverage !== 'string') {
  console.error(`Invalid coverage value type from extractCoverage: ${typeof coverage}. Expected a numeric string.`);
  process.exit(1);
}

const parsedCoverage = parseFloat(coverage);
if (!Number.isFinite(parsedCoverage)) {
  console.error(`Invalid coverage value from extractCoverage: "${coverage}". Expected a numeric string.`);
  process.exit(1);
}

const intCov = Math.floor(parsedCoverage);

console.log(`Coverage: ${coverage}%`);

if (process.env.GITHUB_ENV) {
  fs.appendFileSync(process.env.GITHUB_ENV, `COVERAGE=${coverage}\n`);
  fs.appendFileSync(process.env.GITHUB_ENV, `INT_COV=${intCov}\n`);
}
