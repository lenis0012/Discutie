import { useState, useEffect } from 'react'
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { ModelProvider } from '#lib/domain'
import { get, post, put } from '#lib/apiClient'

// interface ModelProvider {
//   id: string
//   name: string
//   type: string
//   apiKey?: string
//   endpoint?: string
//   enabled: boolean
// }

interface AddEditProviderProps {
  provider: ModelProvider | null
  onSave: (providerData: Partial<ModelProvider>) => void
  onCancel: () => void
}

const providerTypes = [
  { value: 'openai', label: 'OpenAI', description: 'GPT models from OpenAI' },
  { value: 'anthropic', label: 'Anthropic', description: 'Claude models from Anthropic' },
  { value: 'google', label: 'Google AI', description: 'Gemini models from Google' },
  { value: 'ollama', label: 'Ollama', description: 'Local models via Ollama' },
  { value: 'custom', label: 'Custom', description: 'Custom OpenAI-compatible API' }
] as const

export default function AddEditProvider ({
  provider,
  onSave,
  onCancel
}: AddEditProviderProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'anthropic',
    apiKey: ''
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.displayName,
        type: provider.type,
        apiKey: provider.data?.apiKey || ''
      })
    }
  }, [provider])

  const selectedProviderType = providerTypes.find(type => type.value === formData.type)
  const requiresApiKey = !['ollama'].includes(formData.type)
  // const requiresEndpoint = ['ollama', 'custom'].includes(formData.type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Provider name is required'
    }

    if (requiresApiKey && !formData.apiKey.trim()) {
      newErrors.apiKey = 'API key is required for this provider type'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      if (provider) {
        await put(`/admin/api/model-providers/${provider.id}`, formData)
        onSave(await get(`/admin/api/model-providers/${provider.id}`))
      } else {
        const result = await post('/admin/api/model-providers', formData)
        if (!result.success) {
          setErrors({ api: 'Provider could not be created. Please try again.' })
          return
        }
        onSave(await get(`/admin/api/${result.location}`))
      }
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
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
              {provider ? 'Edit Provider' : 'Add New Provider'}
            </h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {provider ? 'Update provider configuration' : 'Configure a new AI model provider'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='px-6 py-6 space-y-6'>
        {/* Provider Type */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
            Provider Type
          </label>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {providerTypes.map((type) => (
              <div key={type.value}>
                <label className='relative flex cursor-pointer rounded-lg border bg-white dark:bg-gray-700 p-4 shadow-sm focus:outline-none'>
                  <input
                    type='radio'
                    name='provider-type'
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => {
                      handleInputChange('type', e.target.value)
                      // Auto-fill endpoint for known providers
                      // if (requiresEndpoint) {
                      //   handleInputChange('endpoint', getDefaultEndpoint(e.target.value))
                      // }
                    }}
                    className='sr-only'
                  />
                  <div className='flex flex-1'>
                    <div className='flex flex-col'>
                      <span className={`block text-sm font-medium ${
                        formData.type === type.value
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                      }`}
                      >
                        {type.label}
                      </span>
                      <span className={`block text-sm ${
                        formData.type === type.value
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                      >
                        {type.description}
                      </span>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 ${
                    formData.type === type.value
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  >
                    {formData.type === type.value && (
                      <div className='w-2 h-2 rounded-full bg-white mx-auto mt-0.5' />
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Provider Name */}
        <div>
          <label htmlFor='provider-name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Provider Name
          </label>
          <input
            id='provider-name'
            type='text'
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={`e.g., ${selectedProviderType?.label || 'My Provider'}`}
          />
          {errors.name && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.name}</p>
          )}
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            A friendly name to identify this provider
          </p>
        </div>

        {/* API Key */}
        {requiresApiKey && (
          <div>
            <label htmlFor='api-key' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              API Key
            </label>
            <div className='relative'>
              <input
                id='api-key'
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.apiKey ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder='Enter your API key'
              />
              <button
                type='button'
                onClick={() => setShowApiKey(!showApiKey)}
                className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'
              >
                {showApiKey ? (
                  <EyeSlashIcon className='h-5 w-5' />
                ) : (
                  <EyeIcon className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors.apiKey && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.apiKey}</p>
            )}
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Your API key will be stored securely and used for authentication
            </p>
          </div>
        )}

        {/* Enable Provider */}
        {/*<div className='flex items-start'>*/}
        {/*  <div className='flex items-center h-5'>*/}
        {/*    <input*/}
        {/*      id='enabled'*/}
        {/*      type='checkbox'*/}
        {/*      checked={formData.enabled}*/}
        {/*      onChange={(e) => handleInputChange('enabled', e.target.checked)}*/}
        {/*      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*  <div className='ml-3 text-sm'>*/}
        {/*    <label htmlFor='enabled' className='font-medium text-gray-700 dark:text-gray-300'>*/}
        {/*      Enable Provider*/}
        {/*    </label>*/}
        {/*    <p className='text-gray-500 dark:text-gray-400'>*/}
        {/*      Make this provider available for creating models*/}
        {/*    </p>*/}
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
            {provider ? 'Update Provider' : 'Add Provider'}
          </button>
        </div>
      </form>
    </div>
  )
}
