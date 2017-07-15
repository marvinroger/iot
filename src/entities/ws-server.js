import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import WebSocket from 'ws'
import cookie from 'cookie'

import {parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'

export class WsServer {
  constructor (httpServer, authTokenModel, requestResponder, updateBus) {
    const AuthToken = authTokenModel.get()
    this._requestResponder = requestResponder
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

      this._requestResponder.sendInitialMessages(ws)
    })

    this._updateBus.on('broadcast', message => this.broadcast(message))
  }

  getClients () {
    return this._clients
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

helpers.annotate(WsServer, [TYPES.HttpServer, TYPES.models.AuthToken, TYPES.RequestResponder, TYPES.UpdateBus])
