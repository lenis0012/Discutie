import { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import useSWR from 'swr'
import { Model } from '#lib/domain'
import { get, put } from '#lib/apiClient'

interface SettingsForm {
  defaultModel?: string
}

export default function GeneralSettings () {
  const [settings, setSettings] = useState<SettingsForm>({
    defaultModel: ''
  })
  useEffect(() => {
    get('/admin/api/settings/general')
      .then(settings => setSettings(settings))
  }, [])

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Mock available models - replace with actual API call
  const { data: availableModels } = useSWR<Model[]>('/api/models', get)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await put('/admin/api/settings',
        Object.entries(settings).map(([name, value]) => ({ name, value })))
      setSaveSuccess(result.success)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof SettingsForm, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className='bg-white dark:bg-gray-800 shadow-sm rounded-lg'>
      <div className='px-6 py-5 border-b border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
          General Settings
        </h3>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Configure default behavior and system limits
        </p>
      </div>

      <div className='px-6 py-6 space-y-6'>
        {/* Default Model */}
        <div>
          <label htmlFor='default-model' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Default Model
          </label>
          <select
            id='default-model'
            value={settings.defaultModel || ''}
            onChange={(e) => handleInputChange('defaultModel', e.target.value)}
            className='block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            {!settings.defaultModel && (
              <option value=''>Select a model</option>
            )}
            {availableModels && availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.displayName} ({model.providerId})
              </option>
            ))}
          </select>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            The default model used for new conversations
          </p>
        </div>

        {/* More fields.. */}
      </div>

      {/* Save Button */}
      <div className='px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 rounded-b-lg'>
        <div className='flex justify-between items-center'>
          {saveSuccess && (
            <div className='flex items-center text-green-600 dark:text-green-400'>
              <CheckIcon className='h-5 w-5 mr-1' />
              <span className='text-sm font-medium'>Settings saved successfully</span>
            </div>
          )}
          <div className='ml-auto'>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
            >
              {isSaving ? (
                <>
                  <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
