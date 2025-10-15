// Agent Orchestrator - Sequential pipeline execution

import { SessionState, ProblemInput, AgentProgress } from '@/types/agents';
import { runContextExtractionAgent } from './agents/agent-0-context';
import { runProblemDecompositionAgent } from './agents/agent-1-decomposition';
import { runFirstPrinciplesReasoningAgent } from './agents/agent-3-first-principles';
import { runFrameworkArchitectureAgent } from './agents/agent-5-framework';

// Global session storage that survives hot reloads
declare global {
  var sessionStore: Map<string, SessionState> | undefined;
}

// Initialize or reuse existing session store
const sessions = global.sessionStore || new Map<string, SessionState>();
if (!global.sessionStore) {
  global.sessionStore = sessions;
}

export function createSession(problemInput: ProblemInput): SessionState {
  const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const session: SessionState = {
    id,
    problemInput,
    status: 'idle',
    createdAt: new Date().toISOString(),
  };
  
  sessions.set(id, session);
  console.log(`✅ Session created: ${id}, total sessions: ${sessions.size}`);
  return session;
}

export function getSession(id: string): SessionState | undefined {
  const session = sessions.get(id);
  if (!session) {
    console.error(`❌ Session not found: ${id}, total sessions: ${sessions.size}`);
    console.log('Available sessions:', Array.from(sessions.keys()));
  }
  return session;
}

export function updateSession(id: string, updates: Partial<SessionState>): void {
  const session = sessions.get(id);
  if (session) {
    Object.assign(session, updates);
    sessions.set(id, session);
  } else {
    console.error(`❌ Cannot update non-existent session: ${id}`);
  }
}

export async function runAgentPipeline(
  sessionId: string,
  onProgress?: (progress: AgentProgress) => void
): Promise<SessionState> {
  console.log(`🚀 Starting pipeline for session: ${sessionId}`);
  
  const session = getSession(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found. Total sessions: ${sessions.size}`);
  }
  
  try {
    updateSession(sessionId, { status: 'processing' });
    
    // Agent 0: Context Extraction
    onProgress?.({
      agent: 'context-extraction',
      status: 'processing',
      startTime: new Date().toISOString(),
    });
    
    const contextOutput = await runContextExtractionAgent(session.problemInput);
    updateSession(sessionId, { 
      contextOutput,
      currentAgent: 'context-extraction' 
    });
    
    onProgress?.({
      agent: 'context-extraction',
      status: 'completed',
      endTime: new Date().toISOString(),
    });
    
    // Agent 1: Problem Decomposition
    onProgress?.({
      agent: 'problem-decomposition',
      status: 'processing',
      startTime: new Date().toISOString(),
    });
    
    const decompositionOutput = await runProblemDecompositionAgent(contextOutput);
    updateSession(sessionId, { 
      decompositionOutput,
      currentAgent: 'problem-decomposition' 
    });
    
    onProgress?.({
      agent: 'problem-decomposition',
      status: 'completed',
      endTime: new Date().toISOString(),
    });
    
    // Agent 3: First Principles Reasoning (Munger)
    onProgress?.({
      agent: 'first-principles-reasoning',
      status: 'processing',
      startTime: new Date().toISOString(),
    });
    
    const firstPrinciplesOutput = await runFirstPrinciplesReasoningAgent(
      contextOutput,
      decompositionOutput
    );
    updateSession(sessionId, { 
      firstPrinciplesOutput,
      currentAgent: 'first-principles-reasoning' 
    });
    
    onProgress?.({
      agent: 'first-principles-reasoning',
      status: 'completed',
      endTime: new Date().toISOString(),
    });
    
    // Agent 5: Framework Architecture
    onProgress?.({
      agent: 'framework-architecture',
      status: 'processing',
      startTime: new Date().toISOString(),
    });
    
    const frameworkOutput = await runFrameworkArchitectureAgent(
      contextOutput,
      decompositionOutput,
      firstPrinciplesOutput
    );
    updateSession(sessionId, { 
      frameworkOutput,
      currentAgent: 'framework-architecture',
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
    
    onProgress?.({
      agent: 'framework-architecture',
      status: 'completed',
      endTime: new Date().toISOString(),
    });
    
    const finalSession = getSession(sessionId);
    if (!finalSession) {
      throw new Error('Session lost during processing');
    }
    
    console.log(`✅ Pipeline completed for session: ${sessionId}`);
    return finalSession;
    
  } catch (error) {
    console.error('Pipeline error:', error);
    updateSession(sessionId, {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
