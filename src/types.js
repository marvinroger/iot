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
  DevicePool: Symbol('DevicePool'),
  models: {
    Device: Symbol('Device'),
    AuthToken: Symbol('AuthToken'),
    User: Symbol('User')
  },
  plugins: {
    Yeelight: Symbol('Yeelight'),
    Aqara: Symbol('Aqara')
  }
}
