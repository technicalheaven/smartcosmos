import * as RMQ from 'amqp-ts'
import { logger } from '../../../../../libs/logger'


export class Consumer {
  connection: RMQ.Connection | undefined | null
  exchange: RMQ.Exchange | undefined
  queue: RMQ.Queue | undefined
  constructor(url: string, exchange: string, exchangeType: string = 'topic') {
    try {
      if (!this.connection) {
        this.connection = new RMQ.Connection(url)
      }

      this.initExchange(exchange, exchangeType)
    } catch (err) {
      logger.error('error in creating rmq connection for consumer')
    }
  }

  initExchange(exchange: string, exchangeType: string) {
    try {
      this.exchange = this.connection?.declareExchange(exchange, exchangeType, {
        durable: true,
      })
    } catch (err) {
      logger.error(`error in creating exchange: ${exchange} for consumer`)
    }
  }

  initQueue(queueName: string, pattern: string, queueConfig?: any) {
    try {
      this.queue = this.connection?.declareQueue(queueName, queueConfig || { durable: true })
      if (this.exchange) this.queue?.bind(this.exchange!!, pattern)
      return this.queue
    } catch (err) {
      logger.error(`error in creating queue: ${queueName} :`)
    }
  }

}
