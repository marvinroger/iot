import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import WebSocket from 'ws'
import cookie from 'cookie'

import {generateMessage, parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'
import {EVENT_TYPES} from '../../common/event-types'
import {DEVICE_UPDATE_TYPES} from '../../common/device-update-types'
import {ROOM_UPDATE_TYPES} from '../../common/room-update-types'

export class WsServer {
  constructor (httpServer, authTokenModel, room, meta, devicePool, requestResponder) {
    const AuthToken = authTokenModel.get()
    this._Room = room.get()
    this._Meta = meta.get()
    this._devicePool = devicePool
    this._requestResponder = requestResponder

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

      ws.on('message', async (data) => {
        const message = parseMessage(data)

        if (message.type !== MESSAGE_TYPES.REQUEST) return

        this._requestResponder.handle({ request: message, ws, user: req.user })
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

      const roomsPositions = await this._Meta.where({ key: 'roomsPositions' }).fetch()
      const rooms = await this._Room.fetchAll()

      for (const room of rooms.models) {
        const roomPosition = roomsPositions.attributes['value'].filter(elem => elem.i === room.id.toString())[0]
        ws.send(generateMessage({
          type: MESSAGE_TYPES.EVENT,
          event: EVENT_TYPES.ROOM_UPDATE,
          value: {
            type: ROOM_UPDATE_TYPES.ROOM_ADDED,
            id: room.id.toString(),
            name: room.attributes['name'],
            position: roomPosition
          }
        }))
      }
    })
  }

  getClients () {
    return this._clients
  }

  get () {
    return this._wsServer
  }
}

helpers.annotate(WsServer, [TYPES.HttpServer, TYPES.models.AuthToken, TYPES.models.Room, TYPES.models.Meta, TYPES.DevicePool, TYPES.RequestResponder])
