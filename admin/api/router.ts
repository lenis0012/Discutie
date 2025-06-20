import { Router, } from 'express'
import bodyParser from 'body-parser'
import authMiddleware from './auth.middleware'
import settingsController from './settings'
import providerController from './providers'
import modelController from './models'

export default Router()
  .use(bodyParser.json())
  .use(authMiddleware)
  .get('/settings/general', settingsController.getGeneralSettings)
  .put('/settings', settingsController.updateSettings)
  .get('/model-providers', providerController.listProviders)
  .get('/model-providers/:id', providerController.getProvider)
  .post('/model-providers', providerController.createProvider)
  .put('/model-providers/:id', providerController.updateProvider)
  .get('/models/:id', modelController.getModel)
  .post('/models', modelController.createModel)
  .put('/models/:id', modelController.updateModel)
  .delete('/models/:id', modelController.deleteModel)
