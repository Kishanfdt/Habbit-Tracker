import pino from 'pino';

const nodeEnv = process.env.NODE_ENV || 'development';

const getLogLevel = (): pino.LevelWithSilent => {
  if (nodeEnv === 'test') {
    return 'silent';
  }
  if (nodeEnv === 'production') {
    return 'warn';
  }
  return 'debug';
};

export const logger = pino({
  level: getLogLevel(),
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
