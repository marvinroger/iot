import bcrypt from 'bcrypt'

export function hash (plaintext) {
  return bcrypt.hash(plaintext, 10)
}

export function compare (plaintext, hash) {
  return bcrypt.compare(plaintext, hash)
}
