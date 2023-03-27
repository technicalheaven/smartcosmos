import { publishEntity } from "../../services/sync"
import { logger } from "../../../../../libs/logger"
import { QMessageFormat } from "./rmqConfig"

export const publishMsg = async (data: any, tenantId: string, entity: string, action: string, params?:any, type: string = 'config') => {
    try {
        // const routingKey = `${data.tenantId}.cloud`
        const dataForPublish: QMessageFormat = {
            type: type,
            entity: entity,
            action: action,
            params: params,
            tenantId: tenantId,
            data: data
        }
        publishEntity(dataForPublish)
        return Promise.resolve()
    } catch (err: any) {
        logger.error(`Failed to publish msg ${data}`)
        return Promise.reject()
    }
}
