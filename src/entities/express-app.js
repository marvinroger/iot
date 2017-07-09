import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

import path from 'path'
import fs from 'fs'
import {promisify} from 'util'

import express from 'express'
import bodyParser from 'body-parser'
import uuid from 'uuid'
import cookie from 'cookie'

import {version} from '../../package.json'
import * as hash from '../helpers/hash'

const fsAccess = promisify(fs.access)

export class ExpressApp {
  constructor (userModel, authTokenModel, config) {
    this._User = userModel.get()
    this._AuthToken = authTokenModel.get()
    this._config = config.get()

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
      const avatarsPath = path.join(this._config.meta.resolvedDataDirectory, 'avatars')
      const avatarPath = path.join(avatarsPath, `${req.params.id}.jpg`)
      try {
        await fsAccess(avatarPath, fs.constants.R_OK)
        const absolute = path.resolve(avatarPath)
        return res.sendFile(absolute)
      } catch (err) {
        const absolute = path.resolve(path.join(__dirname, '../assets/no-avatar.jpg'))
        return res.sendFile(absolute)
      }
    })

    this._app.get('/api/room-picture/:id', async (req, res) => {
      const picturesPath = path.join(this._config.meta.resolvedDataDirectory, 'rooms')
      const picturePath = path.join(picturesPath, `${req.params.id}.jpg`)
      try {
        await fsAccess(picturePath, fs.constants.R_OK)
        const absolute = path.resolve(picturePath)
        return res.sendFile(absolute)
      } catch (err) {
        const absolute = path.resolve(path.join(__dirname, '../assets/sample-room.jpg'))
        return res.sendFile(absolute)
      }
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

    this._app.get('/api/handshake', async (req, res) => {
      const object = {
        language: this._config.language,
        version
      }

      const tokenModel = await getTokenModelIfLoggedIn(req.headers.cookie)

      if (!tokenModel) {
        object.loggedIn = false
        return res.json(object)
      } else {
        const userModel = tokenModel.related('user')

        object.loggedIn = true
        object.user = {
          id: userModel.id,
          name: userModel.attributes['name'],
          role: userModel.attributes['role']
        }
        return res.json(object)
      }
    })
  }
}

helpers.annotate(ExpressApp, [TYPES.models.User, TYPES.models.AuthToken, TYPES.Config])
