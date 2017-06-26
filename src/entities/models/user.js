import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../../types'

export class User {
  constructor (bookshelf) {
    this._bookshelf = bookshelf.get()
    this._User = this._bookshelf.Model.extend({
      tableName: 'users',
      authTokens () {
        return this.hasMany(TYPES.models.AuthToken)
      }
    })

    this._bookshelf.model(TYPES.models.User, this._User)
  }

  get () {
    return this._User
  }
}

helpers.annotate(User, [TYPES.Bookshelf])
