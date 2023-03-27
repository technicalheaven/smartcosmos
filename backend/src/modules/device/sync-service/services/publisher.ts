import * as RMQ from 'amqp-ts'
import { logger } from '../../../../libs/logger'
import { RMQExchange } from '../rmq/base/rmqExchange';
import { QMessageFormat } from '../rmq/helpers/rmqConfig';

export class Publisher {
  queue: RMQ.Queue | undefined
  exchange: RMQExchange | undefined

  init(exchange: RMQExchange) {
    this.exchange = exchange
  }

  close() {

  }

  async processNotification(data: any, tenantId: string, deviceId: string) {
    //TODO add to notification queue
    let routingKey = `${tenantId}.${deviceId}`
    logger.debug("Inside processNotification....>>>", data, routingKey)
    this.publish(data, routingKey)


  }

  /**
   *
   * @param message - the message to be send
   * @param key - pattern/key to match for the queue
   * @param opts - options to provide in message
   */

  // async publish(message: any, key: string, opts: any = {}) {
  //   let msg = new RMQ.Message(message, opts)
  //   // console.log('Msg: ', msg, 'key: ', key, message);
  //   this.exchange?.sendMessage(msg, key);
  // }

  async publish(message: any, key: string, opts: any = {}) {
    logger.debug('Message before publishing: ', message)

    let msg : QMessageFormat = {
      type: message.type,
      entity: "",
      action: "",
      params: "",
      tenantId: "",
      data: message.data

    }
    //let msg = new RMQ.Message(message, opts)
    // console.log('Msg: ', msg, 'key: ', key, message);
    logger.debug("Msg Data inside publish method", msg, key)
    this.exchange?.sendMessage(msg, key);
  }
}
