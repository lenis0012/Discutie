import { Request, Response } from 'express'
import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

export async function submitChat (req: Request, res: Response) {
  const { text } = await generateText({
    model: anthropic('claude-3-5-haiku-20241022'),
    prompt: req.body.prompt
  })

  res
    .json({
      text
    })
    .end()
}
