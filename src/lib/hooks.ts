import type { Session } from '#lib/session'
import useSWR from 'swr'
import { get } from '#lib/apiClient'

export function useSession () {
  const { data } = useSWR('/api/session', get)
  return data as Session
}