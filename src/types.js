export const TYPES = {
  App: Symbol('App'),
  Logger: Symbol('Logger'),
  Config: Symbol('Config'),
  Knex: Symbol('Knex'),
  Bookshelf: Symbol('Bookshelf'),
  HttpServer: Symbol('HttpServer'),
  WsServer: Symbol('WsServer'),
  ExpressApp: Symbol('ExpressApp'),
  Discoverer: Symbol('Discoverer'),
  UpdateBus: Symbol('UpdateBus'),
  DevicePool: Symbol('DevicePool'),
  Device: Symbol('Device'),
  factories: {
    Device: Symbol('Factory<Device>')
  },
  models: {
    Device: Symbol('Model<Device>'),
    AuthToken: Symbol('Model<AuthToken>'),
    User: Symbol('Model<User>')
  },
  plugins: {
    Yeelight: Symbol('Plugin<Yeelight>'),
    Aqara: Symbol('Plugin<Aqara>')
  }
}
