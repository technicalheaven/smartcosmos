import { NextFunction } from 'express'
import { logger } from '../../../../libs/logger'
import { Socket } from 'socket.io'
import { SyncService} from '../services/sync'
import { fetchDeviceInfo } from '../../utils/utilityFunctions'

const localConstant = require('../../utils/constants')



export interface WebSocket extends Socket {
    tenantId: string
    deviceIdentifier: string
    deviceType: string
    clientIdentifier: string
    reSyncData : any
}

export class SocketConnection {
    IO: any
    syncService: SyncService | undefined
    constructor(syncService: SyncService) {
        const io = require('socket.io')(syncService?.httpServer, {
            cors: {
            },
          })
        this.syncService = syncService
        this.IO = io
        this.IO.use(checkClient)
        this.IO.on('connection', this.socketInstance)
    }

    public getIO() {
        return this.IO
    }

    public socketInstance = async (socket: WebSocket) => {
        try {
            this.syncService?.onNewConnection(socket);

            
        }
        catch (error: any) {
            logger.error('Failed to perform processing on socket')
        }
    }

}

// this function will extract tenantId/deviceId(in case of HHD)/deviceMangerId(in case of deviceManger)
export async function checkClient(socket: WebSocket, next: NextFunction) {
    try {
        logger.info("Handshake values ", socket.handshake.url, socket.handshake.auth, socket.handshake.query)

        const reSyncData : any = socket.handshake.auth?.reSyncData
        const deviceType: any = socket.handshake.query?.type
        if (!deviceType) {
            logger.error('Failed to get deviceType from client to sync data')
            return next(new Error('Failed to get deviceType from client to sync data'))
        }
        const deviceId = socket.handshake.auth?.deviceId
        logger.debug('deviceType in checkClient', deviceId)

        const device = deviceId
        if (!device) {
            logger.error('Failed to get deviceId from client to sync data')
            return next(new Error('Failed to get deviceId from client to sync data'))
        }

        // authenticate client
        const result:any = await fetchDeviceInfo(device)
        logger.debug("Result in checkClient", result)
       if(!result?.isDeviceValid) {
        logger.error('Not a valid client',`${device}-${result?.tenantId}`)
        socket.disconnect()
        return next(new Error('Not a valid cleint'))
        }
        const tenantId = result?.tenantId

        if (!tenantId) {
            logger.error('Failed to get tenantId from client to sync data')
            return next(new Error('Failed to get tenantId from client to sync data'))
        }
        if (!(result?.status === localConstant.IDLE || result?.status === localConstant.RUNNING || result?.status === localConstant.ACTIVE)) {
            return next(new Error('Device is not Active'))
        }

        socket.tenantId = tenantId
        socket.deviceIdentifier = deviceId
        socket.deviceType = deviceType
        socket.reSyncData = reSyncData
        socket.clientIdentifier = `${device}-${tenantId}`
        logger.debug("clientIdentifier..", socket.clientIdentifier)
        next()
        return Promise.resolve()
    } catch (err: any) {
        logger.error(`Failed to validate client for socket_ ${socket.clientIdentifier}`, err?.message)
      //  return Promise.reject(err.message)
    }
}


