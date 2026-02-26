#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { extractCoverage } = require('@nicolawealth/code_coverage_extractor');

const coverageData = JSON.parse(fs.readFileSync('./coverage/coverage-final.json', 'utf-8'));
const coverage = extractCoverage(coverageData, './codecov/badge.json');
const intCov = Math.floor(parseFloat(coverage));

console.log(`Coverage: ${coverage}%`);

if (process.env.GITHUB_ENV) {
  fs.appendFileSync(process.env.GITHUB_ENV, `COVERAGE=${coverage}\n`);
  fs.appendFileSync(process.env.GITHUB_ENV, `INT_COV=${intCov}\n`);
}
