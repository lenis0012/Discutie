import { Pool, Result } from 'pg'
import { camelCase, snakeCase } from 'change-case/keys'

console.debug('Connecting to database')
const pool = new Pool({
  user: process.env.PGUSER || 'discutie'
})

export class Sql {
  text: string
  values: any[]

  constructor (text: string, values: any[] = []) {
    this.text = text
    this.values = values
  }
}

// export { Result }

export async function query<R> (strings: TemplateStringsArray, ...values: any[]): Promise<Result<R>> {
  let query = ''
  for (let i = 0; i < strings.length; i++) {
    query += strings[i]
    query += `$${i + 1}`
  }

  const sql = new Sql(query, values)
  const result = await pool.query(sql)
  for (let i = 0; i < result.rows.length; i++) {
    result.rows[i] = camelCase(result.rows[i])
  }

  return result
}

export async function closeDatabase () {
  await pool.end()
}
