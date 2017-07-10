import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

export class WsBroadcaster {
  constructor (wsServer) {
    this._wsServer = wsServer
  }

  broadcast (message) {
    for (const client of this._wsServer.getClients()) {
      client.ws.send(message)
    }
  }
}

helpers.annotate(WsBroadcaster, [TYPES.WsServer])
