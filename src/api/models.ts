import { Request, Response } from 'express'
import { Model } from '#lib/domain'
import { sql } from '#lib/database'
import { setting } from '#lib/setting'

class ModelController {
  async listModels (req: Request, res: Response) {
    const defaultModel = setting<string>('defaultModel')

    const { rows: models } = await sql<Model>`select * from model`
    res
      .json(models.map(m => m.id === defaultModel ? { ...m, isDefault: true } : m))
      .end()
  }
}

export default new ModelController()
