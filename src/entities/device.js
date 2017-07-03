import {helpers} from 'inversify-vanillajs-helpers'

export class Device {
  constructor () {
    this._model = null
    this._plugin = null
    this._id = null
    this._online = null
    this._type = null
    this._name = null
    this._properties = null
    this._credentials = null
    this._actions = null
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
  }
  _setPlugin (plugin) { this._plugin = plugin }

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

helpers.annotate(Device)
