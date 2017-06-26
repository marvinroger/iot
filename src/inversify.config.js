import {Container} from 'inversify'
import {TYPES} from './types'

import {App} from './entities/app'
import {Config} from './entities/config'
import {Logger} from './entities/logger'
import {Knex} from './entities/knex'
import {Bookshelf} from './entities/bookshelf'
import {HttpServer} from './entities/http-server'
import {WsServer} from './entities/ws-server'
import {ExpressApp} from './entities/express-app'
import {Discoverer} from './entities/discoverer'
import {DevicePool} from './entities/device-pool'

import {Device} from './entities/models/device'
import {User} from './entities/models/user'
import {AuthToken} from './entities/models/auth-token'

import {Yeelight} from './entities/plugins/yeelight'
import {Aqara} from './entities/plugins/aqara'

export const container = new Container()
container.bind(TYPES.App).to(App).inSingletonScope()
container.bind(TYPES.Config).to(Config).inSingletonScope()
container.bind(TYPES.Logger).to(Logger).inSingletonScope()
container.bind(TYPES.Knex).to(Knex).inSingletonScope()
container.bind(TYPES.Bookshelf).to(Bookshelf).inSingletonScope()
container.bind(TYPES.HttpServer).to(HttpServer).inSingletonScope()
container.bind(TYPES.WsServer).to(WsServer).inSingletonScope()
container.bind(TYPES.ExpressApp).to(ExpressApp).inSingletonScope()
container.bind(TYPES.Discoverer).to(Discoverer).inSingletonScope()
container.bind(TYPES.DevicePool).to(DevicePool).inSingletonScope()

container.bind(TYPES.models.Device).to(Device).inSingletonScope()
container.bind(TYPES.models.User).to(User).inSingletonScope()
container.bind(TYPES.models.AuthToken).to(AuthToken).inSingletonScope()

container.bind(TYPES.plugins.Yeelight).to(Yeelight).inSingletonScope()
container.bind(TYPES.plugins.Aqara).to(Aqara).inSingletonScope()
