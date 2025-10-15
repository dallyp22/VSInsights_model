'use client';

import { AgentName } from '@/types/agents';

interface AgentPipelineProps {
  currentAgent: AgentName | null;
  completedAgents: AgentName[];
}

const AGENTS = [
  {
    name: 'context-extraction' as AgentName,
    label: 'Context',
    icon: '🔍',
    description: 'Extract structure',
  },
  {
    name: 'problem-decomposition' as AgentName,
    label: 'Decompose',
    icon: '🔬',
    description: 'Break down parts',
  },
  {
    name: 'first-principles-reasoning' as AgentName,
    label: 'Munger',
    icon: '🧠',
    description: 'Deep reasoning',
  },
  {
    name: 'framework-architecture' as AgentName,
    label: 'Framework',
    icon: '🏗️',
    description: 'Design solution',
  },
];

export default function AgentPipeline({ currentAgent, completedAgents }: AgentPipelineProps) {
  const getAgentStatus = (agentName: AgentName) => {
    if (completedAgents.includes(agentName)) return 'completed';
    if (currentAgent === agentName) return 'active';
    return 'pending';
  };
  
  const progress = (completedAgents.length / AGENTS.length) * 100;
  
  return (
    <div className="agent-pipeline">
      <p className="pipeline-label">
        Multi-agent system processing your problem
      </p>
      
      <div className="agent-grid">
        {AGENTS.map((agent) => {
          const status = getAgentStatus(agent.name);
          
          return (
            <div 
              key={agent.name} 
              className={`agent-card ${status === 'active' ? 'active' : ''} ${status === 'completed' ? 'completed' : ''}`}
            >
              <div className="agent-icon">
                {status === 'completed' ? (
                  <div className="text-[#CDAB75] text-2xl font-bold">✓</div>
                ) : status === 'active' ? (
                  <div className="flex gap-1">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                ) : (
                  <span>{agent.icon}</span>
                )}
              </div>
              
              <h3 className="agent-title">{agent.label}</h3>
              <p className="agent-description">
                {status === 'active' ? 'Processing...' :
                 status === 'completed' ? 'Completed' :
                 agent.description}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
