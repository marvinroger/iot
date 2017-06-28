import {helpers} from 'inversify-vanillajs-helpers'
// import {TYPES} from '../types'

class Device {
  constructor ({ model, plugin }) {
    this._model = model
    this._plugin = plugin
    this._id = model.id
    this._online = model.attributes['online']
    this._type = model.attributes['type']
    this._name = model.attributes['name']
    this._properties = model.attributes['properties']
    this._credentials = model.attributes['credentials']
    this._actions = model.attributes['actions']
  }

  getPlugin () { return this._plugin }

  getId () { return this._id }
  getType () { return this._type }
  getName () { return this._name }

  getOnline () { return this._online }
  setOnline (online) {
    this._online = online
    return this._model.save({ online })
  }

  getProperties () { return this._properties }
  setProperties (properties) {
    this._properties = properties
    return this._model.save({ properties })
  }

  getCredentials () { return this._credentials }
  setCredentials (credentials) {
    this._credentials = credentials
    return this._model.save({ credentials })
  }

  getActions () { return this._actions }
  setActions (actions) {
    this._actions = actions
    return this._model.save({ actions })
  }
}

export class DevicePool {
  constructor () {
    this._devices = new Map()
  }

  forge ({ model, plugin }) {
    const device = new Device({ model, plugin })

    this._devices.set(device.id, device)

    return device
  }

  getDevices () {
    return this._devices.values()
  }

  getDevice (id) {
    return this._devices.get(id)
  }
}

helpers.annotate(DevicePool)
