import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../../types'
import {MODELS} from '../../models'

export class Meta {
  constructor (bookshelf) {
    this._bookshelf = bookshelf.get()
    this._Meta = this._bookshelf.Model.extend({
      tableName: 'metas'
    }, {
      jsonColumns: ['value']
    })

    this._bookshelf.model(MODELS.Meta, this._Meta)
  }

  get () {
    return this._Meta
  }
}

helpers.annotate(Meta, [TYPES.Bookshelf])
