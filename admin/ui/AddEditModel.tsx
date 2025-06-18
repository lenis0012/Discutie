import { useState, useEffect } from 'react'
import { ArrowLeftIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Model, ModelProvider } from '#lib/domain'
import { get, post, put } from '#lib/apiClient'

interface AddEditModelProps {
  model: Model | null
  providers: ModelProvider[]
  onSave: (modelData: Partial<Model>) => void
  onCancel: () => void
  onEditProvider: (provider: ModelProvider) => void
  onAddProvider: () => void
}

export default function AddEditModel ({
  model,
  providers,
  onSave,
  onCancel,
  onEditProvider,
  onAddProvider
}: AddEditModelProps) {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    providerId: '',
    // contextLength: 0,
    // enabled: true,
    // isDefault: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.id,
        displayName: model.displayName,
        providerId: model.providerId,
        // contextLength: model.contextLength,
        // enabled: model.enabled,
        // isDefault: model.isDefault
      })
    }
  }, [model])

  const enabledProviders = providers//.filter(p => p.enabled)
  const selectedProvider = providers.find(p => p.id === formData.providerId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Model name is required'
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required'
    }

    if (!formData.providerId) {
      newErrors.providerId = 'Provider is required'
    }

    // if (formData.contextLength <= 0) {
    //   newErrors.contextLength = 'Context length must be greater than 0'
    // }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      if (model) {
        await put(`/admin/api/models/${model.id}`, formData)
        onSave(await get(`/admin/api/models/${formData.name}`))
      } else {
        const result = await post('/admin/api/models', formData)
        if (!result.success) {
          setErrors({ api: 'Provider could not be created. Please try again.' })
          return
        }
        onSave(await get(`/admin/api/${result.location}`))
      }
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className='bg-white dark:bg-gray-800 shadow-sm rounded-lg'>
      <div className='px-6 py-5 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center space-x-3'>
          <button
            onClick={onCancel}
            className='p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'
          >
            <ArrowLeftIcon className='h-5 w-5' />
          </button>
          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              {model ? 'Edit Model' : 'Add New Model'}
            </h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {model ? 'Update model configuration' : 'Configure a new AI model'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='px-6 py-6 space-y-6'>
        {/* Provider Selection */}
        <div>
          <label htmlFor='provider' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Provider
          </label>
          <div className='flex space-x-2'>
            <select
              id='provider'
              value={formData.providerId}
              onChange={(e) => handleInputChange('providerId', e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.providerId ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value=''>Select a provider</option>
              {enabledProviders.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.displayName} ({provider.type})
                </option>
              ))}
            </select>
            {selectedProvider && (
              <button
                type='button'
                onClick={() => onEditProvider(selectedProvider)}
                className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                title='Edit provider settings'
              >
                <PencilIcon className='h-4 w-4' />
              </button>
            )}
            <button
              type='button'
              onClick={onAddProvider}
              className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
              title='Add new provider'
            >
              <PlusIcon className='h-4 w-4' />
            </button>
          </div>
          {errors.providerId && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.providerId}</p>
          )}
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor='display-name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Display Name
          </label>
          <input
            id='display-name'
            type='text'
            value={formData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.displayName ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder='e.g., GPT-4, Claude 3 Opus'
          />
          {errors.displayName && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.displayName}</p>
          )}
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            The user-friendly name shown in the interface
          </p>
        </div>

        {/* Model Name */}
        <div>
          <label htmlFor='model-name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Model Name
          </label>
          <input
            id='model-name'
            type='text'
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder='e.g., gpt-4, claude-3-opus'
          />
          {errors.name && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.name}</p>
          )}
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            The technical model name as used by the provider
          </p>
        </div>

        {/* Context Length */}
        {/*<div>*/}
        {/*  <label htmlFor='context-length' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>*/}
        {/*    Context Length*/}
        {/*  </label>*/}
        {/*  <div className='relative'>*/}
        {/*    <input*/}
        {/*      id='context-length'*/}
        {/*      type='number'*/}
        {/*      min='1'*/}
        {/*      value={formData.contextLength}*/}
        {/*      onChange={(e) => handleInputChange('contextLength', parseInt(e.target.value))}*/}
        {/*      className={`block w-full px-3 py-2 pr-16 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${*/}
        {/*        errors.contextLength ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'*/}
        {/*      }`}*/}
        {/*      placeholder='8192'*/}
        {/*    />*/}
        {/*    <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>*/}
        {/*      <span className='text-sm text-gray-500 dark:text-gray-400'>tokens</span>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  {errors.contextLength && (*/}
        {/*    <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.contextLength}</p>*/}
        {/*  )}*/}
        {/*  <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>*/}
        {/*    Maximum number of tokens the model can process*/}
        {/*  </p>*/}
        {/*</div>*/}

        {/* Settings */}
        {/*<div className='space-y-4'>*/}
        {/*  <div className='flex items-start'>*/}
        {/*    <div className='flex items-center h-5'>*/}
        {/*      <input*/}
        {/*        id='enabled'*/}
        {/*        type='checkbox'*/}
        {/*        checked={formData.enabled}*/}
        {/*        onChange={(e) => handleInputChange('enabled', e.target.checked)}*/}
        {/*        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <div className='ml-3 text-sm'>*/}
        {/*      <label htmlFor='enabled' className='font-medium text-gray-700 dark:text-gray-300'>*/}
        {/*        Enable Model*/}
        {/*      </label>*/}
        {/*      <p className='text-gray-500 dark:text-gray-400'>*/}
        {/*        Make this model available to users*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/*  <div className='flex items-start'>*/}
        {/*    <div className='flex items-center h-5'>*/}
        {/*      <input*/}
        {/*        id='is-default'*/}
        {/*        type='checkbox'*/}
        {/*        checked={formData.isDefault}*/}
        {/*        onChange={(e) => handleInputChange('isDefault', e.target.checked)}*/}
        {/*        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <div className='ml-3 text-sm'>*/}
        {/*      <label htmlFor='is-default' className='font-medium text-gray-700 dark:text-gray-300'>*/}
        {/*        Set as Default*/}
        {/*      </label>*/}
        {/*      <p className='text-gray-500 dark:text-gray-400'>*/}
        {/*        Use this model as the default for new conversations*/}
        {/*      </p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Actions */}
        <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
          >
            {model ? 'Update Model' : 'Add Model'}
          </button>
        </div>
      </form>
    </div>
  )
}
