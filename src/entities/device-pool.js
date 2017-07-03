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
  }

  getProperties () { return this._properties }
  setProperties (properties) {
    Object.assign(this._properties, properties)
  }
  removeProperties (properties) {
    for (const property of properties) {
      delete this._properties[property]
    }
  }
  clearProperties () {
    this._properties = {}
  }

  getCredentials () { return this._credentials }
  setCredentials (credentials) {
    Object.assign(this._credentials, credentials)
  }
  removeCredentials (credentials) {
    for (const credential of credentials) {
      delete this._credentials[credential]
    }
  }
  clearCredentials () {
    this._credentials = {}
  }

  getActions () { return this._actions }
  setActions (actions) {
    Object.assign(this._actions, actions)
    return this._model.save({ actions })
  }
  removeActions (actions) {
    for (const action of actions) {
      delete this._actions[action]
    }
  }
  clearActions () {
    this._actions = {}
  }

  sync () {
    return this._model.save({
      online: this._online,
      action: this._actions,
      properties: this._properties,
      credentials: this._credentials
    })
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
