import {helpers} from 'inversify-vanillajs-helpers'

import {join} from 'path'
import knex from 'knex'

export class Knex {
  constructor () {
    this._knex = knex({
      client: 'sqlite3',
      connection: {
        filename: './db.sqlite'
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

helpers.annotate(Knex)
