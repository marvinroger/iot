import {helpers} from 'inversify-vanillajs-helpers'

import defaultConfig from '../../default.config'

export class Config {
  constructor () {
    this._config = defaultConfig
  }

  merge (config) {
    Object.assign(this._config, config)
  }

  get () {
    return this._config
  }
}

helpers.annotate(Config)
