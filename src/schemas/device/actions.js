import Joi from 'joi'

export const schema = Joi
  .object() // we require an object
  .keys(null) // any allowed keys
  .pattern(/.*/,
    Joi
      .object()
      .keys({
        name: Joi.string().required(),
        accepts: Joi.array().items(
          Joi
            .object()
            .keys({
              type: Joi.valid('range', 'color', 'boolean').required(),
              range: Joi.array().ordered(Joi.number(), Joi.number().greater(Joi.ref('range.0'))).when('type', { is: 'range', then: Joi.required() })
            })
        )
      })
  ) // should look like
