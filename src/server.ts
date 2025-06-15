import express, { Application, Request, Response } from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import apiRouter from './api/router'

async function createServer () {
  const app: Application = express()

  // Static assets
  app.use('/assets', express.static('dist/assets', {
    maxAge: '1w'
  }))

  // API
  app.use('/api', apiRouter)

  // SPA Catch-All
  const indexHtml = await fs.readFile(path.resolve('dist', 'index.html'))
  app.get('*all', async (req: Request, res: Response) => {
    if (!req.accepts('html')) {
      res.status(406).end()
      return
    }

    res
      .contentType('text/html')
      .send(indexHtml)
      .end()
  })

  await new Promise(resolve => {
    const server = app.listen(3000, resolve)
    process.on('SIGTERM', () => {
      console.debug('SIGTERM signal received')
      console.info('Closing HTTP server...')
      server.close()
    })
  })
}

createServer()
  .then(() => console.log('Server listening at http://localhost:3000'))
  .catch(e => console.error('Failed to start server:\n', e))
