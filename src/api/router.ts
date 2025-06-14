import { Express } from 'express'
import { submitChat } from './chat'

export default function apiRouter (app: Express) {
  app.post('/api/chat', submitChat)

  app.get('/api/*all', (req, res) => {
    res.status(404).end()
  })
}
