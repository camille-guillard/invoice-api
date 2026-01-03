export default {
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  mutate: [
    'src/domain/**/*.js',
    'src/application/**/*.js',
    'src/infrastructure/**/*.js',
    '!src/index.js',
    '!src/infrastructure/http/swagger.js',
    '!src/infrastructure/http/server.js'
  ],
  reporters: ['progress', 'clear-text', 'html'],
  htmlReporter: {
    fileName: 'mutation-report.html'
  },
  thresholds: {
    high: 90,
    low: 70,
    break: 95
  },
  timeoutMS: 60000,
  concurrency: 4,
  ignoreStatic: true
};
