import { useState, useRef } from 'react'

export default function ChatInput ({ onSendMessage }) {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isComposing) {
      onSendMessage(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  return (
    <div className='p-4'>
      <div className='max-w-4xl mx-auto'>
        <form onSubmit={handleSubmit} className='relative'>
          <div className='flex items-end gap-3 bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors'>
            {/* Attachment Button */}
            <button
              type='button'
              className='flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 transition-colors'
              title='Attach file'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' />
              </svg>
            </button>

            {/* Text Input */}
            <div className='flex-1 min-h-[44px] flex items-center'>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder='Type your message here... (Shift + Enter for new line)'
                className='w-full resize-none border-0 outline-none py-3 px-0 text-gray-900 placeholder-gray-500 bg-transparent min-h-[20px] max-h-[200px]'
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>

            {/* Send Button */}
            <button
              type='submit'
              disabled={!message.trim() || isComposing}
              className={`flex-shrink-0 p-3 rounded-xl m-1 transition-all ${
                message.trim() && !isComposing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title='Send message'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
              </svg>
            </button>
          </div>

          {/* Character count and tips */}
          <div className='flex justify-between items-center mt-2 px-1'>
            <div className='text-xs text-gray-500'>
              Press <kbd className='px-1.5 py-0.5 bg-gray-100 rounded text-gray-600'>Enter</kbd> to send,
              <kbd className='px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 ml-1'>Shift + Enter</kbd> for new line
            </div>
            <div className='text-xs text-gray-400'>
              {message.length > 0 && `${message.length} characters`}
            </div>
          </div>
        </form>

        {/* Quick Actions */}
        <div className='flex gap-2 mt-3'>
          <button
            type='button'
            onClick={() => setMessage('Can you help me with ')}
            className='px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors'
          >
            💡 Get help with...
          </button>
          <button
            type='button'
            onClick={() => setMessage('Explain how ')}
            className='px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors'
          >
            🔧 Explain how...
          </button>
          <button
            type='button'
            onClick={() => setMessage('What are the best practices for ')}
            className='px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors'
          >
            🎨 Best practices for...
          </button>
        </div>
      </div>
    </div>
  )
}
