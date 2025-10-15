// API client configuration for AI model providers

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Anthropic client (Claude Sonnet 4.5 & Opus 4)
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize OpenAI client (GPT-4o)
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Google Gemini client
export const gemini = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY || ''
);

// Model configurations
export const MODELS = {
  CLAUDE_SONNET: 'claude-sonnet-4-20250514',
  CLAUDE_OPUS: 'claude-opus-4-20250514',
  GPT_4O: 'gpt-4o',
  GEMINI_FLASH: 'gemini-2.0-flash-exp',
} as const;

// Retry logic with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${i + 1} failed:`, error);
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

// Helper function to call Claude models
export async function callClaude(
  model: typeof MODELS.CLAUDE_SONNET | typeof MODELS.CLAUDE_OPUS,
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 4096
) {
  return retryWithBackoff(async () => {
    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });
    
    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    throw new Error('Unexpected response format from Claude');
  });
}

// Helper function to call Claude with streaming (for long operations)
export async function callClaudeStreaming(
  model: typeof MODELS.CLAUDE_SONNET | typeof MODELS.CLAUDE_OPUS,
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 4096
) {
  return retryWithBackoff(async () => {
    const stream = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      stream: true,
    });

    let fullText = '';
    for await (const messageStreamEvent of stream) {
      if (
        messageStreamEvent.type === 'content_block_delta' &&
        messageStreamEvent.delta.type === 'text_delta'
      ) {
        fullText += messageStreamEvent.delta.text;
      }
    }

    return fullText;
  });
}

// Helper function to call OpenAI models
export async function callOpenAI(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 4096
) {
  return retryWithBackoff(async () => {
    const completion = await openai.chat.completions.create({
      model: MODELS.GPT_4O,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });
    
    return completion.choices[0]?.message?.content || '';
  });
}

// Helper function to call Gemini models
export async function callGemini(
  prompt: string,
  maxTokens: number = 4096
) {
  return retryWithBackoff(async () => {
    const model = gemini.getGenerativeModel({ 
      model: MODELS.GEMINI_FLASH,
      generationConfig: {
        maxOutputTokens: maxTokens,
      },
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  });
}

