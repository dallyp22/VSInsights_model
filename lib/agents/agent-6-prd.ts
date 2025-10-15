// Agent 6: PRD Generation
// Uses Claude Opus 4 to create comprehensive Product Requirements Document

import { callClaudeStreaming, MODELS } from '../api-clients';
import {
  ContextOutput,
  DecompositionOutput,
  FirstPrinciplesOutput,
  FrameworkOutput,
  PRDOutput,
} from '@/types/agents';

const SYSTEM_PROMPT = `You are the PRD Generation Agent for VS Insights.

Create a focused, actionable Product Requirements Document for a development team.

CRITICAL RULES:
1. Output ONLY valid JSON (no markdown, no preamble)
2. Keep arrays to 6-8 items maximum (quality over quantity)
3. Be concise but specific
4. Ensure JSON closes properly

Return this EXACT JSON structure:
{
  "executiveSummary": "2-3 sentence summary",
  "problemContext": "1-2 sentence problem description",
  "productVision": "2-3 sentence vision statement",
  "targetUsers": [
    {"persona": "string", "needs": ["need1", "need2", "need3"], "painPoints": ["pain1", "pain2", "pain3"]}
  ],
  "functionalRequirements": [
    {"id": "FR-001", "category": "string", "requirement": "string", "priority": "Must Have", "acceptanceCriteria": ["criteria1", "criteria2"]}
  ],
  "technicalArchitecture": {
    "systemOverview": "2-3 sentence overview",
    "components": [
      {"name": "string", "purpose": "string", "technologies": ["tech1", "tech2"], "interfaces": ["api1", "api2"]}
    ],
    "dataModel": "2-3 sentence description",
    "integrations": [{"system": "string", "method": "string", "dataFlow": "string"}],
    "securityConsiderations": ["consideration1", "consideration2"],
    "scalabilityStrategy": "1-2 sentence strategy"
  },
  "userStories": [
    {"id": "US-001", "as": "persona", "iWant": "goal", "soThat": "benefit", "acceptanceCriteria": ["criteria1", "criteria2"]}
  ],
  "implementationRoadmap": [
    {"phase": "Phase 1", "duration": "X weeks", "objectives": ["obj1", "obj2"], "deliverables": ["del1", "del2"], "dependencies": ["dep1"], "risks": ["risk1"]}
  ],
  "successMetrics": [
    {"metric": "string", "target": "string", "measurement": "string"}
  ],
  "risksAndMitigation": [
    {"risk": "string", "impact": "High", "probability": "Medium", "mitigation": "string"}
  ],
  "openQuestions": ["question1", "question2"]
}

Limits per section:
- targetUsers: 3-4 personas
- functionalRequirements: 8-12 requirements
- components: 4-6 components
- userStories: 8-10 stories
- implementationRoadmap: 3-4 phases
- successMetrics: 6-8 metrics
- risksAndMitigation: 5-7 risks`;

export async function runPRDGenerationAgent(
  contextOutput: ContextOutput,
  decompositionOutput: DecompositionOutput,
  firstPrinciplesOutput: FirstPrinciplesOutput,
  frameworkOutput: FrameworkOutput,
  selectedFramework: string
): Promise<PRDOutput> {
  console.log('📄 Agent 6: PRD Generation - Starting...');

  // Find the selected framework details
  const framework = frameworkOutput.frameworkOptions.find(
    (f) => f.name === selectedFramework
  );

  if (!framework) {
    throw new Error(`Selected framework "${selectedFramework}" not found`);
  }

  const userMessage = `Generate a PRD for:

PROBLEM: ${contextOutput.problemStatement}

SELECTED FRAMEWORK: ${selectedFramework}
Approach: ${framework.approach}

Components: ${framework.architecture.components.slice(0, 6).join(', ')}

Key Insights:
${firstPrinciplesOutput.keyInsights.slice(0, 3).map((i) => `- ${i}`).join('\n')}

Implementation: ${framework.implementation.speed}, ${framework.implementation.complexity} complexity

Generate a focused, complete JSON PRD. Keep it concise but actionable.`;

  try {
    const response = await callClaudeStreaming(
      MODELS.CLAUDE_OPUS,
      SYSTEM_PROMPT,
      userMessage,
      12000
    );

    // Extract JSON from response
    let jsonText = response.trim();
    
    // Remove markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }
    
    // Find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    jsonText = jsonText.trim();

    const parsed = JSON.parse(jsonText);

    console.log('✅ Agent 6: PRD Generation - Completed');
    
    return parsed as PRDOutput;
  } catch (error) {
    console.error('❌ Agent 6: PRD Generation - Failed:', error);
    throw new Error(`PRD Generation failed: ${error instanceof Error ? error.message : error}`);
  }
}
