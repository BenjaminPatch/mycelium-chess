import { SDK_LOG_LEVELS } from '../constants';

const urlParams = new URLSearchParams(window.location.search);
const queryLogLevel = 'warn';
const logLevel = SDK_LOG_LEVELS[queryLogLevel] || SDK_LOG_LEVELS.warn;

const postLogConfig = {
  name: 'SDK_LOGS',
  batchSize: 85,
  intervalMs: 2000,
  url: '/logs',
  logLevel
};

const config = {
  logLevel,
  postLogConfig
};

export default config;
