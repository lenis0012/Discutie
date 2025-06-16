import type { Request, Response } from 'express'
import { query } from '#lib/database'
import { verify } from '#lib/password'
import { Account } from '#lib/domain'
import { applySession, retrieveSession } from '#lib/session'

class AuthController {
  async login (req: Request, res: Response) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Basic ')) {
      res.status(400).end()
      return
    }

    const base64Credentials = req.headers.authorization.substring('Basic '.length)
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8')
    const username = credentials.substring(0, credentials.indexOf(':'))
    const password = credentials.substring(credentials.indexOf(':') + 1)

    const user = await query<Account>`select * from account where username = ${username}`
    if (user.rowCount === 0) {
      res.status(400).end()
      return
    }

    const success = await verify(password, user.rows[0].passwordHash)
    if (!success) {
      res.status(400).end()
      return
    }

    applySession(user.rows[0], res)
    res.redirect(201, '/session')
  }

  async getSession (req: Request, res: Response) {
    const session = retrieveSession(req)
    if (!session) {
      res.status(401).end()
      return
    }

    res.json(session).end()
  }
}

export default new AuthController()
