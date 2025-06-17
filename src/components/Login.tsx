import { useState } from 'react'

export default function Login ({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`${username}:${password}`),
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        onLogin()
      } else {
        const data = await response.json()
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold gradient-text mb-2'>Discutie</h1>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>Sign in to your account</h2>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Access your AI conversational interface
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            {error && (
              <div className='bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm'>
                {error}
              </div>
            )}

            <div>
              <label htmlFor='username' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Username
              </label>
              <input
                id='username'
                name='username'
                type='text'
                autoComplete='username'
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter your username'
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter your password'
              />
            </div>

            {/*<div className='flex items-center justify-between'>*/}
            {/*  <div className='flex items-center'>*/}
            {/*    <input*/}
            {/*      id='remember-me'*/}
            {/*      name='remember-me'*/}
            {/*      type='checkbox'*/}
            {/*      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'*/}
            {/*    />*/}
            {/*    <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>*/}
            {/*      Remember me*/}
            {/*    </label>*/}
            {/*  </div>*/}

            {/*  <div className='text-sm'>*/}
            {/*    <a href='#' className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'>*/}
            {/*      Forgot your password?*/}
            {/*    </a>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm
                font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 cursor-pointer
                focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isLoading ? (
                  <div className='flex items-center'>
                    <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/*<div className='text-center'>*/}
            {/*  <p className='text-sm text-gray-600 dark:text-gray-400'>*/}
            {/*    Don't have an account?{' '}*/}
            {/*    <a href='#' className='font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'>*/}
            {/*      Sign up*/}
            {/*    </a>*/}
            {/*  </p>*/}
            {/*</div>*/}
          </form>
        </div>
      </div>
    </div>
  )
}
