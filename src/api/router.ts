import { Router, Request, Response } from 'express'
import { submitChat } from './chat'
import bodyParser from 'body-parser'

export default Router()
  .use(bodyParser.json())
  .post('/chat', submitChat)
  .all('/*all', (req: Request, res: Response) => {
    res.status(404).end()
  })
