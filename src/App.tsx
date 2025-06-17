import ChatLayout from '#components/ChatLayout'
import Login from '#components/Login'
import useSWR, { mutate } from 'swr'
import { get } from '#lib/apiClient'
import { Session } from '#lib/session'

function App () {
  const { data, isLoading } = useSWR('/api/session', get<Session>)

  const handleLogin = () => {
    mutate('/api/session')
  }

  if (isLoading) {
    return null
  }

  return (
    <>
      {data?.id ? (
        <ChatLayout />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  )
}

export default App
