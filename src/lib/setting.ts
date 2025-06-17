import { sql } from '#lib/database'
import { randomBytes } from 'node:crypto'

interface Setting {
  name: string
  value: string
}

const settings = new Map<string, any>()

/**
 * Get a global site setting from the cache by its name
 *
 * @param key Name of the setting
 */
export function setting<T> (key: string): T

/**
 * Update a global site setting and persist the value as JSON
 *
 * @param key Name of the setting
 * @param value Value of the setting, can be anything that can be serialized
 */
export function setting (key: string, value: any): void

export function setting (key: string, value?: any) {
  if (value !== undefined) {
    if (value === null) {
      settings.delete(key)
      sql`delete from setting where name = ${key}`
      return
    }

    if (settings.has(key) && JSON.stringify(settings.get(key)) === JSON.stringify(value)) {
      return // Value has not changed
    }

    settings.set(key, value)
    sql`
      insert into setting (name, value)
      values (${key}, ${JSON.stringify(value)})
      on conflict (name) do update set value = excluded.value`
  } else {
    return settings.get(key)
  }
}

export async function loadSettings () {
  const result = await sql<Setting>`select * from setting`
  for (const row of result.rows) {
    settings.set(row.name, row.value)
  }

  // Populate some default settings
  if (!settings.has('sessionSecret')) {
    setting('sessionSecret', randomBytes(16).toString('hex'))
  }
}
