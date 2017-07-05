import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

export class DevicePool {
  constructor (deviceFactory) {
    this._deviceFactory = deviceFactory
    this._devices = new Map()
  }

  forge ({ model, plugin }) {
    const device = this._deviceFactory()
    device._setModel(model)
    device._setPlugin(plugin)

    this._devices.set(device.getId(), device)

    return device
  }

  getDevices () {
    return this._devices.values()
  }

  getDevice (id) {
    return this._devices.get(id)
  }
}

helpers.annotate(DevicePool, [TYPES.factories.Device])
