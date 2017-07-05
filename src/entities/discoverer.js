import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import {schema as discoverSchema} from '../schemas/device/discover'

export class Discoverer {
  constructor (deviceModel, devicePool, logger) {
    this._Device = deviceModel.get()
    this._devicePool = devicePool
    this._logger = logger.get('discoverer')
  }

  getPluginCallback (plugin) {
    const self = this

    return {
      async discover (opts) {
        const {error} = discoverSchema.validate(opts)
        if (error) return this._logger.error(error)

        const { credentials, properties, name, actions, image } = opts

        self._logger.info(`discovered device ${name}`, properties)

        const model = await self._Device.forge({
          online: true,
          type: plugin.type,
          name,
          properties,
          credentials,
          actions,
          image
        }).save()

        return self._devicePool.forge({ model, plugin })
      }
    }
  }
}

helpers.annotate(Discoverer, [TYPES.models.Device, TYPES.DevicePool, TYPES.Logger])
