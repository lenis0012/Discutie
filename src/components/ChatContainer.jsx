import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatContainer ({ messages }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='text-center max-w-md'>
          <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>Welcome to Discutie</h3>
          <p className='text-gray-600 mb-6'>
            Start a conversation with your AI assistant. Ask questions, get help with coding, or discuss any topic you'd like.
          </p>
          <div className='grid grid-cols-1 gap-3 text-sm'>
            <div className='bg-white rounded-lg p-3 border border-gray-200 text-left'>
              <span className='text-blue-600 font-medium'>💡 Example:</span>
              <p className='text-gray-700 mt-1'>"Help me debug this React component"</p>
            </div>
            <div className='bg-white rounded-lg p-3 border border-gray-200 text-left'>
              <span className='text-blue-600 font-medium'>🔧 Example:</span>
              <p className='text-gray-700 mt-1'>"Explain how async/await works in JavaScript"</p>
            </div>
            <div className='bg-white rounded-lg p-3 border border-gray-200 text-left'>
              <span className='text-blue-600 font-medium'>🎨 Example:</span>
              <p className='text-gray-700 mt-1'>"What are the best practices for UI design?"</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 overflow-y-auto px-4 py-6'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
