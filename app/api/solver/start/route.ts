// API Route: Initialize new problem-solving session

import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/orchestrator';
import { ProblemInput } from '@/types/agents';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput } = body;
    
    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: 'userInput is required and must be a string' },
        { status: 400 }
      );
    }
    
    const problemInput: ProblemInput = {
      userInput,
      timestamp: new Date().toISOString(),
      userId: 'demo-user', // In production, would use actual user ID
    };
    
    const session = createSession(problemInput);
    
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      session,
    });
    
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

