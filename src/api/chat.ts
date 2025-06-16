import { Request, Response } from 'express'
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

export async function submitChat (req: Request, res: Response) {
  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages: req.body.messages,
  })

  result.pipeTextStreamToResponse(res)
}
