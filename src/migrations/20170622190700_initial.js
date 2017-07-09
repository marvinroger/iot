export async function up (knex) {
  await knex.schema
    .createTableIfNotExists('metas', (t) => {
      t.text('key').primary().notNullable()
      t.text('value').notNullable()
    })
    .createTableIfNotExists('rooms', (t) => {
      t.increments('id').primary()
      t.text('name').notNullable()
    })
    .createTableIfNotExists('devices', (t) => {
      t.increments('id').primary()
      t.text('type').notNullable()
      t.text('name').notNullable()
      t.boolean('online').notNullable()
      t.json('properties').notNullable()
      t.json('actions').notNullable()
      t.json('credentials').notNullable()
      t.text('image')

      t.integer('room_id').references('rooms.id')
    })
    .createTableIfNotExists('users', (t) => {
      t.increments('id').primary()
      t.text('name').notNullable()
      t.string('password', 60).notNullable() // Bcrypt = 60
      t.enum('role', ['guest', 'resident', 'admin']).notNullable()
      t.dateTime('last_connection')
    })
    .createTableIfNotExists('auth_tokens', (t) => {
      t.increments('id').primary()
      t.string('token', 36).notNullable() // UUID = 36
      t.boolean('revoked').notNullable().defaultTo(false)
      t.dateTime('last_used').notNullable().defaultTo(knex.fn.now())

      t.integer('user_id').references('users.id')
    })

  await knex('metas').insert([
    { key: 'settings', value: '{}' },
    { key: 'roomsPositions', value: '[]' }
  ])

  await knex('users').insert([
    { name: 'Admin', password: '$2a$10$eRt7zvUofyp7oBksXwXGpu5bPr8fXiQC5STh6DRgWBa1CC1GsnpvS', role: 'admin' }
  ])
}

export async function down (knex) {
  await knex.schema
    .dropTableIfExists('auth_tokens')
    .dropTableIfExists('users')
    .dropTableIfExists('devices')
    .dropTableIfExists('rooms')
    .dropTableIfExists('metas')
}
