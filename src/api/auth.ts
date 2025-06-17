import type { Request, Response } from 'express'
import { sql } from '#lib/database'
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

    const user = await sql<Account>`select * from account where username = ${username}`
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
    res
      .status(201)
      .location('session')
      .end()
  }

  async getSession (req: Request, res: Response) {
    const session = retrieveSession(req)
    if (!session) {
      res.json({}).end()
      return
    }

    // Validate session contents
    const account = await sql<Account>`select * from account where id = ${session.id}`
    if (account.rowCount === 0) {
      res
        .clearCookie('session')
        .json({})
        .end()
      return
    }

    // Reapply session to extend the cookie expiry
    applySession(account.rows[0], res)
    res.json(session).end()
  }
}

export default new AuthController()
