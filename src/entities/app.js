import {helpers} from 'inversify-vanillajs-helpers'
import {TYPES} from '../types'

export class App {
  constructor (
    logger, config, knex, httpServer, expressApp, wsServer, discoverer, devicePool,
    deviceModel,
    aqaraPlugin, yeelightPlugin
  ) {
    this._logger = logger.get('app')
    this._config = config.get()
    this._knex = knex.get()
    this._httpServer = httpServer.get()
    this._expressApp = expressApp.get()
    this._wsServer = wsServer
    this._discoverer = discoverer
    this._devicePool = devicePool

    this._Device = deviceModel.get()

    this._plugins = [
      aqaraPlugin,
      yeelightPlugin
    ]
  }

  async start () {
    this._logger.info('starting')

    /*
     * Migrations
     */

    const [, migrationsCount] = await this._knex.migrate.latest()
    if (migrationsCount.length > 0) this._logger.info(`ran ${migrationsCount.length} migration(s)`)

    /*
     * HTTP server
     */

    this._httpServer.on('request', this._expressApp)
    this._httpServer.listen(this._config.port, this._config.host, () => {
      this._logger.info(`listening on ${this._config.host}:${this._config.port}`)
    }).on('error', (err) => {
      this._logger.error(`cannot start server`, err)
      process.exit(1)
    })

    this._wsServer.setup()

    /*
     * Devices and plugins
     */

    const devices = await this._Device.fetchAll()

    for (const deviceModel of devices.models) {
      for (const plugin of this._plugins) {
        if (deviceModel.attributes['type'] === plugin.type) {
          const device = this._devicePool.forge({ model: deviceModel, plugin })
          plugin.restore(device)
          break
        }
      }
    }

    for (const plugin of this._plugins) {
      plugin.startDiscovery(this._discoverer.getPluginCallback(plugin))
    }
  }
}

helpers.annotate(App, [
  TYPES.Logger, TYPES.Config, TYPES.Knex, TYPES.HttpServer, TYPES.ExpressApp, TYPES.WsServer, TYPES.Discoverer, TYPES.DevicePool,
  TYPES.models.Device,
  TYPES.plugins.Aqara, TYPES.plugins.Yeelight
])
