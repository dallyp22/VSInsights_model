// Agent 3: First Principles / Munger Reasoning
// Uses Claude Opus 4 for deep philosophical deconstruction

import { callClaude, MODELS } from '../api-clients';
import { ContextOutput, DecompositionOutput, FirstPrinciplesOutput } from '@/types/agents';

const SYSTEM_PROMPT = `You are the First Principles Reasoning Agent for VS Insights.

Apply Munger-style latticework thinking with deep philosophical deconstruction:

1. FUNDAMENTAL TRUTHS - Strip away assumptions. What is fundamentally true?
2. CORE CONSTRAINTS - Identify constraints from:
   - Physics (what's physically possible)
   - Economics (resources, incentives, trade-offs)
   - Human Behavior (psychology, motivation, biases)
   - Systems (feedback loops, emergent properties)

3. INVERSION ANALYSIS - Apply Charlie Munger's inversion principle:
   - What would guarantee failure?
   - How can we avoid these failure modes?

4. SECOND-ORDER THINKING - Consequences of consequences:
   - What happens next?
   - What are the ripple effects?

5. MUNGER'S LATTICEWORK - Apply mental models from multiple disciplines:
   - Systems Thinking (feedback loops, leverage points)
   - Constraint Theory (bottleneck identification)
   - Incentive Alignment ("Show me the incentive, I'll show you the outcome")
   - Competitive Advantage (moats, network effects)
   - Probabilistic Thinking (base rates, expected value)

Output ONLY valid JSON with this exact structure:
{
  "fundamentalTruths": ["string"],
  "coreConstraints": {
    "physical": ["string"],
    "economic": ["string"],
    "behavioral": ["string"],
    "systemic": ["string"]
  },
  "inversionAnalysis": {
    "failureScenarios": ["string"],
    "preventionStrategies": ["string"]
  },
  "secondOrderEffects": [
    {
      "action": "string",
      "immediateEffect": "string",
      "secondOrderEffect": "string",
      "systemicImpact": "string"
    }
  ],
  "mungerPrinciples": {
    "latticeworkModels": ["string"],
    "mentalModelsApplied": ["string"],
    "inverseThinking": ["string"]
  },
  "reasoningChain": "string (detailed philosophical reasoning)",
  "keyInsights": ["string"]
}`;

export async function runFirstPrinciplesReasoningAgent(
  contextOutput: ContextOutput,
  decompositionOutput: DecompositionOutput
): Promise<FirstPrinciplesOutput> {
  console.log('🧠 Agent 3: First Principles / Munger Reasoning - Starting...');
  
  const userMessage = `Problem Context:
${contextOutput.problemStatement}

Root Cause: ${decompositionOutput.rootCause}

Primary Components:
${decompositionOutput.components.primary.map(c => `- ${c.description}`).join('\n')}

Critical Path: ${decompositionOutput.criticalPath.join(' → ')}

Apply deep first principles and Munger-style latticework reasoning to this problem. Think from fundamental truths, apply inversion, analyze second-order effects, and use mental models from multiple disciplines.`;

  try {
    const response = await callClaude(
      MODELS.CLAUDE_OPUS,
      SYSTEM_PROMPT,
      userMessage,
      4096
    );
    
    // Extract JSON from response
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }
    
    const parsed = JSON.parse(jsonText);
    
    console.log('✅ Agent 3: First Principles / Munger Reasoning - Completed');
    return parsed as FirstPrinciplesOutput;
  } catch (error) {
    console.error('❌ Agent 3: First Principles / Munger Reasoning - Failed:', error);
    throw new Error(`First Principles Reasoning failed: ${error}`);
  }
}

