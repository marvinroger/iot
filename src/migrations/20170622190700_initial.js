export function up (knex) {
  return knex.schema
    .createTable('devices', (t) => {
      t.increments('id').primary()
      t.text('type').notNullable()
      t.string('name').notNullable()
      t.boolean('online').notNullable()
      t.json('properties').notNullable()
      t.json('actions').notNullable()
      t.json('credentials').notNullable()
    })
    .createTable('users', (t) => {
      t.increments('id').primary()
      t.text('name').notNullable()
      t.string('password', 60).notNullable() // Bcrypt = 60
      t.enum('role', ['guest', 'resident', 'admin']).notNullable()
      t.dateTime('last_connection')
    })
    .createTable('auth_tokens', (t) => {
      t.increments('id').primary()
      t.string('token', 36).notNullable() // UUID = 36
      t.integer('user_id').references('users.id')
      t.boolean('revoked').notNullable().defaultTo(false)
      t.dateTime('last_used').notNullable().defaultTo(knex.fn.now())
    })
}

export function down (knex) {
  return knex.schema
    .dropTableIfExists('auth_tokens')
    .dropTableIfExists('users')
    .dropTableIfExists('devices')
}
