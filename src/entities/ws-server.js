import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import WebSocket from 'ws'
import cookie from 'cookie'

export class WsServer {
  constructor (httpServer, authTokenModel, devicePool) {
    const AuthToken = authTokenModel.get()
    this._devicePool = devicePool

    this._wsServer = new WebSocket.Server({
      server: httpServer.get(),
      async verifyClient (info, cb) {
        const fail = () => cb(false, 401, 'Unauthorized')
        const cookies = info.req.headers.cookie ? cookie.parse(info.req.headers.cookie) : null
        if (!cookies || !cookies['ACCESSTOKEN']) return fail()
        const tokenModel = await AuthToken.where({ token: cookies['ACCESSTOKEN'] }).fetch({ withRelated: ['user'] })
        if (tokenModel && !tokenModel.attributes['revoked']) {
          info.req.user = tokenModel.related('user')
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

      ws.on('message', (data) => {
        console.log(data)
      })

      // sending initial messages

      for (const device of this._devicePool.getDevices()) {
        ws.send(JSON.stringify({
          id: device.getId()
        }))
      }
    })
  }

  get () {
    return this._wsServer
  }
}

helpers.annotate(WsServer, [TYPES.HttpServer, TYPES.models.AuthToken, TYPES.DevicePool])
