import Joi from 'joi'

export const schema = Joi
  .object() // we require an object
  .keys(null) // any allowed keys
  .pattern(/.*/,
    Joi
      .object()
      .keys({
        name: Joi.string().required(),
        type: Joi.valid('range', 'color', 'boolean').required(),
        value: Joi
          .alternatives()
          .when('type', { is: 'boolean', then: Joi.boolean() })
          .when('type', { is: 'range', then: Joi.number().min(Joi.ref('range.0')).max(Joi.ref('range.1')) })
          .when('type', { is: 'color', then: Joi.array().items(Joi.number().min(0).max(255).required()).length(3) })
          .required(),
        range: Joi.array().ordered(Joi.number(), Joi.number().greater(Joi.ref('range.0'))).when('type', { is: 'range', then: Joi.required() })
      })
  ) // should look like
