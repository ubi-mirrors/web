import { CoverageThresholdConfig, TestCoverage, CoverageConfig } from '@web/test-runner-core';
import path from 'path';
import { TerminalEntry } from '../Terminal';
import chalk from 'chalk';

const coverageTypes: (keyof CoverageThresholdConfig)[] = [
  'lines',
  'statements',
  'branches',
  'functions',
];

export function getTestCoverage(
  testCoverage: TestCoverage,
  watch: boolean,
  coverageConfig: CoverageConfig,
) {
  const entries: TerminalEntry[] = [];

  const coverageSum = coverageTypes.reduce((all, type) => all + testCoverage.summary[type].pct, 0);
  const avgCoverage = Math.round((coverageSum * 100) / 4) / 100;

  entries.push(
    `Test coverage: ${chalk[testCoverage.passed ? 'green' : 'red'](`${avgCoverage} %`)}`,
  );

  if (!watch && coverageConfig.report) {
    entries.push(
      `View full coverage report at ${chalk.underline(
        path.join(coverageConfig.reportDir, 'lcov-report', 'index.html'),
      )}`,
    );
  }

  entries.push('');

  return entries;
}
