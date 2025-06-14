import { Express } from 'express'

export default function apiRouter (app: Express) {
  app.get('/api/*all', (req, res) => {
    res.status(404).end()
  })
}
