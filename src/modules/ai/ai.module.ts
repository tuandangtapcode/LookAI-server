import { GoogleGenAI } from '@google/genai'
import { Module } from '@nestjs/common'
import env from 'src/config/env'
import { GEMINI_CLIENT } from './ai.constant'
import { AIService } from './ai.service'

@Module({
  providers: [
    {
      provide: GEMINI_CLIENT,
      useFactory: () => new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
    },
    AIService
  ],
  exports: [AIService]
})
export class AIModule {}
