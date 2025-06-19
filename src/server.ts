import express, { Application, Request, Response } from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import apiRouter from './api/router'
import adminApiRouter from '#admin/api/router'
import { migrateDatabase } from '#lib/database'
import { loadSettings } from '#lib/setting'

async function createServer () {
  const app: Application = express()

  // Static assets
  app.use('/assets', express.static('dist/assets', {
    maxAge: '1w'
  }))

  // API
  await migrateDatabase()
  await loadSettings()
  app.use('/api', (req, res, next) => {
    const dt = new Date().toISOString()
    console.log(`[${dt}] ${req.method} ${req.originalUrl}`)
    next()
  })
  app.use('/api', apiRouter)
  app.use('/admin/api', adminApiRouter)

  // SPA Catch-All
  const indexHtml = await fs.readFile(path.resolve('dist', 'index.html'))
  app.get('*all', async (req: Request, res: Response) => {
    if (!req.accepts('html')) {
      res.status(406).end()
      return
    }

    const pageHtml = req.url.startsWith('/admin')
      ? (await fs.readFile(path.resolve('admin/index.html')))
      : indexHtml

    res
      .contentType('text/html')
      .send(pageHtml)
      .end()
  })

  await new Promise(resolve => {
    const server = app.listen(3000, resolve)
    process.on('SIGTERM', async () => {
      console.debug('SIGTERM signal received')

      console.info('Closing HTTP server...')
      await new Promise(resolve => server.close(resolve))

      // console.info('Closing database connection...')
      // await closeDatabase()
    })
  })
}

createServer()
  .then(() => console.log('Server listening at http://localhost:3000'))
  .catch(e => console.error('Failed to start server:\n', e))
