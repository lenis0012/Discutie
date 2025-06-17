import Login from '#components/Login'
import Dashboard from './ui/Dashboard'
import useSWR, { SWRConfig, mutate } from 'swr'

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function AdminApp () {
  const { data, isLoading } = useSWR('/api/session', fetcher)

  const handleLogin = () => {
    mutate('/api/session')
  }

  if (isLoading) {
    return null
  }

  return (
    <SWRConfig value={{
      // Annoyingly, @ai-sdk/react@4 interferes with SWR's global fetcher
      fetcher: undefined
    }}
    >
      {data?.id ? (
        <Dashboard />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </SWRConfig>
  )
}
