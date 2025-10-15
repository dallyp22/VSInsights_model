'use client';

import { useState, useEffect, useRef } from 'react';

interface ProblemInputProps {
  onSubmit: (problem: string) => void;
  isProcessing: boolean;
}

const EXAMPLE_PROBLEMS = [
  "How do I scale a SaaS business from $1M to $10M ARR while maintaining product quality?",
  "Design a supply chain optimization system for a manufacturing company with 50+ global suppliers",
  "Build a content strategy that drives organic growth without relying on paid advertising",
];

export default function ProblemInput({ onSubmit, isProcessing }: ProblemInputProps) {
  const [problem, setProblem] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim()) {
      onSubmit(problem.trim());
    }
  };
  
  const loadExample = (example: string) => {
    setProblem(example);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };
  
  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [problem]);
  
  return (
    <div className="w-full animate-fadeInUp">
      <div className="card p-8 golden-glow mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="hero-title mb-3">VS INSIGHTS</h1>
          <p className="hero-tagline">Problem Solver</p>
          <p className="text-[rgba(205,171,117,0.7)] text-sm mt-4">
            Powered by multi-agent AI with Munger-style reasoning
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Problem Input */}
          <div className="problem-input-container">
            <label htmlFor="problem" className="problem-label">
              Describe Your Problem or Challenge
            </label>
            <textarea
              id="problem"
              ref={textareaRef}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Enter a complex business problem, strategic challenge, or system design question..."
              className="problem-textarea"
              disabled={isProcessing}
              maxLength={2000}
            />
            <span className="char-counter">
              {problem.length} / 2000
            </span>
          </div>
          
          {/* Examples Section */}
          <div className="examples-section">
            <p className="examples-label">Try an Example:</p>
            <div className="example-list">
              {EXAMPLE_PROBLEMS.map((example, idx) => (
                <div
                  key={idx}
                  onClick={() => !isProcessing && loadExample(example)}
                  className={`example-card ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="example-number">{idx + 1}.</span>
                  {example}
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isProcessing || !problem.trim()}
              className="solve-button"
            >
              {isProcessing ? (
                <>
                  <span className="flex gap-1">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                  Processing
                </>
              ) : (
                <>
                  Solve Problem
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
