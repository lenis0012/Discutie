export interface Account {
  id: number
  username: string
  role: string
  passwordHash: string
  displayName: string
}

interface ModelProviderAnthropic {
  apiKey: string
}

export interface ModelProvider {
  id: string
  type: 'anthropic' | 'openrouter'
  displayName: string
  data: (ModelProviderAnthropic) & Record<string, any>
}

type ModelAnthropic = {
  anthropicId: string
}

export interface Model {
  id: string
  providerId: string
  kind: 'text'
  displayName: string
  data?: ModelAnthropic & Record<string, any>
}

export interface Conversation {
  id: string
  accountId: number
  title: string
  modelId: string
  startedAt: Date | string
  messages?: Message[]
}

export interface Message {
  conversationId: string
  id: number
  role: string
  body: string
  postedAt: Date | string
}
