export default function MessageBubble ({ message }) {
  const isUser = message.type === 'user'
  const isAI = message.type === 'ai'

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser
          ? 'bg-blue-600'
          : 'bg-gradient-to-br from-purple-500 to-blue-600'
      }`}
      >
        {isUser ? (
          <span className='text-white text-sm font-medium'>U</span>
        ) : (
          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
          </svg>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
        }`}
        >
          <div className='prose prose-sm max-w-none'>
            {message.content.split('\n').map((line, index) => (
              <p
                key={index} className={`${index === 0 ? 'mt-0' : ''} ${
                isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'
              }`}
              >
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-1 ${
          isUser ? 'text-right' : 'text-left'
        }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>

      {/* Action Buttons (for AI messages) */}
      {isAI && (
        <div className='flex-shrink-0 flex flex-col gap-1 mt-1'>
          <button
            className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group'
            title='Copy message'
          >
            <svg className='w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
            </svg>
          </button>
          <button
            className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group'
            title='Like message'
          >
            <svg className='w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5' />
            </svg>
          </button>
          <button
            className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group'
            title='Dislike message'
          >
            <svg className='w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5' />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
