import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

export class Room {
  constructor (updateBus) {
    this._updateBus = updateBus

    this._model = null
    this._id = null
    this._name = null
  }

  _setModel (model) {
    this._model = model
    this._id = model.id
    this._name = model.attributes['name']
  }

  getId () { return this._id }
  getName () { return this._name }
}

helpers.annotate(Room, [TYPES.UpdateBus])
