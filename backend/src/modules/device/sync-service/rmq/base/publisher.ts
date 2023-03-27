import * as RMQ from 'amqp-ts'
import { logger } from '../../../../../libs/logger'

export class Publisher {
  connection: RMQ.Connection | undefined | null
  exchange: RMQ.Exchange | undefined
  queue: RMQ.Queue | undefined

  constructor(url: string, exchange: string, exchangeType: string) {
    try {
      if (!this.connection) {
        this.connection = new RMQ.Connection(url)
      }

      this.initExchange(exchange, exchangeType)
    } catch (err) {
      logger.error('error in creating rmq connection for publisher')
    }
  }

  initExchange(exchange: string, exchangeType: string) {
    try {
      this.exchange = this.connection?.declareExchange(exchange, exchangeType, {
        durable: true,
      })
    } catch (err) {
      logger.error(`error in creating exchange: ${exchange} in publisher`)
    }
  }

  /**
   *
   * @param message - the message to be send
   * @param key - pattern/key to match for the queue
   * @param opts - options to provide in message
   */

  async publish(message: any, key: string, opts: any = {}) {
    let msg = new RMQ.Message(message, opts)
    // logger.info('Msg: ', msg, 'key: ', key, message);
    this.exchange?.send(msg, key);
  }
}
