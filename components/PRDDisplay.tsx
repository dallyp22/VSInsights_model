'use client';

import { useState } from 'react';
import { PRDOutput } from '@/types/agents';

interface PRDDisplayProps {
  prd: PRDOutput;
  frameworkName: string;
}

export default function PRDDisplay({ prd, frameworkName }: PRDDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['executive', 'roadmap', 'metrics']) // Key sections expanded by default
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
  
  return (
    <div className="results-page mt-12">
      {/* PRD Header */}
      <header className="results-header">
        <h1 className="results-title">Product Requirements Document</h1>
        <p className="results-subtitle">
          Comprehensive specification for: {frameworkName}
        </p>
      </header>

      <div className="results-container">
        {/* Executive Summary */}
        <div className={`section-card ${expandedSections.has('executive') ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('executive')}>
            <div className="section-title-group">
              <div className="section-icon">
                <span className="text-xl">📋</span>
              </div>
              <h2 className="section-title">Executive Summary</h2>
            </div>
            <div className="expand-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 8 10 12 14 8"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="section-content">
            <div className="section-body">
              <p className="content-text">{prd.executiveSummary}</p>
              
              <div className="content-group">
                <h3 className="subsection-heading">Problem Context</h3>
                <p className="content-text">{prd.problemContext}</p>
              </div>

              <div className="content-group">
                <h3 className="subsection-heading">Product Vision</h3>
                <p className="content-text">{prd.productVision}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Users */}
        <div className={`section-card ${expandedSections.has('users') ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('users')}>
            <div className="section-title-group">
              <div className="section-icon">
                <span className="text-xl">👥</span>
              </div>
              <h2 className="section-title">Target Users</h2>
            </div>
            <div className="expand-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 8 10 12 14 8"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="section-content">
            <div className="section-body">
              <div className="framework-grid">
                {prd.targetUsers.map((user, idx) => (
                  <div key={idx} className="framework-card">
                    <div className="framework-name">{user.persona}</div>
                    
                    <div className="content-group">
                      <h4 className="subsection-heading" style={{ fontSize: '0.7rem' }}>Needs</h4>
                      <ul className="content-list">
                        {user.needs.map((need, i) => (
                          <li key={i}>{need}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="content-group">
                      <h4 className="subsection-heading" style={{ fontSize: '0.7rem' }}>Pain Points</h4>
                      <ul className="content-list">
                        {user.painPoints.map((pain, i) => (
                          <li key={i}>{pain}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Functional Requirements */}
        <div className={`section-card ${expandedSections.has('requirements') ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('requirements')}>
            <div className="section-title-group">
              <div className="section-icon">
                <span className="text-xl">⚙️</span>
              </div>
              <h2 className="section-title">Functional Requirements</h2>
            </div>
            <div className="expand-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 8 10 12 14 8"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="section-content">
            <div className="section-body">
              {/* Group by category */}
              {Array.from(new Set(prd.functionalRequirements.map((r) => r.category))).map((category) => (
                <div key={category} className="content-group">
                  <h3 className="subsection-heading">{category}</h3>
                  <div className="priority-list">
                    {prd.functionalRequirements
                      .filter((r) => r.category === category)
                      .map((req) => (
                        <div key={req.id} className="priority-item">
                          <div className="priority-header">
                            {req.id}: {req.requirement}
                          </div>
                          <div className="priority-dependencies">
                            Priority: {req.priority}
                          </div>
                          {req.acceptanceCriteria.length > 0 && (
                            <ul className="content-list" style={{ marginTop: '0.5rem' }}>
                              {req.acceptanceCriteria.map((criteria, i) => (
                                <li key={i}>{criteria}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className={`section-card ${expandedSections.has('architecture') ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('architecture')}>
            <div className="section-title-group">
              <div className="section-icon">
                <span className="text-xl">🏗️</span>
              </div>
              <h2 className="section-title">Technical Architecture</h2>
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
                <h3 className="subsection-heading">System Overview</h3>
                <p className="content-text">{prd.technicalArchitecture.systemOverview}</p>
              </div>

              <div className="content-group">
                <h3 className="subsection-heading">Components</h3>
                <div className="priority-list">
                  {prd.technicalArchitecture.components.map((comp, idx) => (
                    <div key={idx} className="priority-item">
                      <div className="priority-header">{comp.name}</div>
                      <p className="content-text" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {comp.purpose}
                      </p>
                      <div className="framework-meta">
                        <div className="meta-item">
                          <div className="meta-label">Technologies</div>
                          <div className="meta-value">{comp.technologies.join(', ')}</div>
                        </div>
                        <div className="meta-item">
                          <div className="meta-label">Interfaces</div>
                          <div className="meta-value">{comp.interfaces.join(', ')}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-group">
                <h3 className="subsection-heading">Data Model</h3>
                <p className="content-text">{prd.technicalArchitecture.dataModel}</p>
              </div>

              {prd.technicalArchitecture.integrations.length > 0 && (
                <div className="content-group">
                  <h3 className="subsection-heading">Integrations</h3>
                  <div className="component-grid">
                    {prd.technicalArchitecture.integrations.map((int, idx) => (
                      <div key={idx} className="component-item">
                        {int.system} - {int.method}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="split-content">
                <div className="split-column">
                  <div className="split-column-title">Security Considerations</div>
                  <ul className="content-list">
                    {prd.technicalArchitecture.securityConsiderations.map((sec, idx) => (
                      <li key={idx}>{sec}</li>
                    ))}
                  </ul>
                </div>
                <div className="split-column">
                  <div className="split-column-title">Scalability Strategy</div>
                  <p className="content-text">{prd.technicalArchitecture.scalabilityStrategy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Stories */}
        <div className={`section-card ${expandedSections.has('stories') ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('stories')}>
            <div className="section-title-group">
              <div className="section-icon">
                <span className="text-xl">📖</span>
              </div>
              <h2 className="section-title">User Stories</h2>
            </div>
            <div className="expand-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 8 10 12 14 8"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="section-content">
            <div className="section-body">
              <ol className="numbered-list">
                {prd.userStories.map((story) => (
                  <li key={story.id}>
                    <strong>{story.id}:</strong> As a <em>{story.as}</em>, I want <em>{story.iWant}</em>, so that <em>{story.soThat}</em>
                    {story.acceptanceCriteria.length > 0 && (
                      <ul className="content-list" style={{ marginTop: '0.5rem' }}>
                        {story.acceptanceCriteria.map((criteria, i) => (
                          <li key={i}>{criteria}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Implementation Roadmap */}
        <div className={`section-card ${expandedSections.has('roadmap') ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('roadmap')}>
            <div className="section-title-group">
              <div className="section-icon">
                <span className="text-xl">🗺️</span>
              </div>
              <h2 className="section-title">Implementation Roadmap</h2>
            </div>
            <div className="expand-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 8 10 12 14 8"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="section-content">
            <div className="section-body">
              {prd.implementationRoadmap.map((phase, idx) => (
                <div key={idx} className="content-group">
                  <h3 className="subsection-heading">
                    {phase.phase} ({phase.duration})
                  </h3>
                  
                  <div className="priority-item">
                    <div className="priority-header">Objectives</div>
                    <ul className="content-list">
                      {phase.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="priority-item">
                    <div className="priority-header">Deliverables</div>
                    <ul className="content-list">
                      {phase.deliverables.map((del, i) => (
                        <li key={i}>{del}</li>
                      ))}
                    </ul>
                  </div>

                  {phase.dependencies.length > 0 && (
                    <div className="priority-dependencies">
                      Dependencies: {phase.dependencies.join(', ')}
                    </div>
                  )}

                  {phase.risks.length > 0 && (
                    <div className="priority-item">
                      <div className="priority-header">Risks</div>
                      <ul className="content-list">
                        {phase.risks.map((risk, i) => (
                          <li key={i}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className={`section-card ${expandedSections.has('metrics') ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('metrics')}>
            <div className="section-title-group">
              <div className="section-icon">
                <span className="text-xl">📊</span>
              </div>
              <h2 className="section-title">Success Metrics</h2>
            </div>
            <div className="expand-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 8 10 12 14 8"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="section-content">
            <div className="section-body">
              <div className="priority-list">
                {prd.successMetrics.map((metric, idx) => (
                  <div key={idx} className="priority-item">
                    <div className="priority-header">{metric.metric}</div>
                    <div className="framework-meta">
                      <div className="meta-item">
                        <div className="meta-label">Target</div>
                        <div className="meta-value">{metric.target}</div>
                      </div>
                      <div className="meta-item">
                        <div className="meta-label">Measurement</div>
                        <div className="meta-value">{metric.measurement}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Risks and Mitigation */}
        <div className={`section-card ${expandedSections.has('risks') ? 'expanded' : ''}`}>
          <div className="section-header" onClick={() => toggleSection('risks')}>
            <div className="section-title-group">
              <div className="section-icon">
                <span className="text-xl">⚠️</span>
              </div>
              <h2 className="section-title">Risks & Mitigation</h2>
            </div>
            <div className="expand-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 8 10 12 14 8"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="section-content">
            <div className="section-body">
              <div className="priority-list">
                {prd.risksAndMitigation.map((risk, idx) => (
                  <div key={idx} className="priority-item">
                    <div className="priority-header">{risk.risk}</div>
                    <div className="framework-meta">
                      <div className="meta-item">
                        <div className="meta-label">Impact</div>
                        <div className="meta-value">{risk.impact}</div>
                      </div>
                      <div className="meta-item">
                        <div className="meta-label">Probability</div>
                        <div className="meta-value">{risk.probability}</div>
                      </div>
                    </div>
                    <p className="content-text" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Open Questions */}
        {prd.openQuestions.length > 0 && (
          <div className={`section-card ${expandedSections.has('questions') ? 'expanded' : ''}`}>
            <div className="section-header" onClick={() => toggleSection('questions')}>
              <div className="section-title-group">
                <div className="section-icon">
                  <span className="text-xl">❓</span>
                </div>
                <h2 className="section-title">Open Questions</h2>
              </div>
              <div className="expand-indicator">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 8 10 12 14 8"></polyline>
                </svg>
              </div>
            </div>
            
            <div className="section-content">
              <div className="section-body">
                <ul className="content-list">
                  {prd.openQuestions.map((question, idx) => (
                    <li key={idx}>{question}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

