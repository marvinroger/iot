import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import {DEVICE_UPDATE_TYPES} from '../../common/device-update-types'

export class Device {
  constructor (updateBus) {
    this._updateBus = updateBus

    this._model = null
    this._plugin = null
    this._id = null
    this._online = null
    this._type = null
    this._name = null
    this._properties = null
    this._credentials = null
    this._actions = null
    this._image = null
  }

  _setModel (model) {
    this._model = model
    this._id = model.id
    this._online = model.attributes['online']
    this._type = model.attributes['type']
    this._name = model.attributes['name']
    this._properties = model.attributes['properties']
    this._credentials = model.attributes['credentials']
    this._actions = model.attributes['actions']
    this._image = model.attributes['image']
  }
  _setPlugin (plugin) { this._plugin = plugin }

  getPlugin () { return this._plugin }

  getId () { return this._id }
  getType () { return this._type }
  getName () { return this._name }
  getImage () { return this._image }

  getOnline () { return this._online }
  setOnline (online) {
    this._online = online
    this._updateBus.notify(DEVICE_UPDATE_TYPES.ONLINE_SET, this._id, online)
  }

  getProperties () { return this._properties }
  setProperties (properties) {
    Object.assign(this._properties, properties)
    this._updateBus.notify(DEVICE_UPDATE_TYPES.PROPERTIES_SET, this._id, properties)
  }
  removeProperties (properties) {
    for (const property of properties) {
      delete this._properties[property]
    }
    this._updateBus.notify(DEVICE_UPDATE_TYPES.PROPERTIES_REMOVED, this._id, properties)
  }
  clearProperties () {
    this._properties = {}
    this._updateBus.notify(DEVICE_UPDATE_TYPES.PROPERTIES_CLEARED, this._id)
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
    this._updateBus.notify(DEVICE_UPDATE_TYPES.ACTIONS_SET, this._id, actions)
  }
  removeActions (actions) {
    for (const action of actions) {
      delete this._actions[action]
    }
    this._updateBus.notify(DEVICE_UPDATE_TYPES.ACTIONS_REMOVED, this._id, actions)
  }
  clearActions () {
    this._actions = {}
    this._updateBus.notify(DEVICE_UPDATE_TYPES.ACTIONS_CLEARED, this._id)
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

helpers.annotate(Device, [TYPES.UpdateBus])
