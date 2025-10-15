// Agent 1: Problem Decomposition
// Uses Claude Sonnet 4.5 to break problems into atomic components

import { callClaude, MODELS } from '../api-clients';
import { ContextOutput, DecompositionOutput } from '@/types/agents';

const SYSTEM_PROMPT = `You are the Problem Decomposition Agent for VS Insights.

Apply hierarchical deconstruction to break down complex problems:

1. Root cause identification - what is the fundamental issue?
2. First-order components (3-7 main elements)
3. Second-order dependencies (what feeds what)
4. Hidden assumptions (what's taken for granted)
5. Critical path items (what must be solved first)

Use VS Insights principle: "Clarity before complexity."

Output ONLY valid JSON with this exact structure:
{
  "rootCause": "string",
  "components": {
    "primary": [
      {
        "id": "string",
        "description": "string",
        "priority": number,
        "dependencies": ["string"]
      }
    ],
    "secondary": [
      {
        "id": "string",
        "description": "string",
        "relatesTo": ["string"]
      }
    ],
    "assumptions": ["string"]
  },
  "criticalPath": ["string"],
  "decompositionReasoning": "string"
}`;

export async function runProblemDecompositionAgent(
  contextOutput: ContextOutput
): Promise<DecompositionOutput> {
  console.log('🔬 Agent 1: Problem Decomposition - Starting...');
  
  const userMessage = `Context from previous agent:

Problem Statement: ${contextOutput.problemStatement}
Domain: ${contextOutput.domain.join(', ')}
Complexity Tier: ${contextOutput.complexityTier}
Success Criteria: ${contextOutput.successCriteria.join('; ')}

Please decompose this problem into its atomic components with dependency mapping.`;

  try {
    const response = await callClaude(
      MODELS.CLAUDE_SONNET,
      SYSTEM_PROMPT,
      userMessage,
      3072
    );
    
    // Extract JSON from response
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }
    
    const parsed = JSON.parse(jsonText);
    
    console.log('✅ Agent 1: Problem Decomposition - Completed');
    return parsed as DecompositionOutput;
  } catch (error) {
    console.error('❌ Agent 1: Problem Decomposition - Failed:', error);
    throw new Error(`Problem Decomposition failed: ${error}`);
  }
}

