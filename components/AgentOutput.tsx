'use client';

import { useState } from 'react';
import { SessionState } from '@/types/agents';
import PRDDisplay from './PRDDisplay';

interface AgentOutputProps {
  session: SessionState;
  onSelectFramework?: (frameworkName: string) => void;
  isGeneratingPRD?: boolean;
}

export default function AgentOutput({ session, onSelectFramework, isGeneratingPRD }: AgentOutputProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['context']) // Only first section expanded by default
  );
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };
  
  if (session.status !== 'completed') {
    return null;
  }

  // If PRD is generated, show PRD display instead
  if (session.prdOutput && session.selectedFramework) {
    return (
      <PRDDisplay 
        prd={session.prdOutput} 
        frameworkName={session.selectedFramework}
      />
    );
  }
  
  return (
    <div className="results-page">
      {/* Results Header */}
      <header className="results-header">
        <h1 className="results-title">Results</h1>
        <p className="results-subtitle">
          Multi-agent analysis complete — review each section below
        </p>
      </header>

      {/* Results Container */}
      <div className="results-container">
        
        {/* Section 1: Context Extraction */}
        {session.contextOutput && (
          <div className={`section-card ${expandedSections.has('context') ? 'expanded' : ''}`}>
            <div className="section-header" onClick={() => toggleSection('context')}>
              <div className="section-title-group">
                <div className="section-icon">
                  <span className="text-xl">🔍</span>
                </div>
                <h2 className="section-title">Context Extraction</h2>
              </div>
              <div className="expand-indicator">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 8 10 12 14 8"></polyline>
                </svg>
              </div>
            </div>
            
            <div className="section-content">
              <div className="section-body">
                <div className="content-group">
                  <h3 className="subsection-heading">Problem Statement</h3>
                  <p className="content-text">{session.contextOutput.problemStatement}</p>
                </div>

                <div className="content-group">
                  <h3 className="subsection-heading">Domain</h3>
                  <div className="component-grid">
                    {session.contextOutput.domain.map((d, idx) => (
                      <div key={idx} className="component-item">{d}</div>
                    ))}
                  </div>
                </div>

                <div className="content-group">
                  <h3 className="subsection-heading">Complexity Tier</h3>
                  <div className="component-item" style={{ textTransform: 'capitalize' }}>
                    {session.contextOutput.complexityTier}
                  </div>
                </div>

                <div className="content-group">
                  <h3 className="subsection-heading">Success Criteria</h3>
                  <ul className="content-list">
                    {session.contextOutput.successCriteria.map((criteria, idx) => (
                      <li key={idx}>{criteria}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Problem Decomposition */}
        {session.decompositionOutput && (
          <div className={`section-card ${expandedSections.has('decomposition') ? 'expanded' : ''}`}>
            <div className="section-header" onClick={() => toggleSection('decomposition')}>
              <div className="section-title-group">
                <div className="section-icon">
                  <span className="text-xl">🔬</span>
                </div>
                <h2 className="section-title">Problem Decomposition</h2>
              </div>
              <div className="expand-indicator">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 8 10 12 14 8"></polyline>
                </svg>
              </div>
            </div>
            
            <div className="section-content">
              <div className="section-body">
                <div className="content-group">
                  <h3 className="subsection-heading">Root Cause</h3>
                  <p className="content-text">{session.decompositionOutput.rootCause}</p>
                </div>

                <div className="content-group">
                  <h3 className="subsection-heading">Primary Components</h3>
                  <div className="priority-list">
                    {session.decompositionOutput.components.primary.map((comp, idx) => (
                      <div key={idx} className="priority-item">
                        <div className="priority-header">
                          Priority {comp.priority}: {comp.description}
                        </div>
                        {comp.dependencies.length > 0 && (
                          <div className="priority-dependencies">
                            Dependencies: {comp.dependencies.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="content-group">
                  <h3 className="subsection-heading">Critical Path</h3>
                  <p className="content-text" style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'rgba(205, 171, 117, 0.8)' }}>
                    {session.decompositionOutput.criticalPath.join(' → ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: First Principles / Munger Reasoning */}
        {session.firstPrinciplesOutput && (
          <div className={`section-card ${expandedSections.has('munger') ? 'expanded' : ''}`}>
            <div className="section-header" onClick={() => toggleSection('munger')}>
              <div className="section-title-group">
                <div className="section-icon">
                  <span className="text-xl">🧠</span>
                </div>
                <h2 className="section-title">First Principles / Munger Reasoning</h2>
              </div>
              <div className="expand-indicator">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 8 10 12 14 8"></polyline>
                </svg>
              </div>
            </div>
            
            <div className="section-content">
              <div className="section-body">
                <div className="content-group">
                  <h3 className="subsection-heading">Fundamental Truths</h3>
                  <ul className="content-list">
                    {session.firstPrinciplesOutput.fundamentalTruths.map((truth, idx) => (
                      <li key={idx}>{truth}</li>
                    ))}
                  </ul>
                </div>

                <div className="key-insights">
                  <div className="key-insights-title">Munger Principles Applied</div>
                  
                  <div className="content-group">
                    <p className="content-text" style={{ marginBottom: '1rem' }}>
                      <strong>Latticework Models</strong>
                    </p>
                    <p className="content-text" style={{ fontSize: '0.9rem' }}>
                      {session.firstPrinciplesOutput.mungerPrinciples.latticeworkModels.join('. ')}
                    </p>
                  </div>

                  <div className="content-group">
                    <p className="content-text" style={{ marginBottom: '1rem' }}>
                      <strong>Mental Models</strong>
                    </p>
                    <p className="content-text" style={{ fontSize: '0.9rem' }}>
                      {session.firstPrinciplesOutput.mungerPrinciples.mentalModelsApplied.join('. ')}
                    </p>
                  </div>

                  <div className="content-group">
                    <p className="content-text" style={{ marginBottom: '1rem' }}>
                      <strong>Inverse Thinking</strong>
                    </p>
                    <ul className="content-list">
                      {session.firstPrinciplesOutput.mungerPrinciples.inverseThinking.map((inv, idx) => (
                        <li key={idx}>{inv}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="content-group">
                  <h3 className="subsection-heading">Inversion Analysis</h3>
                  <div className="split-content">
                    <div className="split-column failure">
                      <div className="split-column-title">⚠️ Failure Scenarios</div>
                      <ul className="content-list">
                        {session.firstPrinciplesOutput.inversionAnalysis.failureScenarios.map((scenario, idx) => (
                          <li key={idx}>{scenario}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="split-column prevention">
                      <div className="split-column-title">✓ Prevention Strategies</div>
                      <ul className="content-list">
                        {session.firstPrinciplesOutput.inversionAnalysis.preventionStrategies.map((strategy, idx) => (
                          <li key={idx}>{strategy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="content-group">
                  <h3 className="subsection-heading">Key Insights</h3>
                  <ol className="numbered-list">
                    {session.firstPrinciplesOutput.keyInsights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Framework Architecture */}
        {session.frameworkOutput && (
          <div className={`section-card ${expandedSections.has('framework') ? 'expanded' : ''}`}>
            <div className="section-header" onClick={() => toggleSection('framework')}>
              <div className="section-title-group">
                <div className="section-icon">
                  <span className="text-xl">🏗️</span>
                </div>
                <h2 className="section-title">Framework Architecture</h2>
              </div>
              <div className="expand-indicator">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 8 10 12 14 8"></polyline>
                </svg>
              </div>
            </div>
            
            <div className="section-content">
              <div className="section-body">
                <div className="content-group">
                  <h3 className="subsection-heading">⭐ Recommended Framework</h3>
                  <p className="content-text" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#CDAB75' }}>
                    {session.frameworkOutput.recommendedFramework}
                  </p>
                  <p className="content-text">
                    {session.frameworkOutput.reasoning}
                  </p>
                </div>

                <div className="key-insights" style={{ background: 'rgba(205, 171, 117, 0.08)', padding: '1.5rem', marginBottom: '2rem' }}>
                  <div className="content-text" style={{ fontSize: '0.95rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>
                    <strong>Select a framework below to generate a comprehensive PRD ready for development handoff</strong>
                  </div>
                </div>

                <div className="framework-grid">
                  {session.frameworkOutput.frameworkOptions.map((option, idx) => (
                    <div 
                      key={idx} 
                      className={`framework-card ${option.name === session.frameworkOutput?.recommendedFramework ? 'recommended' : ''}`}
                    >
                      <div className="framework-name">{option.name}</div>
                      <span className="framework-type">{option.approach}</span>
                      
                      <p className="framework-description">{option.tradeoffs}</p>
                      
                      <div className="content-group">
                        <h4 className="subsection-heading" style={{ fontSize: '0.7rem' }}>Components</h4>
                        <div className="component-grid">
                          {option.architecture.components.slice(0, 6).map((comp, i) => (
                            <div key={i} className="component-item">{comp}</div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="framework-meta">
                        <div className="meta-item">
                          <div className="meta-label">Speed</div>
                          <div className="meta-value">{option.implementation.speed}</div>
                        </div>
                        <div className="meta-item">
                          <div className="meta-label">Complexity</div>
                          <div className="meta-value">{option.implementation.complexity}</div>
                        </div>
                        <div className="meta-item">
                          <div className="meta-label">Cost</div>
                          <div className="meta-value">{option.implementation.cost}</div>
                        </div>
                        <div className="meta-item">
                          <div className="meta-label">Scalability</div>
                          <div className="meta-value">{option.implementation.scalability}</div>
                        </div>
                      </div>
                      
                      <div className="vs-fit-badge">
                        <span className="fit-score">{option.vsInsightsFit}/10</span>
                        <span className="fit-label">VS Fit</span>
                      </div>

                      {/* Select Framework Button */}
                      <button
                        onClick={() => onSelectFramework?.(option.name)}
                        disabled={isGeneratingPRD}
                        className="solve-button w-full mt-4"
                        style={{ fontSize: '0.85rem', padding: '0.85rem 1.5rem' }}
                      >
                        {isGeneratingPRD ? (
                          <>
                            <span className="flex gap-1">
                              <span className="dot"></span>
                              <span className="dot"></span>
                              <span className="dot"></span>
                            </span>
                            Generating PRD
                          </>
                        ) : (
                          <>
                            Generate PRD
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="12" y1="18" x2="12" y2="12"></line>
                              <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
