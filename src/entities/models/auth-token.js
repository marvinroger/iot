import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../../types'
import {MODELS} from '../../models'

export class AuthToken {
  constructor (bookshelf) {
    this._bookshelf = bookshelf.get()
    this._AuthToken = this._bookshelf.Model.extend({
      tableName: 'auth_tokens',
      user () {
        return this.belongsTo(MODELS.User)
      }
    })

    this._bookshelf.model(MODELS.AuthToken, this._AuthToken)
  }

  get () {
    return this._AuthToken
  }
}

helpers.annotate(AuthToken, [TYPES.Bookshelf])
