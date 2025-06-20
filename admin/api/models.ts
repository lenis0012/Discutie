import { Request, Response } from 'express'
import { insert, sql } from '#lib/database'
import { Model, ModelProvider } from '#lib/domain'

interface ModelRequest {
  name: string,
  displayName: string,
  providerId: string,
  // contextLength: 0,
  // enabled: true,
  // isDefault: false
}

class ModelAdminController {
  async getModel (req: Request, res: Response) {
    const { id } = req.params
    const { rows: [model] } = await sql<Model>`select * from model where id = ${id}`
    res.json(model).end()
  }

  async createModel (req: Request, res: Response) {
    const { name, displayName, providerId }: ModelRequest = req.body

    const { rows: [provider] } = await sql<ModelProvider>`select * from model_provider where id = ${providerId}`

    const model: Model = {
      id: name,
      providerId,
      kind: 'text',
      displayName
    }

    if (provider.type === 'anthropic') {
      model.data = {
        anthropicId: name
      }
    }

    await insert('model', model)

    res
      .status(201)
      .location(`models/${model.id}`)
      .end()
  }

  async updateModel (req: Request, res: Response) {
    const { id } = req.params
    const { name, displayName, providerId }: ModelRequest = req.body

    const { rows: [provider] } = await sql<ModelProvider>`select * from model_provider where id = ${providerId}`

    const model: Model = {
      id: name,
      providerId,
      kind: 'text',
      displayName
    }

    if (provider.type === 'anthropic') {
      model.data = {
        anthropicId: name
      }
    }

    const result = await sql`update model set
                 id = ${name},
                 display_name = ${displayName},
                 provider_id = ${providerId},
                 data = ${JSON.stringify(model.data)}
             where id = ${id}`

    if (result.rowCount === 0) {
      res.status(404).end()
      return
    }

    res.status(204).end()
  }

  async deleteModel (req: Request, res: Response) {
    const { rowCount } = await sql`delete from model where id = ${req.params.id}`
    if (rowCount === 0) {
      res.status(404).end()
      return
    }

    res.status(204).end()
  }
}

export default new ModelAdminController()
