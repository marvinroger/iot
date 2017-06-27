import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../../types'
import {MODELS} from '../../models'

export class User {
  constructor (bookshelf) {
    this._bookshelf = bookshelf.get()
    this._User = this._bookshelf.Model.extend({
      tableName: 'users',
      authTokens () {
        return this.hasMany(MODELS.AuthToken)
      }
    })

    this._bookshelf.model(MODELS.User, this._User)
  }

  get () {
    return this._User
  }
}

helpers.annotate(User, [TYPES.Bookshelf])
