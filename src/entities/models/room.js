import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../../types'
import {MODELS} from '../../models'

export class Room {
  constructor (bookshelf) {
    this._bookshelf = bookshelf.get()
    this._Room = this._bookshelf.Model.extend({
      tableName: 'rooms',
      devices () {
        return this.hasMany(MODELS.Device)
      }
    })

    this._bookshelf.model(MODELS.Room, this._Room)
  }

  get () {
    return this._Room
  }
}

helpers.annotate(Room, [TYPES.Bookshelf])
