// API Route: Generate comprehensive PRD for selected framework

import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSession } from '@/lib/orchestrator';
import { runPRDGenerationAgent } from '@/lib/agents/agent-6-prd';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, selectedFramework } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'sessionId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!selectedFramework || typeof selectedFramework !== 'string') {
      return NextResponse.json(
        { error: 'selectedFramework is required and must be a string' },
        { status: 400 }
      );
    }

    const session = getSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (
      !session.contextOutput ||
      !session.decompositionOutput ||
      !session.firstPrinciplesOutput ||
      !session.frameworkOutput
    ) {
      return NextResponse.json(
        { error: 'Session must be completed before generating PRD' },
        { status: 400 }
      );
    }

    // Update session with selected framework
    updateSession(sessionId, {
      selectedFramework,
      status: 'processing',
      currentAgent: 'prd-generation',
    });

    // Generate PRD using Agent 6
    const prdOutput = await runPRDGenerationAgent(
      session.contextOutput,
      session.decompositionOutput,
      session.firstPrinciplesOutput,
      session.frameworkOutput,
      selectedFramework
    );

    // Update session with PRD
    updateSession(sessionId, {
      prdOutput,
      status: 'completed',
      currentAgent: undefined,
      completedAt: new Date().toISOString(),
    });

    const updatedSession = getSession(sessionId);

    return NextResponse.json({
      success: true,
      session: updatedSession,
    });
  } catch (error) {
    console.error('Error generating PRD:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PRD',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Support longer execution time for PRD generation
export const maxDuration = 300; // 5 minutes

