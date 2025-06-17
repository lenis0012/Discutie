import { Router, Request, Response } from 'express'
import { submitChat } from './chat'
import bodyParser from 'body-parser'
import auth from './auth'
import models from './models'
import conversations from './conversations'

export default Router()
  .use(bodyParser.json())
  .post('/login', auth.login)
  .get('/session', auth.getSession)
  .get('/models', models.listModels)
  .post('/chat', submitChat)
  .get('/conversations/me', conversations.getMyConversations)
  .get('/conversations/:conversationId/messages', conversations.getMessages)
  .all('/*all', (req: Request, res: Response) => {
    res.status(404).end()
  })
