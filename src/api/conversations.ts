import { Request, Response } from 'express'
import { retrieveSession } from '#lib/session'
import { Conversation, Message } from '#lib/domain'
import { sql } from '#lib/database'

class ConversationController {
  async getMessages (req: Request, res: Response) {
    const conversationId = req.params.conversationId
    const session = retrieveSession(req)
    if(!session) {
      res.status(401).end()
      return
    }

    const { rows: messages } = await sql<Message>`select * from message where conversation_id = ${conversationId} 
                        and exists(select 1 from conversation where id = ${conversationId} and account_id = ${session.id})
                        order by id asc`

    res.json(messages.map(msg => {
      const date = (msg.postedAt as Date).toISOString()
      return {
        ...msg,
        postedAt: date
      }
    }))
      .end()
  }

  async getMyConversations (req: Request, res: Response) {
    const session = retrieveSession(req)
    if (!session) {
      res.status(401).end()
      return
    }

    const { rows: conversations } = await sql<Conversation>`select * from conversation where account_id = ${session.id} order by started_at desc`
    res
      .json(conversations.map(c => {
        const date = (c.startedAt as Date).toISOString()
        return {
          ...c,
          createdAt: date
        }
      }))
      .end()
  }
}

export default new ConversationController()
