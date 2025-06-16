import { Router, Request, Response } from 'express'
import { submitChat } from './chat'
import bodyParser from 'body-parser'
import auth from './auth'

export default Router()
  .use(bodyParser.json())
  .post('/login', auth.login)
  .get('/session', auth.getSession)
  .post('/chat', submitChat)
  .all('/*all', (req: Request, res: Response) => {
    res.status(404).end()
  })
