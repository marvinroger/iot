import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import bookshelf from 'bookshelf'
import jsonColumns from 'bookshelf-json-columns'

export class Bookshelf {
  constructor (knex) {
    this._knex = knex.get()
    this._bookshelf = bookshelf(this._knex)
    this._bookshelf.plugin('registry')
    this._bookshelf.plugin(jsonColumns)
  }

  get () {
    return this._bookshelf
  }
}

helpers.annotate(Bookshelf, [TYPES.Knex])
