import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, CpuChipIcon } from '@heroicons/react/24/outline'
import useSWR from 'swr'
import { get } from '#lib/apiClient'

interface Model {
  id: string
  displayName: string
  providerId: string
  isDefault?: boolean
}

type ChatInputProps = {
  onSendMessage: (message: string, modelId: string) => void
}

export default function ChatInput ({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const textareaRef = useRef(null)

  // Fetch available models
  const { data: models } = useSWR<Model[]>('/api/models', get)

  // Set default model when models are loaded
  useEffect(() => {
    if (models && models.length > 0 && !selectedModel) {
      const defaultModel = models.find(m => m.isDefault) || models[0]
      setSelectedModel(defaultModel.id)
    }
  }, [models, selectedModel])

  const selectedModelData = models?.find(m => m.id === selectedModel)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isComposing) {
      onSendMessage(message.trim(), selectedModel)
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModelDropdown && !event.target.closest('.model-dropdown')) {
        setShowModelDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showModelDropdown])

  return (
    <div className='p-4'>
      <div className='max-w-4xl mx-auto'>
        <form onSubmit={handleSubmit} className='relative'>
          <div className='pl-4 flex items-end gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors'>
            {/* Attachment Button (remove pl-4 when adding back) */}
            {/*<button*/}
            {/*  type='button'*/}
            {/*  className='flex-shrink-0 p-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'*/}
            {/*  title='Attach file'*/}
            {/*>*/}
            {/*  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>*/}
            {/*    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' />*/}
            {/*  </svg>*/}
            {/*</button>*/}

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
                className='w-full resize-none border-0 outline-none py-3 px-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent min-h-[20px] max-h-[200px]'
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
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
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
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Press <kbd className='px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300'>Enter</kbd> to send,
              <kbd className='px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 ml-1'>Shift + Enter</kbd> for new line
            </div>
            <div className='flex items-center space-x-4'>
              {/* Model Selection */}
              {models && models.length > 0 && (
                <div className='relative model-dropdown'>
                  <button
                    type='button'
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className='flex items-center space-x-1.5 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                  >
                    <CpuChipIcon className='h-3.5 w-3.5' />
                    <span>{selectedModelData?.displayName || 'Select Model'}</span>
                    <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showModelDropdown && (
                    <div className='absolute right-0 bottom-full mb-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10'>
                      <div className='py-1'>
                        {models.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model.id)
                              setShowModelDropdown(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                              selectedModel === model.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <div>
                                <div className='font-medium'>{model.displayName}</div>
                                <div className='text-xs text-gray-500 dark:text-gray-400'>{model.providerId}</div>
                              </div>
                              {model.isDefault && (
                                <span className='text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full'>
                                  Default
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className='text-xs text-gray-400 dark:text-gray-500'>
                {message.length > 0 && `${message.length} characters`}
              </div>
            </div>
          </div>
        </form>

        {/* Quick Actions */}
        <div className='flex gap-2 mt-3'>
          <button
            type='button'
            onClick={() => setMessage('Can you help me with ')}
            className='px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors cursor-pointer'
          >
            💡 Get help with...
          </button>
          <button
            type='button'
            onClick={() => setMessage('Explain how ')}
            className='px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors cursor-pointer'
          >
            🔧 Explain how...
          </button>
          <button
            type='button'
            onClick={() => setMessage('What are the best practices for ')}
            className='px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors cursor-pointer'
          >
            🎨 Best practices for...
          </button>
        </div>
      </div>
    </div>
  )
}
