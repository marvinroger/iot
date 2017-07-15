import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import merge from 'deepmerge'
import {DEVICE_UPDATE_TYPES} from '../../common/device-update-types'
import {schema as propertiesSchema} from '../schemas/device/properties'
import {schema as actionsSchema} from '../schemas/device/actions'

const MERGE_OPTIONS = {
  arrayMerge (destinationArray, sourceArray) { // we want array to be replaced
    return sourceArray
  }
}

export class Device {
  constructor (updateBus, logger) {
    this._updateBus = updateBus
    this._logger = logger.get('device')

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
    this._updateBus.notifyDeviceUpdate({ type: DEVICE_UPDATE_TYPES.ONLINE_SET, id: this._id, value: online })
  }

  getProperties () { return this._properties }
  setProperties (properties) {
    const merged = merge(this._properties, properties, MERGE_OPTIONS)
    const {error} = propertiesSchema.validate(merged)
    if (error) return this._logger.error(error)
    this._properties = merged
    this._updateBus.notifyDeviceUpdate({ type: DEVICE_UPDATE_TYPES.PROPERTIES_SET, id: this._id, value: this._properties })
  }
  removeProperties (properties) {
    for (const property of properties) {
      delete this._properties[property]
    }
    this._updateBus.notifyDeviceUpdate({ type: DEVICE_UPDATE_TYPES.PROPERTIES_REMOVED, id: this._id, value: properties })
  }
  clearProperties () {
    this._properties = {}
    this._updateBus.notifyDeviceUpdate({ type: DEVICE_UPDATE_TYPES.PROPERTIES_CLEARED, id: this._id })
  }

  getCredentials () { return this._credentials }
  setCredentials (credentials) {
    const merged = merge(this._credentials, credentials, MERGE_OPTIONS)
    this._credentials = merged
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
    const merged = merge(this._actions, actions, MERGE_OPTIONS)
    const {error} = actionsSchema.validate(merged)
    if (error) return this._logger.error(error)
    this._actions = merged
    this._updateBus.notifyDeviceUpdate({ type: DEVICE_UPDATE_TYPES.ACTIONS_SET, id: this._id, value: this._actions })
  }
  removeActions (actions) {
    for (const action of actions) {
      delete this._actions[action]
    }
    this._updateBus.notifyDeviceUpdate({ type: DEVICE_UPDATE_TYPES.ACTIONS_REMOVED, id: this._id, value: actions })
  }
  clearActions () {
    this._actions = {}
    this._updateBus.notifyDeviceUpdate({ type: DEVICE_UPDATE_TYPES.ACTIONS_CLEARED, id: this._id })
  }

  sync () {
    return this._model.save({
      online: this._online,
      actions: this._actions,
      properties: this._properties,
      credentials: this._credentials
    })
  }
}

helpers.annotate(Device, [TYPES.UpdateBus, TYPES.Logger])
