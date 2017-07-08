import {helpers} from 'inversify-vanillajs-helpers'

import {dirname, join} from 'path'
import merge from 'deepmerge'

import defaultConfig from '../../default.config'

export class Config {
  constructor () {
    this._config = defaultConfig
  }

  merge (config) {
    const merged = merge(this._config, config)
    let baseDir = './'
    if (merged.meta.configurationFilePath) {
      baseDir = dirname(merged.meta.configurationFilePath)
    }
    merged.meta.resolvedDataDirectory = join(baseDir, merged.dataDirectory)

    this._config = merged
  }

  get () {
    return this._config
  }
}

helpers.annotate(Config)
