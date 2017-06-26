import {helpers} from 'inversify-vanillajs-helpers'

import minilog from 'minilog'

export class Logger {
  constructor () {
    minilog.enable()
  }

  get (namespace) {
    return minilog(namespace)
  }
}

helpers.annotate(Logger)
