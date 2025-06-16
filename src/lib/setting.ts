import { query } from '#lib/database'
import { randomBytes } from 'node:crypto'

interface Setting {
  name: string
  value: string
}

const settings = new Map()

export function setting<T> (key: string): T
export function setting (key: string, value: any): void
export function setting (key: string, value?: any) {
  if (value !== undefined) {
    settings.set(key, value)
    query`insert into setting (name, value) values (${key}, ${JSON.stringify(value)})`
  } else {
    return settings.get(key)
  }
}

export async function loadSettings () {
  const result = await query<Setting>`select * from setting`
  for (const row of result.rows) {
    settings.set(row.name, row.value)
  }

  // Populate some default settings
  if (!settings.has('sessionSecret')) {
    setting('sessionSecret', randomBytes(16).toString('hex'))
  }
}
