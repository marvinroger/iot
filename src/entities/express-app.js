import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import uuid from 'uuid'
import cookie from 'cookie'

import * as hash from '../helpers/hash'

export class ExpressApp {
  constructor (userModel, authTokenModel, config) {
    this._User = userModel.get()
    this._AuthToken = authTokenModel.get()
    this._config = config

    this._app = express()

    this._setupRouter()
  }

  get () {
    return this._app
  }

  _setupRouter () {
    this._app.disable('x-powered-by')
    this._app.use(bodyParser.json())

    this._app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })

    this._app.get('/api/get-language', async (req, res) => {
      return res.json({
        language: this._config.get().language
      })
    })

    this._app.get('/api/users', async (req, res) => {
      const userModels = await this._User.fetchAll()

      const users = userModels.map((userModel) => {
        return {
          id: userModel.id,
          name: userModel.attributes['name']
        }
      })

      return res.json({
        users
      })
    })

    this._app.get('/api/user-avatar/:id', async (req, res) => {
      res.sendFile(path.join(__dirname, '../assets/sample-avatar.jpg'))
    })

    this._app.post('/api/login', async (req, res) => {
      if (!req.body.userId || !req.body.password) return res.sendStatus(400)

      const userModel = await this._User.where({ id: req.body.userId }).fetch()
      if (!userModel) return res.sendStatus(401)

      const matchPassword = await hash.compare(req.body.password, userModel.attributes['password'])

      if (matchPassword) {
        const token = uuid()
        await this._AuthToken.forge({ token, user_id: userModel.id }).save()
        await userModel.save({ last_connection: new Date() })
        const never = new Date(253402300000000) // year 999
        return res.cookie('ACCESSTOKEN', token, {
          expires: never,
          httpOnly: true
        }).json({
          user: {
            id: userModel.id,
            name: userModel.attributes['name'],
            role: userModel.attributes['role']
          }
        })
      } else {
        return res.sendStatus(401)
      }
    })

    const getTokenModelIfLoggedIn = async (cookies) => {
      cookies = cookies ? cookie.parse(cookies) : null
      if (!cookies || !cookies['ACCESSTOKEN']) return false

      const tokenModel = await this._AuthToken.where({ token: cookies['ACCESSTOKEN'] }).fetch({withRelated: ['user']})
      if (!tokenModel || tokenModel.attributes['revoked']) return false

      return tokenModel
    }

    this._app.post('/api/logout', async (req, res) => {
      const tokenModel = await getTokenModelIfLoggedIn(req.headers.cookie)
      if (!tokenModel) return res.sendStatus(401)

      await tokenModel.save({ revoked: true })
      res.clearCookie('ACCESSTOKEN').sendStatus(204)
    })

    this._app.get('/api/logged-in', async (req, res) => {
      const tokenModel = await getTokenModelIfLoggedIn(req.headers.cookie)
      if (!tokenModel) {
        return res.json({
          loggedIn: false
        })
      } else {
        const userModel = tokenModel.related('user')

        return res.json({
          loggedIn: true,
          user: {
            id: userModel.id,
            name: userModel.attributes['name'],
            role: userModel.attributes['role']
          }
        })
      }
    })
  }
}

helpers.annotate(ExpressApp, [TYPES.models.User, TYPES.models.AuthToken, TYPES.Config])
