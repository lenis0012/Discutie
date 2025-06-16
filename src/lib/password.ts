import { pbkdf2 as pbkdf2Callback, randomBytes } from 'node:crypto'
import { promisify } from 'node:util'

// PBKDF2-SHA256 Parameters
// Chosen because it is built into Node.js and configured for balanced security
const HASH_ROUNDS = 600000
const HASH_LENGTH = 32

const pbkdf2 = promisify(pbkdf2Callback)

// Base-64 encoding without padding
function B64 (buffer: Buffer): string {
  const value = buffer.toString('base64')
  const paddingStart = value.indexOf('=')
  return paddingStart === -1 ? value : value.substring(0, paddingStart)
}

/**
 * Hash a password string using a secure password hashing algorithm.
 * The returned string conforms to the PHC string format
 *
 * @param password User password string
 */
export async function hash (password: string): Promise<string> {
  const salt = randomBytes(16)
  const derivedKey = await pbkdf2(Buffer.from(password, 'utf8'), salt, HASH_ROUNDS, HASH_LENGTH, 'sha256')
  return `$pbkdf2-sha256$i=${HASH_ROUNDS}$${B64(salt)}$${B64(derivedKey)}`
}

/**
 * Verify a user password against a stored hash in PHC string format
 *
 * @param password User password string
 * @param hashStr Stored hash string expected to match
 */
export async function verify (password: string, hashStr: string): Promise<boolean> {
  const strings = hashStr.split('$')
  if (strings.length !== 5 || !hashStr.startsWith('$pbkdf2-sha256$i=')) {
    throw new Error('Unexpected password hash format')
  }

  const rounds = parseInt(strings[2].substring(2))
  const salt = Buffer.from(strings[3], 'base64')
  const hash = Buffer.from(strings[4], 'base64')

  const actualHash = await pbkdf2(Buffer.from(password, 'utf8'), salt, rounds, hash.length, 'sha256')
  return actualHash.compare(hash) === 0
}
