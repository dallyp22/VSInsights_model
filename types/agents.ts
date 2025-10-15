// Type definitions for VS Insights Problem Solver agents

export interface ProblemInput {
  userInput: string;
  timestamp: string;
  userId?: string;
}

export interface ContextOutput {
  problemStatement: string;
  domain: string[];
  complexityTier: 'tactical' | 'operational' | 'strategic';
  constraints: {
    time?: string;
    budget?: string;
    resources?: string;
    other?: string[];
  };
  successCriteria: string[];
  clarificationNeeded: string[] | null;
  metadata: {
    estimatedSolutionTime: string;
    recommendedAgentPath: string[];
  };
}

export interface DecompositionOutput {
  rootCause: string;
  components: {
    primary: Array<{
      id: string;
      description: string;
      priority: number;
      dependencies: string[];
    }>;
    secondary: Array<{
      id: string;
      description: string;
      relatesTo: string[];
    }>;
    assumptions: string[];
  };
  criticalPath: string[];
  decompositionReasoning: string;
}

export interface FirstPrinciplesOutput {
  fundamentalTruths: string[];
  coreConstraints: {
    physical: string[];
    economic: string[];
    behavioral: string[];
    systemic: string[];
  };
  inversionAnalysis: {
    failureScenarios: string[];
    preventionStrategies: string[];
  };
  secondOrderEffects: Array<{
    action: string;
    immediateEffect: string;
    secondOrderEffect: string;
    systemicImpact: string;
  }>;
  mungerPrinciples: {
    latticeworkModels: string[];
    mentalModelsApplied: string[];
    inverseThinking: string[];
  };
  reasoningChain: string;
  keyInsights: string[];
}

export interface FrameworkOutput {
  frameworkOptions: Array<{
    name: string;
    approach: 'modular' | 'monolithic' | 'hybrid';
    architecture: {
      components: string[];
      dataFlow: string[];
      decisionLogic: string[];
      integrationPoints: string[];
    };
    dataRequirements: {
      sources: string[];
      schema: string;
      refreshRate: string;
      volume: string;
    };
    implementation: {
      speed: 'Fast (2-4 weeks)' | 'Medium (1-2 months)' | 'Slow (3+ months)';
      complexity: 'Low' | 'Medium' | 'High';
      cost: 'Low' | 'Medium' | 'High';
      scalability: 'Low' | 'Medium' | 'High';
    };
    tradeoffs: string;
    vsInsightsFit: number; // 1-10 score
  }>;
  recommendedFramework: string;
  reasoning: string;
}

export interface PRDOutput {
  executiveSummary: string;
  problemContext: string;
  productVision: string;
  targetUsers: Array<{
    persona: string;
    needs: string[];
    painPoints: string[];
  }>;
  functionalRequirements: Array<{
    id: string;
    category: string;
    requirement: string;
    priority: 'Must Have' | 'Should Have' | 'Nice to Have';
    acceptanceCriteria: string[];
  }>;
  technicalArchitecture: {
    systemOverview: string;
    components: Array<{
      name: string;
      purpose: string;
      technologies: string[];
      interfaces: string[];
    }>;
    dataModel: string;
    integrations: Array<{
      system: string;
      method: string;
      dataFlow: string;
    }>;
    securityConsiderations: string[];
    scalabilityStrategy: string;
  };
  userStories: Array<{
    id: string;
    as: string;
    iWant: string;
    soThat: string;
    acceptanceCriteria: string[];
  }>;
  implementationRoadmap: Array<{
    phase: string;
    duration: string;
    objectives: string[];
    deliverables: string[];
    dependencies: string[];
    risks: string[];
  }>;
  successMetrics: Array<{
    metric: string;
    target: string;
    measurement: string;
  }>;
  risksAndMitigation: Array<{
    risk: string;
    impact: 'High' | 'Medium' | 'Low';
    probability: 'High' | 'Medium' | 'Low';
    mitigation: string;
  }>;
  openQuestions: string[];
}

export interface SessionState {
  id: string;
  problemInput: ProblemInput;
  contextOutput?: ContextOutput;
  decompositionOutput?: DecompositionOutput;
  firstPrinciplesOutput?: FirstPrinciplesOutput;
  frameworkOutput?: FrameworkOutput;
  selectedFramework?: string;
  prdOutput?: PRDOutput;
  status: 'idle' | 'processing' | 'completed' | 'error';
  currentAgent?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export type AgentName = 
  | 'context-extraction'
  | 'problem-decomposition'
  | 'first-principles-reasoning'
  | 'framework-architecture'
  | 'prd-generation';

export interface AgentProgress {
  agent: AgentName;
  status: 'pending' | 'processing' | 'completed' | 'error';
  startTime?: string;
  endTime?: string;
  error?: string;
}
