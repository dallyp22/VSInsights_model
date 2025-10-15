// API Route: Execute the 4-agent pipeline

import { NextRequest, NextResponse } from 'next/server';
import { runAgentPipeline } from '@/lib/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'sessionId is required and must be a string' },
        { status: 400 }
      );
    }
    
    // Run the agent pipeline
    const result = await runAgentPipeline(sessionId);
    
    return NextResponse.json({
      success: true,
      session: result,
    });
    
  } catch (error) {
    console.error('Error processing session:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Support longer execution time for agent processing
export const maxDuration = 300; // 5 minutes

