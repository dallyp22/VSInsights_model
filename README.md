# VS Insights Problem Solver - Proof of Concept

A multi-agent AI system that applies Munger-style reasoning to complex business problems.

## 🎯 Overview

This PoC demonstrates a 5-agent pipeline that transforms vague business problems into development-ready specifications:

1. **Agent 0: Context Extraction** (Claude Sonnet 4.5) - Extracts structured context from raw input
2. **Agent 1: Problem Decomposition** (Claude Sonnet 4.5) - Breaks problems into atomic components
3. **Agent 3: First Principles / Munger Reasoning** (Claude Opus 4) - Applies deep philosophical reasoning
4. **Agent 5: Framework Architecture** (Claude Sonnet 4.5) - Designs solution frameworks
5. **Agent 6: PRD Generation** (Claude Opus 4) - Creates comprehensive Product Requirements Document

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **AI Models**: 
  - Claude Sonnet 4.5 (Anthropic)
  - Claude Opus 4 (Anthropic)
  - GPT-4o (OpenAI) - configured for future use
  - Gemini 2.0 Flash (Google) - configured for future use
- **State Management**: In-memory (no database for PoC)
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- API keys for Anthropic, OpenAI, and Google (already configured in `.env.local`)

### Installation

```bash
# Navigate to project directory
cd /Users/dallas/VSInsights/vs-insights-poc

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:3000

## 📝 How to Use

1. **Enter a Problem**: Type or select an example problem in the text area
2. **Watch the Pipeline**: See each agent process sequentially with visual progress (~60-100 seconds)
3. **Review Results**: Explore collapsible sections showing each agent's output
4. **Key Insight**: Pay special attention to the "First Principles / Munger Reasoning" section to see the deep philosophical analysis
5. **Select Framework**: Click "Generate PRD" on your preferred framework option
6. **Get Development Spec**: Wait 60-90 seconds for comprehensive PRD generation
7. **Review PRD**: Explore all 10 sections with complete specifications for your development team

### Example Problems

Try these examples to see the system in action:

- "How do I scale a SaaS business from $1M to $10M ARR while maintaining product quality?"
- "Design a supply chain optimization system for a manufacturing company with 50+ global suppliers"
- "Build a content strategy that drives organic growth without relying on paid advertising"

## 🧠 Agent Details

### Agent 0: Context Extraction
- **Model**: Claude Sonnet 4.5
- **Purpose**: Transform raw input into structured problem brief
- **Output**: Problem statement, domain classification, complexity tier, constraints, success criteria

### Agent 1: Problem Decomposition
- **Model**: Claude Sonnet 4.5
- **Purpose**: Hierarchical deconstruction into atomic components
- **Output**: Root cause, primary/secondary components, dependencies, critical path

### Agent 3: First Principles / Munger Reasoning
- **Model**: Claude Opus 4 (most powerful reasoning model)
- **Purpose**: Deep philosophical analysis using Charlie Munger's mental models
- **Features**:
  - Fundamental truths identification
  - Core constraints analysis (physical, economic, behavioral, systemic)
  - Inversion thinking (what would guarantee failure?)
  - Second-order effects analysis
  - Munger's latticework of mental models
- **Output**: Comprehensive reasoning chain with actionable insights

### Agent 5: Framework Architecture
- **Model**: Claude Sonnet 4.5
- **Purpose**: Design adaptive solution frameworks
- **Output**: 2-3 framework options with architecture, implementation assessment, and tradeoffs

### Agent 6: PRD Generation
- **Model**: Claude Opus 4 (most powerful for comprehensive documentation)
- **Purpose**: Transform selected framework into development-ready PRD
- **Features**:
  - Executive summary and product vision
  - Target user personas (3-5)
  - Functional requirements (15-30) with acceptance criteria
  - Technical architecture with component specifications
  - User stories (10-15) for agile sprints
  - Implementation roadmap (3-4 phases)
  - Success metrics and KPIs
  - Risk register with mitigations
  - Open questions for stakeholder input
- **Output**: Comprehensive PRD ready for development team handoff

## 🔑 API Configuration

API keys are already configured in `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...
GOOGLE_API_KEY=AIzaSyDbs6W8N46xq6wlwdtlNSqas-bIElQaLYg
```

## 📁 Project Structure

```
vs-insights-poc/
├── app/
│   ├── api/
│   │   └── solver/
│   │       ├── start/route.ts          # Create session
│   │       ├── process/route.ts        # Run agent pipeline
│   │       └── session/[id]/route.ts   # Get session results
│   ├── layout.tsx
│   ├── page.tsx                        # Main UI
│   └── globals.css
├── components/
│   ├── ProblemInput.tsx               # Input form
│   ├── AgentPipeline.tsx              # Progress visualization
│   └── AgentOutput.tsx                # Results display
├── lib/
│   ├── api-clients.ts                 # AI model clients
│   ├── orchestrator.ts                # Agent pipeline coordinator
│   └── agents/
│       ├── agent-0-context.ts
│       ├── agent-1-decomposition.ts
│       ├── agent-3-first-principles.ts
│       └── agent-5-framework.ts
├── types/
│   └── agents.ts                      # TypeScript interfaces
└── .env.local                         # API keys
```

## 🎨 Features

### Visual Progress Tracking
- Real-time agent status indicators
- Animated processing states
- Clear completion checkmarks

### Collapsible Results
- Each agent output in separate sections
- Expand/collapse for focused review
- Color-coded by agent type

### Munger Reasoning Highlight
- Special purple border for First Principles section
- Detailed breakdown of mental models applied
- Inversion analysis with failure scenarios

### Framework Comparison
- Side-by-side framework options
- VS Insights fit scoring (1-10)
- Implementation complexity assessment

## 🧪 Testing

To test the complete system:

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Try the first example problem about SaaS scaling
4. Wait ~30-60 seconds for all agents to complete
5. Expand the "First Principles / Munger Reasoning" section
6. Verify you see:
   - Fundamental truths
   - Munger principles (latticework models, mental models, inverse thinking)
   - Inversion analysis
   - Key insights

## 🚧 Known Limitations (PoC)

- No database (sessions stored in memory, lost on restart)
- No authentication or user management
- No Pinecone vector store integration
- No visual diagram generation
- Simplified error handling
- Single-user experience
- No session persistence

## 🔮 Future Enhancements (Full Version)

- Add remaining agents (Research, Mental Model Selection, Tool Mapping, Visual Generation, Scope of Work, Feedback Loop)
- PostgreSQL database for session persistence
- Pinecone integration for VS Insights knowledge base
- User authentication
- Real-time streaming updates
- Visual workflow generation (Mermaid diagrams)
- PDF export of results
- Analytics dashboard
- Multi-user support

## 📊 Success Criteria

✅ User enters problem description  
✅ All 4 agents execute sequentially  
✅ Munger reasoning visible in Agent 3 output  
✅ Framework options generated by Agent 5  
✅ Clean UI showing agent progress and outputs  
✅ Complete end-to-end demo in <5 minutes  

## 🤝 Contributing

This is a proof-of-concept for VS Insights. For questions or feedback, contact the VS Insights team.

## 📄 License

Proprietary - VS Insights
