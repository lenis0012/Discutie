import type { Request, Response } from 'express'
import { Account } from '#lib/domain'
import { createHmac } from 'node:crypto'
import { setting } from '#lib/setting'

export interface Session {
  username: string
  displayName: string
  role: string
}

function sign (data: any) {
  const payload = Buffer.from(JSON.stringify(data), 'utf8')
  const signature = createHmac('sha256', setting('sessionSecret'))
    .update(JSON.stringify(data))
    .digest('base64')

  return `s:${payload.toString('base64')}:${signature}`
}

function unsign (data: string) {
  const [type, payload, signature] = data.split(':')
  if (type !== 's') {
    return null
  }

  const payloadBuffer = Buffer.from(payload, 'base64')
  const signatureBuffer = Buffer.from(signature, 'base64')
  const expectedSignature = createHmac('sha256', setting('sessionSecret'))
    .update(payloadBuffer)
    .digest()

  return signatureBuffer.compare(expectedSignature) === 0
    ? JSON.parse(payloadBuffer.toString('utf8'))
    : null
}

export function applySession (account: Account, res: Response) {
  const session: Session = {
    username: account.username,
    displayName: account.displayName,
    role: account.role
  }

  res.cookie('session', sign(session), {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'strict',
    secure: res.req.headers['x-forwarded-proto'] === 'https'
  })
}

export function retrieveSession (req: Request): Session {
  const cookies = req.headers.cookie.split(';')
  const sessionCookie = cookies.find(c => c.trim().startsWith('session='))
  if (!sessionCookie) {
    return null
  }

  console.log(decodeURIComponent(sessionCookie.split('=')[1].trim()))
  return unsign(decodeURIComponent(sessionCookie.split('=')[1].trim()))
}
