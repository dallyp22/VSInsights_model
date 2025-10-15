// Agent 5: Framework Architecture
// Uses Claude Sonnet 4.5 to design adaptive system solution

import { callClaude, MODELS } from '../api-clients';
import { 
  ContextOutput, 
  DecompositionOutput, 
  FirstPrinciplesOutput,
  FrameworkOutput 
} from '@/types/agents';

const SYSTEM_PROMPT = `You are the Framework Architecture Agent for VS Insights.

Design adaptive system solutions based on:
- Problem context and constraints
- Component decomposition and dependencies
- First principles insights and mental models

Create 2-3 framework options with:

1. ARCHITECTURE DESIGN
   - Components and their relationships
   - Data flow and decision logic
   - Integration points

2. DATA REQUIREMENTS
   - Sources, schema, refresh rate, volume

3. IMPLEMENTATION ASSESSMENT
   - Speed (Fast/Medium/Slow)
   - Complexity (Low/Medium/High)
   - Cost (Low/Medium/High)
   - Scalability (Low/Medium/High)

4. TRADEOFFS & VS INSIGHTS FIT
   - What you gain vs what you sacrifice
   - Score 1-10 for VS Insights methodology fit

Output ONLY valid JSON with this exact structure:
{
  "frameworkOptions": [
    {
      "name": "string",
      "approach": "modular|monolithic|hybrid",
      "architecture": {
        "components": ["string"],
        "dataFlow": ["string"],
        "decisionLogic": ["string"],
        "integrationPoints": ["string"]
      },
      "dataRequirements": {
        "sources": ["string"],
        "schema": "string",
        "refreshRate": "string",
        "volume": "string"
      },
      "implementation": {
        "speed": "Fast (2-4 weeks)|Medium (1-2 months)|Slow (3+ months)",
        "complexity": "Low|Medium|High",
        "cost": "Low|Medium|High",
        "scalability": "Low|Medium|High"
      },
      "tradeoffs": "string",
      "vsInsightsFit": number
    }
  ],
  "recommendedFramework": "string",
  "reasoning": "string"
}`;

export async function runFrameworkArchitectureAgent(
  contextOutput: ContextOutput,
  decompositionOutput: DecompositionOutput,
  firstPrinciplesOutput: FirstPrinciplesOutput
): Promise<FrameworkOutput> {
  console.log('🏗️  Agent 5: Framework Architecture - Starting...');
  
  const userMessage = `Problem Context:
${contextOutput.problemStatement}

Complexity: ${contextOutput.complexityTier}
Domain: ${contextOutput.domain.join(', ')}

Key Components:
${decompositionOutput.components.primary.slice(0, 5).map(c => `- ${c.description}`).join('\n')}

Fundamental Truths:
${firstPrinciplesOutput.fundamentalTruths.join('\n')}

Key Insights:
${firstPrinciplesOutput.keyInsights.join('\n')}

Mental Models Applied:
${firstPrinciplesOutput.mungerPrinciples.mentalModelsApplied.join(', ')}

Design 2-3 framework options that solve this problem. Consider the constraints, leverage the insights, and provide practical implementation paths.`;

  try {
    const response = await callClaude(
      MODELS.CLAUDE_SONNET,
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
    
    console.log('✅ Agent 5: Framework Architecture - Completed');
    return parsed as FrameworkOutput;
  } catch (error) {
    console.error('❌ Agent 5: Framework Architecture - Failed:', error);
    throw new Error(`Framework Architecture failed: ${error}`);
  }
}

