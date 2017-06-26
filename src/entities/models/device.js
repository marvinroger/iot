import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../../types'

export class Device {
  constructor (bookshelf) {
    this._bookshelf = bookshelf.get()
    this._Device = this._bookshelf.Model.extend({
      tableName: 'devices'
    }, {
      jsonColumns: ['properties', 'credentials', 'actions']
    })
  }

  get () {
    return this._Device
  }
}

helpers.annotate(Device, [TYPES.Bookshelf])
