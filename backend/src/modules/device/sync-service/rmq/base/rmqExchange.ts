import * as RMQ from 'amqp-ts'
import { logger } from '../../../../../libs/logger'

export class RMQExchange {

    connection: RMQ.Connection | undefined | null
    exchange: RMQ.Exchange | undefined | null
    rmqURL : string | ""

    constructor(url : string) {
        this.rmqURL = url
    }


    init(exchangeName: string, exchangeType: string, opts?: any) {
        try {

            this.connection = new RMQ.Connection(this.rmqURL)
            this.exchange = this.connection?.declareExchange(exchangeName, exchangeType, {
              durable: true,
            })
          } catch (err) {
            logger.error(`error in creating exchange: ${exchangeName} in exchange init`)
          }

    }

    initQueue(queueName: string, patterns: string[], queueConfig?: any) {

        let queue: RMQ.Queue | undefined
        try {
            logger.debug(`creating queue with name ${queueName} and pattern ${patterns}`)
            queue = this.connection?.declareQueue(queueName, queueConfig || { durable: true })
            if (this.exchange && patterns.length) {
              patterns.forEach((pattern:string) => {
                queue?.bind(this.exchange!!, pattern)
              });
            }
            
        } catch (err) {
            logger.error(`error in creating queue: ${queueName} :`) 
        }
        return queue
      }

    async sendMessage(msg: any, key: string, opts: any = {}) {
       try{
        // let msg = new RMQ.Message(message, opts)
        logger.debug('Msg: ', msg, 'key: ', key);
        this.exchange?.publish(msg, key);
       } catch (e: any) {
            logger.error('Exception caught in sendMessage: ')
       }
        
    }



    close() {
        logger.info(`Closing Exchange ${this.exchange?._name}`)
        this.connection?.close()

    }

}
