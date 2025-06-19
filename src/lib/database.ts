import { Pool, Result, escapeIdentifier } from 'pg'
import { camelCase } from 'change-case/keys'
import { snakeCase } from 'change-case'
import { readFile } from 'node:fs/promises'
import { hash } from '#lib/password'

console.debug('Connecting to database')
const pool = new Pool({
  user: process.env.PGUSER || 'discutie',
  password: process.env.PGPASSWORD || 'discutie'
})

export class Sql {
  text: string
  values: any[]

  constructor (text: string, values: any[] = []) {
    this.text = text
    this.values = values
  }
}

export async function sql<R> (/* language=SQL */ strings: TemplateStringsArray, ...values: any[]): Promise<Result<R>> {
  let query = ''
  for (let i = 0; i < strings.length; i++) {
    query += strings[i]
    if (i < values.length) {
      query += `$${i + 1}`
    }
  }

  const sql = new Sql(query, values)
  const result = await pool.query(sql)
  for (let i = 0; i < result.rows.length; i++) {
    result.rows[i] = camelCase(result.rows[i])
  }

  return result
}

export async function insert (table: string, ...rows: Object[]): Promise<void> {
  const keys = Object.keys(rows[0])
  const columns = keys.map(k => escapeIdentifier(snakeCase(k))).join(',')
  const params = rows.map((v, vi) =>
    `(${keys.map((k, ki) => `$${vi * keys.length + ki + 1}`)})`)
    .join(',')
  const values = rows.flatMap((v) => keys.map(k => v[k]))

  const sql = new Sql(`INSERT INTO ${escapeIdentifier(table)} (${columns}) VALUES ${params}`, values)
  console.debug('Executing SQL: ', sql.text)
  await pool.query(sql)
}

export async function migrateDatabase () {
  const schema = await readFile('migrations/schema.sql', 'utf8')
  await pool.query(schema)

  const accountsQuery = sql<{ count: number }>`select count(*)::int as count from account`
  accountsQuery.then(async accounts => {
    if (accounts.rows[0].count === 0) {
      console.log('Creating default admin account')
      await insert('account', {
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
        passwordHash: await hash(process.env.ADMIN_PASSWORD || 'password')
      })
    }
  })
}

export async function closeDatabase () {
  console.log('Closing database connection...')
  if (pool.ended || pool.ending) {
    return
  }

  await pool.end()
}
