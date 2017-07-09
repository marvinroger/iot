import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../../types'
import {MODELS} from '../../models'

export class Device {
  constructor (bookshelf) {
    this._bookshelf = bookshelf.get()
    this._Device = this._bookshelf.Model.extend({
      tableName: 'devices',
      room () {
        return this.belongsTo(MODELS.Room)
      }
    }, {
      jsonColumns: ['properties', 'credentials', 'actions']
    })

    this._bookshelf.model(MODELS.Device, this._Device)
  }

  get () {
    return this._Device
  }
}

helpers.annotate(Device, [TYPES.Bookshelf])
