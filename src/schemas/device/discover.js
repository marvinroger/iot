import Joi from 'joi'

import {schema as actionsSchema} from './actions'
import {schema as propertiesSchema} from './properties'

export const schema = Joi
  .object() // we require an object
  .keys({
    name: Joi.string().required(),
    actions: actionsSchema,
    credentials: Joi.object(),
    properties: propertiesSchema,
    image: Joi.string()
  })
