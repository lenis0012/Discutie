import { useState } from 'react'
import { useSession } from '#lib/hooks'
import useSWR from 'swr'
import { Conversation } from '#lib/domain'
import { get } from '#lib/apiClient'
import { formatDistance } from 'date-fns'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void,
  onNew: () => void,
  onActivate: (conversation: Conversation) => void,
  activeConversation?: string
}

function capitalize (str: string) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function Sidebar ({ isOpen, onClose, onNew, onActivate, activeConversation }: SidebarProps) {
  const session = useSession()

  // const [conversations] = useState([
  //   { id: 1, title: 'React Development Help', timestamp: '2 hours ago', preview: 'How to optimize React components...' },
  //   { id: 2, title: 'API Integration', timestamp: '1 day ago', preview: 'Setting up REST API calls...' },
  //   { id: 3, title: 'Database Design', timestamp: '3 days ago', preview: 'PostgreSQL schema design...' },
  //   { id: 4, title: 'UI/UX Discussion', timestamp: '1 week ago', preview: 'Modern design principles...' },
  // ])
  const { data: conversations } = useSWR<Conversation[]>('/api/conversations/me', get)

  return (
    <div className='h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col'>
      {/* Sidebar Header */}
      <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Conversations</h2>
          <button
            onClick={onClose}
            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <button onClick={onNew} className='w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-2'>
          {conversations?.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onActivate(conversation)}
              className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 leading-0 ${
                activeConversation === conversation.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <h3 className='font-medium text-gray-900 dark:text-gray-100 text-sm truncate mb-0'>
                {conversation.title}
              </h3>
              {/*<p className='text-xs text-gray-500 dark:text-gray-400 truncate mb-1'>*/}
              {/*  {conversation.preview}*/}
              {/*</p>*/}
              <span className='text-xs text-gray-400 dark:text-gray-500'>
                {formatDistance(Date.parse(conversation.startedAt as string), new Date(), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
            <span className='text-white text-sm font-medium'>{session.displayName?.charAt(0).toUpperCase()}</span>
          </div>
          <div className='flex-1'>
            <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>{session.displayName}</p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>{capitalize(session.role)}</p>
          </div>
          <button className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors'>
            <svg className='w-4 h-4 text-gray-500 dark:text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
