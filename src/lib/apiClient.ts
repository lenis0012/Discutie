import { mutate } from 'swr'

type ApiResponseSuccess<T> = {
  success: true
  data: T | null,
  location?: string
}
type ApiResponseError<E> = {
  success: false
  error: E
}
export type ApiResponse<T, E> = ApiResponseSuccess<T> | ApiResponseError<E>

export async function get<T> (url: string): Promise<T | null> {
  const response = await fetch(url)

  // When unauthorized, refresh session to verify we are still logged in
  if (response.status === 401) {
    try {
      await mutate('/api/session')
    } catch (e) {
      console.error('Failed to refresh session')
    }
    return null
  }
  if (response.status === 404) return null

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }

  return await response.json() as T
}

async function submit<T, E> (method: string, url: string, body?: any): Promise<ApiResponse<T, E>> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': body && 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const contentType = response.headers.get('Content-Type')
  const mimeType = contentType?.substring(0, contentType.indexOf(';'))
  const data = mimeType === 'application/json' ? await response.json() : null

  // When unauthorized, refresh session to verify we are still logged in
  if (response.status === 401) {
    try {
      await mutate('/api/session')
    } catch (e) {
      console.error('Failed to refresh session')
    }
  }

  return response.ok
    ? { success: true, data, location: response.headers.get('Location') }
    : { success: false, error: data }
}

export async function post<T, E> (url: string, body: any): Promise<ApiResponse<T, E>> {
  return submit('POST', url, body)
}

export async function put<T, E> (url: string, body: any): Promise<ApiResponse<T, E>> {
  return submit('PUT', url, body)
}

export async function del<T, E> (url: string): Promise<ApiResponse<T, E>> {
  return submit('DELETE', url)
}
