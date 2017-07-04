import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

export class Discoverer {
  constructor (deviceModel, devicePool, logger) {
    this._Device = deviceModel.get()
    this._devicePool = devicePool
    this._logger = logger.get('discoverer')
  }

  getPluginCallback (plugin) {
    const self = this

    return {
      async discover ({ credentials, properties, name, actions, image }) {
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
