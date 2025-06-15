import { useState } from 'react'
import Sidebar from './Sidebar'
import ChatContainer from './ChatContainer.js'
import ChatInput from './ChatInput'
import { useChat } from '@ai-sdk/react'
import { generateId } from 'ai'

export default function ChatLayout () {
  const { messages, append } = useChat({
    initialMessages: [
      {
        id: generateId(),
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        role: 'assistant'
      }
    ],
    streamProtocol: 'text'
  })
  // const [messages, setMessages] = useState([
  //   {
  //     id: 1,
  //     type: 'ai',
  //     content: 'Hello! I\'m your AI assistant. How can I help you today?',
  //     timestamp: new Date()
  //   }
  // ])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleSendMessage = async (content) => {
    await append({
      id: generateId(),
      content,
      role: 'user'
    })
    // const newMessage = {
    //   id: Date.now(),
    //   type: 'user',
    //   content,
    //   timestamp: new Date()
    // }
    //
    // setMessages(prev => [...prev, newMessage])
    //
    // // Simulate AI response (replace with actual API call)
    // const res = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     prompt: content
    //   })
    // }).then(res => res.json())
    //
    // const aiResponse = {
    //   id: Date.now() + 1,
    //   type: 'ai',
    //   content: res.text,
    //   timestamp: new Date()
    // }
    // setMessages(prev => [...prev, aiResponse])
  }

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              </button>
            )}
            <h1 className='text-xl font-semibold gradient-text'>Discutie</h1>
          </div>
          <div className='flex items-center gap-2'>
            <span className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded-full text-sm font-medium'>
              AI Assistant
            </span>
          </div>
        </header>

        {/* Chat Container */}
        <div className='flex-1 overflow-hidden'>
          <ChatContainer messages={messages} />
        </div>

        {/* Chat Input */}
        <div className='border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}
