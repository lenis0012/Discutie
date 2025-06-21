import { UIMessage } from 'ai'
import { useMemo } from 'react'
import { Marked } from 'marked'
import DOMPurify from 'dompurify'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight (code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
)

export default function MessageBubble ({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user'
  const isAI = message.role === 'assistant'

  const formatTime = (timestamp?: Date) => {
    return (timestamp || new Date()).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const messageHtml = useMemo(() => {
    return DOMPurify.sanitize(marked.parse(message.content) as string)
  }, [message.content])

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
      <div className={`flex-1 max-w-4xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
        }`}
        >
          <div className='prose dark:prose-invert max-w-none'>
            {/*{message.content.split('\n').map((line, index) => (*/}
            {/*  <p*/}
            {/*    key={index} className={`${index === 0 ? 'mt-0' : ''} ${*/}
            {/*    isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'*/}
            {/*  }`}*/}
            {/*  >*/}
            {/*    {line || '\u00A0'}*/}
            {/*  </p>*/}
            {/*))}*/}
            <article className={`${isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`} dangerouslySetInnerHTML={{ __html: messageHtml }} />
          </div>
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-1 ${
          isUser ? 'text-right' : 'text-left'
        }`}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>

      {/* Action Buttons (for AI messages) */}
      {isAI && (
        <div className='flex-shrink-0 flex flex-col gap-1 mt-1'>
          <button
            className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group'
            title='Copy message'
            onClick={() => navigator.clipboard.writeText(message.content)}
          >
            <svg className='w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
