import { createLogger, stdSerializers } from 'bunyan';

export default class Logger {
  constructor(opts:any) {
    return createLogger({
      name: 'N/A',
      level: 'info',
      src: true,
      serializers: stdSerializers,
      ...opts,
    });
  }
}
