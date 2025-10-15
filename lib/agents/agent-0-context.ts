// Agent 0: Context Extraction
// Uses Claude Sonnet 4.5 to extract structured problem context

import { callClaude, MODELS } from '../api-clients';
import { ProblemInput, ContextOutput } from '@/types/agents';

const SYSTEM_PROMPT = `You are the Context Extraction Agent for VS Insights Problem Solver.

Extract and structure the problem into a comprehensive brief:

1. Core problem statement (1-2 clear sentences)
2. Domain classification (Strategy | Operations | Technology | Financial | Marketing)
3. Complexity tier (Tactical | Operational | Strategic)
4. Constraints mentioned or implied (time, budget, resources, regulations)
5. Success criteria (explicit or implied outcomes)
6. Ambiguities requiring clarification (flag as questions if needed)

Output ONLY valid JSON with this exact structure:
{
  "problemStatement": "string",
  "domain": ["string"],
  "complexityTier": "tactical|operational|strategic",
  "constraints": {
    "time": "string or null",
    "budget": "string or null",
    "resources": "string or null",
    "other": ["string"] or null
  },
  "successCriteria": ["string"],
  "clarificationNeeded": ["string"] or null,
  "metadata": {
    "estimatedSolutionTime": "string",
    "recommendedAgentPath": ["string"]
  }
}`;

export async function runContextExtractionAgent(
  input: ProblemInput
): Promise<ContextOutput> {
  console.log('🔍 Agent 0: Context Extraction - Starting...');
  
  const userMessage = `User Problem Input (submitted at ${input.timestamp}):

${input.userInput}

Please analyze this problem and extract structured context as JSON.`;

  try {
    const response = await callClaude(
      MODELS.CLAUDE_SONNET,
      SYSTEM_PROMPT,
      userMessage,
      2048
    );
    
    // Extract JSON from response (handle potential markdown code blocks)
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }
    
    const parsed = JSON.parse(jsonText);
    
    console.log('✅ Agent 0: Context Extraction - Completed');
    return parsed as ContextOutput;
  } catch (error) {
    console.error('❌ Agent 0: Context Extraction - Failed:', error);
    throw new Error(`Context Extraction failed: ${error}`);
  }
}

