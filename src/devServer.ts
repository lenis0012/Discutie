import express, { Application, Request, Response } from 'express'
import * as process from 'node:process'
import { createServer as createViteServer } from 'vite'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import apiRouter from './api/router'
import { loadSettings } from '#lib/setting'
import { migrateDatabase } from '#lib/database'

const app: Application = express()
const port = process.env.PORT || 3000

async function createServer () {
  const vite = await createViteServer({
    server: {
      middlewareMode: true
    },
    appType: 'custom'
  })
  app.use(vite.middlewares)

  await migrateDatabase()
  await loadSettings()
  app.use('/api', apiRouter)

  app.use('*all', async (req: Request, res: Response, next) => {
    const url = req.originalUrl

    try {
      // 1. Read index.html
      let template = await fs.readFile(
        path.resolve('index.html'),
        'utf-8',
      )

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
      //    and also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template)

      // 3. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

createServer()
