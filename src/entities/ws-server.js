import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import WebSocket from 'ws'
import cookie from 'cookie'

import {generateMessage, parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'
import {EVENT_TYPES} from '../../common/event-types'
import {DEVICE_UPDATE_TYPES} from '../../common/device-update-types'

export class WsServer {
  constructor (httpServer, authTokenModel, devicePool, updateBus) {
    const AuthToken = authTokenModel.get()
    this._devicePool = devicePool
    this._updateBus = updateBus

    this._wsServer = new WebSocket.Server({
      server: httpServer.get(),
      async verifyClient (info, cb) {
        // eslint-disable-next-line standard/no-callback-literal
        const fail = () => cb(false, 401, 'Unauthorized')
        const cookies = info.req.headers.cookie ? cookie.parse(info.req.headers.cookie) : null
        if (!cookies || !cookies['ACCESSTOKEN']) return fail()
        const tokenModel = await AuthToken.where({ token: cookies['ACCESSTOKEN'] }).fetch({ withRelated: ['user'] })
        if (tokenModel && !tokenModel.attributes['revoked']) {
          info.req.user = tokenModel.related('user')
          // eslint-disable-next-line standard/no-callback-literal
          return cb(true)
        } else return fail()
      }
    })

    this._clients = new Set()

    this._updateBus.on('update', (data) => {
      this.broadcast(generateMessage({
        type: MESSAGE_TYPES.EVENT,
        event: EVENT_TYPES.DEVICE_UPDATE,
        value: data
      }))
    })
  }

  setup () {
    this._wsServer.on('connection', async (ws, req) => {
      const clientObject = {
        user: req.user,
        ws
      }
      this._clients.add(clientObject)

      ws.on('close', () => {
        this._clients.delete(clientObject)
      })

      const sendResponse = (request, value) => {
        ws.send(generateMessage({ type: MESSAGE_TYPES.RESPONSE, id: request.id, value }))
      }

      ws.on('message', (data) => {
        const message = parseMessage(data)

        if (message.type !== MESSAGE_TYPES.REQUEST) return

        if (message.method === 'triggerAction') {
          const {action, deviceId, params} = message.parameters

          const device = this._devicePool.getDevice(deviceId)
          if (!device) return sendResponse(message, false)

          device.getPlugin().handleAction({
            deviceId,
            action,
            params
          })

          sendResponse(message, true)
        }
      })

      // sending initial messages

      for (const device of this._devicePool.getDevices()) {
        ws.send(generateMessage({
          type: MESSAGE_TYPES.EVENT,
          event: EVENT_TYPES.DEVICE_UPDATE,
          value: {
            type: DEVICE_UPDATE_TYPES.DEVICE_ADDED,
            id: device.getId(),
            value: {
              id: device.getId(),
              online: device.getOnline(),
              name: device.getName(),
              properties: device.getProperties(),
              actions: device.getActions(),
              image: device.getImage()
            }
          }
        }))
      }
    })
  }

  broadcast (message) {
    for (const client of this._clients) {
      client.ws.send(message)
    }
  }

  get () {
    return this._wsServer
  }
}

helpers.annotate(WsServer, [TYPES.HttpServer, TYPES.models.AuthToken, TYPES.DevicePool, TYPES.UpdateBus])
