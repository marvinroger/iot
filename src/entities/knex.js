import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import {join} from 'path'
import knex from 'knex'

export class Knex {
  constructor (config) {
    this._knex = knex({
      client: 'sqlite3',
      connection: {
        filename: `${config.get().meta.resolvedDataDirectory}/db.sqlite`
      },
      useNullAsDefault: true,
      migrations: {
        directory: join(__dirname, '../migrations'),
        tableName: 'migrations'
      }
    })
  }

  get () {
    return this._knex
  }
}

helpers.annotate(Knex, [TYPES.Config])
