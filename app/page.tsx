'use client';

import { useState } from 'react';
import ProblemInput from '@/components/ProblemInput';
import AgentPipeline from '@/components/AgentPipeline';
import AgentOutput from '@/components/AgentOutput';
import { SessionState, AgentName } from '@/types/agents';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentName | null>(null);
  const [completedAgents, setCompletedAgents] = useState<AgentName[]>([]);
  const [session, setSession] = useState<SessionState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPRD, setIsGeneratingPRD] = useState(false);
  
  const handleProblemSubmit = async (problemText: string) => {
    setIsProcessing(true);
    setError(null);
    setCurrentAgent(null);
    setCompletedAgents([]);
    setSession(null);
    
    try {
      // Step 1: Create session
      const startResponse = await fetch('/api/solver/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: problemText }),
      });
      
      if (!startResponse.ok) {
        throw new Error('Failed to create session');
      }
      
      const { sessionId } = await startResponse.json();
      
      // Step 2: Process with agents (simulate progress updates)
      const agents: AgentName[] = [
        'context-extraction',
        'problem-decomposition',
        'first-principles-reasoning',
        'framework-architecture',
      ];
      
      // Start processing in background and simulate UI updates
      const processPromise = fetch('/api/solver/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      
      // Simulate agent progress for better UX
      for (let i = 0; i < agents.length; i++) {
        setCurrentAgent(agents[i]);
        // Wait a bit to show processing state
        await new Promise(resolve => setTimeout(resolve, 2000));
        setCompletedAgents(prev => [...prev, agents[i]]);
      }
      
      // Wait for actual processing to complete
      const processResponse = await processPromise;
      
      if (!processResponse.ok) {
        const errorData = await processResponse.json();
        throw new Error(errorData.details || 'Failed to process problem');
      }
      
      const { session: finalSession } = await processResponse.json();
      setSession(finalSession);
      setCurrentAgent(null);
      
    } catch (err) {
      console.error('Error processing problem:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = () => {
    setSession(null);
    setCurrentAgent(null);
    setCompletedAgents([]);
    setError(null);
    setIsGeneratingPRD(false);
  };

  const handleSelectFramework = async (frameworkName: string) => {
    if (!session?.id) return;
    
    setIsGeneratingPRD(true);
    setError(null);
    
    try {
      const response = await fetch('/api/solver/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          selectedFramework: frameworkName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate PRD');
      }

      const { session: updatedSession } = await response.json();
      setSession(updatedSession);
    } catch (err) {
      console.error('Error generating PRD:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PRD');
    } finally {
      setIsGeneratingPRD(false);
    }
  };
  
  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <div className="relative z-10 py-12 px-4 w-full max-w-5xl mx-auto">
        <ProblemInput 
          onSubmit={handleProblemSubmit} 
          isProcessing={isProcessing}
        />
        
        {isProcessing && (
          <div className="animate-fadeInUp">
            <AgentPipeline 
              currentAgent={currentAgent}
              completedAgents={completedAgents}
            />
          </div>
        )}

        {isGeneratingPRD && (
          <div className="fixed inset-0 bg-[rgba(10,15,10,0.95)] backdrop-blur-md flex items-center justify-center z-50 animate-fadeInUp">
            <div className="text-center">
              <div className="thinking-dots mb-6">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <p className="thinking-text text-2xl mb-2">Generating Comprehensive PRD</p>
              <p className="current-agent">Claude Opus 4 is creating your development-ready specification...</p>
              <p className="text-[rgba(205,171,117,0.4)] text-sm mt-4">This may take 60-90 seconds</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="w-full mx-auto mt-8 animate-fadeInUp">
            <div className="card p-6 border-2 border-[hsl(19,50%,36%)]">
              <h3 className="text-lg font-bold text-[hsl(19,50%,36%)] mb-2">Error</h3>
              <p className="text-[hsl(42,24%,73%)]">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-[hsl(19,50%,36%)] text-[hsl(60,25%,95%)] rounded-lg hover:bg-[hsl(19,50%,46%)] transition-colors font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {session && session.status === 'completed' && (
          <div className="animate-fadeInUp">
            <AgentOutput 
              session={session} 
              onSelectFramework={handleSelectFramework}
              isGeneratingPRD={isGeneratingPRD}
            />
            
            <div className="w-full mx-auto mt-8 text-center">
              <button
                onClick={handleReset}
                className="solve-button"
              >
                Solve Another Problem
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {!session && !isProcessing && !error && (
          <div className="agent-pipeline">
            <p className="pipeline-label">
              Enter a complex problem above to see the VS Insights multi-agent system in action
            </p>
            
            <div className="agent-grid">
              <div className="agent-card">
                <div className="agent-icon">🔍</div>
                <h3 className="agent-title">Context</h3>
                <p className="agent-description">Extract structure</p>
              </div>
              <div className="agent-card">
                <div className="agent-icon">🔬</div>
                <h3 className="agent-title">Decompose</h3>
                <p className="agent-description">Break down parts</p>
              </div>
              <div className="agent-card">
                <div className="agent-icon">🧠</div>
                <h3 className="agent-title">Munger</h3>
                <p className="agent-description">Deep reasoning</p>
              </div>
              <div className="agent-card">
                <div className="agent-icon">🏗️</div>
                <h3 className="agent-title">Framework</h3>
                <p className="agent-description">Design solution</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
