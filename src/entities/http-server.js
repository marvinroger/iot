import {helpers} from 'inversify-vanillajs-helpers'

import http from 'http'

export class HttpServer {
  constructor () {
    this._httpServer = http.createServer()
  }

  get () {
    return this._httpServer
  }
}

helpers.annotate(HttpServer)
