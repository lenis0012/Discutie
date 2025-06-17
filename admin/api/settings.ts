import { Request, Response } from 'express'
import { setting } from '#lib/setting'

type Setting = {
  name: string
  value: any
}

class SettingsController {
  async getGeneralSettings (req: Request, res: Response) {
    res.json({
      defaultModel: setting<string>('defaultModel')
    }).end()
  }

  async updateSettings (req: Request, res: Response) {
    const settings = req.body as Setting[]

    for (const settingEntry of settings) {
      setting(settingEntry.name, settingEntry.value)
    }

    res.status(204).end()
  }
}

export default new SettingsController()
