import { NextFunction, Request, Response } from 'express'
import { retrieveSession, Session } from '#lib/session'

// Augment express Request type
declare module 'express' {
  interface Request {
    session: Session
  }
}

export default function authMiddleware (req: Request, res: Response, next: NextFunction) {
  const session = retrieveSession(req)
  if (!session || session.role !== 'admin') {
    res.status(401).end()
    return
  }

  req.session = session
  next()
}
