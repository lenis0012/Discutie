import { Request, Response } from 'express'
import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText, Message as AIMessage } from 'ai'
import { insert, sql } from '#lib/database'
import { Conversation, Model, ModelProvider, Message } from '#lib/domain'
import { retrieveSession } from '#lib/session'
import { validate as validateUuid } from 'uuid'

// TODO: This is ass but I am running out of time. Probably should use a model
function generateTitle (messages: AIMessage[]) {
  const message = messages.find(m => m.role === 'user')
  const a = message.content.toLowerCase().indexOf(' a ')
  const the = message.content.toLowerCase().indexOf(' the ')
  const of = message.content.toLowerCase().indexOf(' of ')
  let start = 0
  if (a >= 0 && (a < start || start === 0)) start = a + ' a '.length
  if (the >= 0 && (the < start || start === 0)) start = the + ' the '.length
  if (of >= 0 && (of < start || start === 0)) start = of + ' of '.length

  let title = message.content.substring(start, Math.min(message.content.length, start + 50)).trim()
  if (title.length >= 50 && title.indexOf(' ') !== 0) {
    title = title.substring(0, title.lastIndexOf(' '))
  }
  return title
}

function prepareModel (model: Model, modelProvider: ModelProvider) {
  if (modelProvider.type === 'anthropic') {
    const anthropic = createAnthropic({
      apiKey: modelProvider.data.apiKey
    })
    return anthropic(model.data.anthropicId)
  }

  return null
}

async function insertMessage (conversation: Conversation, message: AIMessage) {
  const result = await sql<any>`select count(*) from message where conversation_id = ${conversation.id}`
  const newMessage: Message = {
    conversationId: conversation.id,
    id: parseInt(result.rows[0].count) + 1,
    role: message.role,
    body: message.content,
    postedAt: new Date()
  }
  await insert('message', newMessage)
}

export async function submitChat (req: Request, res: Response) {
  const session = retrieveSession(req)
  if (!session) {
    res.status(401).end()
    return
  }

  const conversationRes = await sql<Conversation>`select * from conversation where id = ${req.body.conversationId}`
  if (!validateUuid(req.body.conversationId) || !req.body.modelId ||
    (conversationRes.rowCount >= 1 && conversationRes.rows[0].accountId !== session.id)) {
    res.status(400).end()
    return
  }

  const { rows: [model], rowCount: nmodel } = await sql<Model>`select * from model where id = ${req.body.modelId}`
  if (nmodel === 0) {

    res.status(400).end()
    return
  }
  const { rows: [provider] } = await sql<ModelProvider>`select * from model_provider where id = ${model.providerId}`

  let conversation = conversationRes.rowCount > 0 ? conversationRes.rows[0] : null
  if (conversationRes.rowCount === 0) {
    conversation = {
      id: req.body.conversationId,
      accountId: session.id,
      title: generateTitle(req.body.messages),
      modelId: model.id,
      startedAt: new Date(),
    }
    await insert('conversation', conversation)
    await insert('message', ...req.body.messages.map((msg, i) => ({
      conversationId: conversation.id,
      id: i + 1,
      role: msg.role,
      body: msg.content,
      postedAt: new Date()
    })))
  } else {
    await insertMessage(conversation, req.body.messages[req.body.messages.length - 1])
  }

  const result = streamText({
    model: prepareModel(model, provider),
    messages: req.body.messages,
    onFinish: (e) => {
      insertMessage(conversation, {
        role: 'assistant',
        content: e.text
      })
    }
  })

  result.pipeTextStreamToResponse(res)
}
