import { Suspense, useState } from 'react'
import { CogIcon, CpuChipIcon, UsersIcon } from '@heroicons/react/24/outline'
import GeneralSettings from './GeneralSettings'
import ModelsProviders from './ModelsProviders'
import UsersManagement from './UsersManagement'

type TabType = 'settings' | 'models' | 'users'

export default function Dashboard () {
  const [activeTab, setActiveTab] = useState<TabType>('settings')

  const tabs = [
    { id: 'settings' as const, name: 'General Settings', icon: CogIcon },
    { id: 'models' as const, name: 'Models & Providers', icon: CpuChipIcon },
    { id: 'users' as const, name: 'Users', icon: UsersIcon }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return <GeneralSettings />
      case 'models':
        return <ModelsProviders />
      case 'users':
        return <UsersManagement />
      default:
        return <GeneralSettings />
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Admin Dashboard</h1>
              <p className='text-gray-600 dark:text-gray-400 mt-1'>Manage your Discutie instance</p>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg text-sm font-medium'>
                Administrator
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Navigation Tabs */}
        <div className='border-b border-gray-200 dark:border-gray-700 mb-8'>
          <nav className='-mb-px flex space-x-8'>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${
                    activeTab === tab.id
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                  }`}
                  />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className='space-y-6'>
          <Suspense>
            {renderContent()}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
