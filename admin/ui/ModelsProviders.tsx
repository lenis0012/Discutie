import { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline'
import AddEditModel from './AddEditModel'
import AddEditProvider from './AddEditProvider'
import useSWR from 'swr'
import { Model, ModelProvider } from '#lib/domain'
import { get } from '#lib/apiClient'

// interface ModelProvider {
//   id: string
//   name: string
//   type: 'openai' | 'anthropic' | 'google' | 'ollama' | 'custom'
//   apiKey?: string
//   endpoint?: string
//   enabled: boolean
// }

// interface Model {
//   id: string
//   name: string
//   providerId: string
//   displayName: string
//   contextLength: number
//   enabled: boolean
//   isDefault: boolean
//   conversationsLast30Days: number
// }

type ViewMode = 'list' | 'add-model' | 'edit-model' | 'add-provider' | 'edit-provider'

export default function ModelsProviders () {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider | null>(null)

  const { data: providers, mutate: mutateProviders } = useSWR<ModelProvider[]>('/admin/api/model-providers', get)
  const { data: models, mutate: mutateModels } = useSWR<Model[]>('/api/models', get)

  const handleEditModel = (model: Model) => {
    setSelectedModel(model)
    setViewMode('edit-model')
  }

  const handleDeleteModel = async (id: string) => {
    if (confirm('Are you sure you want to delete this model?')) {
      // TODO: Actually delete model...
      await mutateModels(prev => prev.filter(model => model.id !== id))
    }
  }

  const handleAddModel = () => {
    setSelectedModel(null)
    setViewMode('add-model')
  }

  const handleSaveModel = (modelData: Model) => {
    if (selectedModel) {
      // Edit existing model
      mutateModels(prev => prev.map(model =>
        model.id === selectedModel.id ? { ...model, ...modelData } : model
      ))
    } else {
      // Add new model
      mutateModels(prev => [...prev, modelData])
    }
    setViewMode('list')
  }

  const handleEditProvider = (provider: ModelProvider) => {
    setSelectedProvider(provider)
    setViewMode('edit-provider')
  }

  const handleAddProvider = () => {
    setSelectedProvider(null)
    setViewMode('add-provider')
  }

  const handleSaveProvider = async (provider: ModelProvider) => {
    // TODO: Implement provider save logic
    const existingIndex = providers.findIndex(p => p.id === provider.id)
    await mutateProviders(previous => existingIndex === -1
      ? [...previous, provider]
      : [...previous.slice(0, existingIndex), provider, ...previous.slice(existingIndex + 1)])

    setViewMode(selectedProvider ? 'edit-provider' : 'add-provider')
  }

  const getProviderName = (providerId: string) => {
    return providers?.find(p => p.id === providerId)?.displayName || 'Unknown'
  }

  if (viewMode === 'add-model' || viewMode === 'edit-model') {
    return (
      <AddEditModel
        model={selectedModel}
        providers={providers}
        onSave={handleSaveModel}
        onCancel={() => setViewMode('list')}
        onEditProvider={handleEditProvider}
        onAddProvider={handleAddProvider}
      />
    )
  }

  if (viewMode === 'add-provider' || viewMode === 'edit-provider') {
    return (
      <AddEditProvider
        provider={selectedProvider}
        onSave={handleSaveProvider}
        onCancel={() => setViewMode('list')}
      />
    )
  }

  return (
    <div className='bg-white dark:bg-gray-800 shadow-sm rounded-lg'>
      <div className='px-6 py-5 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex justify-between items-center'>
          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Models
            </h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Manage AI models available to users
            </p>
          </div>
          <button
            onClick={handleAddModel}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer'
          >
            <PlusIcon className='h-4 w-4 mr-2' />
            Add Model
          </button>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
          <thead className='bg-gray-50 dark:bg-gray-700'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Model
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Provider
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Conversations (30d)
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
            {models.map((model) => (
              <tr key={model.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div>
                      <div className='flex items-center space-x-2'>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          {model.displayName}
                        </div>
                        {model.isDefault && (
                          <StarIcon className='h-4 w-4 text-yellow-400 fill-current' />
                        )}
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        {model.displayName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                  {getProviderName(model.providerId)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                  {/*{model.conversationsLast30Days.toLocaleString()}*/} 0
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <div className='flex items-center space-x-3'>
                    <button
                      onClick={() => handleEditModel(model)}
                      className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'
                      title='Edit model'
                    >
                      <PencilIcon className='h-4 w-4' />
                    </button>
                    {/* TODO: Actually check againdt real default model */}
                    {model.isDefault && (
                      <button
                        onClick={() => handleDeleteModel(model.id)}
                        className='text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer'
                        title='Delete model'
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {models.length === 0 && (
        <div className='px-6 py-12 text-center'>
          <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>No models configured</h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Get started by adding your first AI model.
          </p>
          <div className='mt-6'>
            <button
              onClick={handleAddModel}
              className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
            >
              <PlusIcon className='h-4 w-4 mr-2' />
              Add Model
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
