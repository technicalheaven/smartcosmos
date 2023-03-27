import { FAILURE, SUCCESS } from "../../../../core/controllers/constants";
import { logger } from "../../../../libs/logger";

// publish message for defined queue for device manager exchange
export const rcvMsg = async (data: any, routingKey: string, connection: any) => {
    try {
        const tenantId = data?.tenantId
        if (!tenantId) {
            logger.error('Tenant id is not received for data', data)
            return Promise.reject(FAILURE);
        }

        logger.debug(`Received data for tenant ${tenantId} on websocket`, data);


        if (!routingKey) {
            logger.error('routing key is not received to publish data')
            return Promise.reject(FAILURE);
        }

        connection.publish(data, routingKey)

        return Promise.resolve(SUCCESS);

    } catch (err: any) {
        logger.error('Received Invalid Data for publishing on websocket',err.message);
        return Promise.reject(FAILURE);
    }
}
