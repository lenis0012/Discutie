import { Request, Response } from 'express'
import { insert, sql } from '#lib/database'
import { ModelProvider } from '#lib/domain'

class ProviderAdminController {
  async listProviders (req: Request, res: Response) {
    const { rows: providers } = await sql<ModelProvider>`select * from model_provider`
    res.json(providers).end()
  }

  async getProvider (req: Request, res: Response) {
    const { rows: providers, rowCount } = await sql<ModelProvider>`select * from model_provider where id = ${req.params.id}`

    if (rowCount < 1) {
      res.status(404).end()
      return
    }

    res.json(providers[0]).end()
  }

  async createProvider (req: Request, res: Response) {
    const { name, type, apiKey }: { name: string, type: string, apiKey?: string } = req.body
    const provider = {
      id: name.toLowerCase().replace(' ', '-').replace(/[^a-z0-9-]/g, ''),
      type,
      displayName: name,
      data: {
        apiKey
      }
    }
    await insert('model_provider', provider)
    res
      .status(201)
      .location(`model-providers/${provider.id}`)
      .end()
  }

  async updateProvider (req: Request, res: Response) {
    const id = req.params.id
    const { name, type, apiKey }: { name: string, type: string, apiKey?: string } = req.body

    await sql`update model_provider set 
                          display_name = ${name},
                          type = ${type},
                          data = ${JSON.stringify({ apiKey })}
                      where id = ${id}`

    res.status(204).end()
  }
}

export default new ProviderAdminController()