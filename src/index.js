import 'reflect-metadata'

import {container} from './inversify.config'
import {TYPES} from './types'

const config = container.get(TYPES.Config)

export function bootstrap (params) {
  if (params.config) config.merge(params.config)

  const app = container.get(TYPES.App)
  const logger = container.get(TYPES.Logger)

  app.start().catch((err) => {
    logger.get('root').error('an unhandled error occured', err)
  })
}
