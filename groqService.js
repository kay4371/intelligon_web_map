// groqService.js - Enhanced Professional AI Integration using Groq API
const axios = require('axios');

class GroqService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY;
    this.baseURL = 'https://api.groq.com/openai/v1';
    // Professional model selection based on task complexity
    this.models = {
      standard: 'llama-3.1-8b-instant',
      enhanced: 'llama-3.1-70b-versatile',
      professional: 'mixtral-8x7b-32768'
    };
    this.defaultModel = this.models.standard;
  }

  // ===== EXISTING METHODS (Enhanced) =====

  /**
   * Analyze security incidents and generate insights - ENHANCED
   */
  async analyzeIncidents(incidents) {
    const prompt = `You are a senior security intelligence analyst at Suntrenia Intelligence Unit.
    
    Analyze these Nigerian security incidents and provide PROFESSIONAL ANALYSIS:

    INCIDENTS (${incidents.length} total):
    ${incidents.map((item, i) => `${i + 1}. [${item.source || 'Unknown'}] ${item.title} - ${item.summary.substring(0, 200)}`).join('\n')}

    Provide STRUCTURED PROFESSIONAL ANALYSIS with:
    
    1. EXECUTIVE SUMMARY (BLUF Format - Bottom Line Up Front)
       - Key finding in one sentence
       - Immediate implications
    
    2. SITUATION ASSESSMENT
       - Overall Threat Level (Critical/High/Medium/Low)
       - Key Incident Clusters
       - Geographic Spread Analysis
       - Temporal Patterns
    
    3. THREAT ANALYSIS
       - Primary Threat Actors
       - Tactics, Techniques, and Procedures (TTPs)
       - Target Selection Patterns
       - Capability Assessment
    
    4. RISK ASSESSMENT
       - High-Risk Areas
       - Vulnerable Populations/Assets
       - Escalation Potential
       - Confidence Level (High/Medium/Low)
    
    5. RECOMMENDATIONS
       - Immediate Actions (Next 24 hours)
       - Short-term Measures (Next 7 days)
       - Long-term Strategies (Next 30 days)
    
    Format for professional security brief.`;

    return await this.callGroq(prompt, { 
      model: this.models.professional,
      max_tokens: 2500,
      temperature: 0.2 
    });
  }

  /**
   * Enhanced incident classification with professional context
   */
  async classifyIncident(title, summary) {
    const prompt = `As a professional security analyst, classify this Nigerian security incident:

    TITLE: ${title}
    SUMMARY: ${summary}

    Respond in STRICT JSON format only:
    {
      "category": "Kidnapping|Banditry|Terrorism|Herder-Farmer Conflict|Cult Violence|Armed Robbery|Political Violence|Communal Clash|Pipeline Vandalism|Maritime Piracy|Cyber Attack|Other",
      "subcategory": "specific type or variation",
      "severity": "Critical|High|Medium|Low",
      "confidence": "High|Medium|Low",
      "casualties": {
        "deaths": "number or 'unknown'",
        "injuries": "number or 'unknown'", 
        "abducted": "number or 'unknown'",
        "displaced": "number or 'unknown'"
      },
      "perpetrators": {
        "primary": "identified group or 'unknown'",
        "affiliation": "terrorist group, criminal network, militia, etc",
        "tactics": "description of methods used"
      },
      "locations": {
        "primary": "specific location mentioned",
        "secondary": ["additional locations"],
        "coordinates": "if mentioned or inferred"
      },
      "timing": {
        "date": "extracted date or 'unknown'",
        "time": "extracted time or 'unknown'",
        "duration": "duration of incident if mentioned"
      },
      "assets_affected": {
        "civilian": true/false,
        "military": true/false,
        "infrastructure": true/false,
        "economic": true/false
      },
      "extracted_facts": ["fact 1", "fact 2", "fact 3"],
      "verification_status": "Confirmed|Likely|Unverified",
      "threat_indicators": ["indicator 1", "indicator 2"],
      "recommended_response": "immediate recommended action"
    }

    Extract ALL available information. If information is not available, use "unknown".`;

    const response = await this.callGroq(prompt, { 
      temperature: 0.1,
      max_tokens: 1500
    });
    
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Add metadata
        return {
          ...parsed,
          metadata: {
            classificationTime: new Date().toISOString(),
            modelUsed: this.defaultModel,
            confidence: parsed.confidence || 'Medium',
            requiresVerification: parsed.verification_status === 'Unverified'
          }
        };
      }
      
      // Fallback structured response
      return {
        category: 'Other',
        subcategory: 'Unclassified',
        severity: 'Medium',
        confidence: 'Low',
        casualties: { deaths: 0, injuries: 0, abducted: 0, displaced: 0 },
        perpetrators: { primary: 'Unknown', affiliation: 'Unknown', tactics: 'Unknown' },
        locations: { primary: 'Unknown', secondary: [], coordinates: 'Unknown' },
        timing: { date: 'Unknown', time: 'Unknown', duration: 'Unknown' },
        assets_affected: { civilian: true, military: false, infrastructure: false, economic: false },
        extracted_facts: [title.substring(0, 100)],
        verification_status: 'Unverified',
        threat_indicators: [],
        recommended_response: 'Monitor situation',
        metadata: {
          classificationTime: new Date().toISOString(),
          modelUsed: this.defaultModel,
          confidence: 'Low',
          fallback: true
        }
      };
      
    } catch (error) {
      console.error('❌ JSON parse error in classifyIncident:', error.message);
      
      // Robust fallback
      return {
        category: 'Other',
        severity: 'Medium',
        confidence: 'Low',
        casualties: { deaths: 0, injuries: 0, abducted: 0, displaced: 0 },
        perpetrators: 'Unknown',
        locations: [],
        metadata: {
          classificationTime: new Date().toISOString(),
          modelUsed: this.defaultModel,
          error: error.message,
          fallback: true
        }
      };
    }
  }

  /**
   * Generate professional weekly executive briefing - ENHANCED
   */
  async generateWeeklyBriefing(stats, incidents, affectedStates) {
    const prompt = `You are the Chief Intelligence Officer preparing a briefing for senior stakeholders.

    SECURITY SITUATION REPORT - NIGERIA
    Reporting Period: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    
    KEY METRICS:
    - Total Incidents: ${stats.incidents || incidents.length}
    - States Affected: ${affectedStates.length}
    - Estimated Casualties: ${stats.fatalities || 'Unknown'}
    - Confirmed Abductions: ${stats.abducted || 'Unknown'}
    - High-Risk Regions: ${stats.highRiskRegions || 'To be determined'}
    
    TOP INCIDENTS (Priority Order):
    ${incidents.slice(0, 15).map((item, i) => `${i + 1}. [${item.severity || 'Unknown'}] ${item.title} (${item.source || 'Unknown'})`).join('\n')}
    
    AFFECTED STATES: ${affectedStates.join(', ')}
    
    Create a PROFESSIONAL EXECUTIVE BRIEFING with:
    
    [CLASSIFICATION: RESTRICTED]
    
    1. SITUATION OVERVIEW
       - Current Threat Environment
       - Key Developments This Week
       - Significant Changes from Previous Week
    
    2. THREAT ASSESSMENT
       - Primary Threat Actors & Activities
       - Geographic Hotspots
       - Tactical Trends & Patterns
       - Escalation Indicators
    
    3. IMPACT ANALYSIS
       For EXPATRIATES:
       - Safety Zones vs Risk Areas
       - Travel Advisory Updates
       - Emergency Procedures Reminder
    
       For CORPORATE ENTITIES:
       - Business Continuity Risks
       - Supply Chain Vulnerabilities
       - Asset Protection Status
    
       For SECURITY PROFESSIONALS:
       - Operational Challenges
       - Intelligence Gaps
       - Resource Requirements
    
    4. PREDICTIVE OUTLOOK (Next 7-14 Days)
       - High-Probability Scenarios
       - Trigger Events to Monitor
       - Risk Projections by Region
    
    5. RECOMMENDATIONS & ACTIONS
       - IMMEDIATE (Next 24h)
       - SHORT-TERM (Next 7 days)
       - LONG-TERM (Next 30 days)
    
    6. INTELLIGENCE REQUIREMENTS
       - Priority Information Needs
       - Collection Focus Areas
       - Verification Requirements
    
    Format: Professional intelligence briefing suitable for C-suite and government stakeholders.
    Tone: Authoritative, factual, actionable.
    Length: 800-1200 words.`;

    return await this.callGroq(prompt, { 
      model: this.models.professional,
      max_tokens: 3000,
      temperature: 0.3
    });
  }

  /**
   * Generate state-specific risk assessment - ENHANCED
   */
  async generateStateRiskAssessment(stateName, incidents) {
    const stateIncidents = incidents.filter(item => {
      const content = (item.title + ' ' + item.summary).toLowerCase();
      const stateLower = stateName.toLowerCase();
      
      // More sophisticated matching
      return content.includes(stateLower) || 
             content.includes(stateLower.split(' ')[0]) ||
             (item.extractedLocations && item.extractedLocations.some(loc => 
               loc.toLowerCase().includes(stateLower)
             ));
    });

    if (stateIncidents.length === 0) {
      return { 
        stateName,
        riskLevel: 'Low',
        riskScore: 25,
        confidence: 'Medium',
        analysis: `No significant security incidents reported for ${stateName} in the current reporting period. This does not necessarily indicate absence of risk.`,
        incidentCount: 0,
        trend: 'Stable',
        predictiveRisk: 'Low probability of escalation in next 7 days',
        recommendations: {
          monitoring: 'Maintain routine security monitoring',
          preparedness: 'Review contingency plans',
          intelligence: 'Monitor regional developments'
        },
        metadata: {
          assessmentDate: new Date().toISOString(),
          dataPoints: 0,
          sources: 'No incident data available'
        }
      };
    }

    const prompt = `Conduct PROFESSIONAL RISK ASSESSMENT for ${stateName} State, Nigeria:

    SECURITY INCIDENTS (${stateIncidents.length} reported):
    ${stateIncidents.map((item, i) => `${i + 1}. ${item.title} - ${item.summary.substring(0, 150)}`).join('\n')}
    
    INCIDENT ANALYSIS:
    - Date Range: ${this.getDateRange(stateIncidents)}
    - Severity Distribution: ${this.calculateSeverityDistribution(stateIncidents)}
    - Perpetrator Patterns: ${this.identifyPerpetratorPatterns(stateIncidents)}
    - Target Analysis: ${this.analyzeTargets(stateIncidents)}
    
    Provide COMPREHENSIVE RISK ASSESSMENT:
    
    1. RISK LEVEL DETERMINATION
       - Overall Risk Level (Critical/High/Medium/Low)
       - Risk Score (1-100)
       - Confidence Level (High/Medium/Low)
    
    2. THREAT ANALYSIS
       - Primary Threats (Ranked by severity)
       - Threat Actor Profiles
       - Tactics & Capabilities
       - Intent Assessment
    
    3. VULNERABILITY ASSESSMENT
       - Population Vulnerabilities
       - Critical Infrastructure
       - Economic Exposures
       - Security Capability Gaps
    
    4. IMPACT ASSESSMENT
       - Humanitarian Impact
       - Economic Consequences
       - Political Ramifications
       - Security Implications
    
    5. TREND ANALYSIS
       - Week-over-Week Comparison
       - Emerging Patterns
       - Escalation Indicators
       - De-escalation Factors
    
    6. PREDICTIVE OUTLOOK
       - 7-Day Risk Forecast
       - Trigger Events
       - Warning Indicators
       - Probability Estimates
    
    7. SPECIFIC RECOMMENDATIONS for ${stateName}
       - Security Measures
       - Intelligence Requirements
       - Coordination Needs
       - Resource Allocation
    
    Format as professional risk assessment report.`;

    const response = await this.callGroq(prompt, { 
      model: this.models.enhanced,
      max_tokens: 2000
    });
    
    return {
      stateName,
      riskLevel: this.extractRiskLevel(response),
      riskScore: this.calculateRiskScore(response, stateIncidents.length),
      confidence: this.extractConfidenceLevel(response),
      analysis: response,
      incidentCount: stateIncidents.length,
      incidentBreakdown: this.categorizeIncidents(stateIncidents),
      geographicHotspots: this.identifyHotspots(stateIncidents),
      trend: this.analyzeStateTrend(stateIncidents),
      predictiveRisk: this.extractPredictiveRisk(response),
      recommendations: this.extractRecommendations(response),
      metadata: {
        assessmentDate: new Date().toISOString(),
        dataPoints: stateIncidents.length,
        sources: this.extractSources(stateIncidents),
        lastIncidentDate: this.getLatestIncidentDate(stateIncidents),
        assessmentType: 'Comprehensive'
      }
    };
  }

  /**
   * Generate natural language summary from structured data - ENHANCED
   */
  async generateNarrativeSummary(incidentData) {
    const prompt = `As a professional security analyst, create a NARRATIVE SUMMARY for intelligence reporting:

    INCIDENT DATA:
    - Title: ${incidentData.title}
    - Details: ${incidentData.summary}
    - Location: ${incidentData.location || 'Location unspecified'}
    - Date/Time: ${incidentData.timestamp || 'Time unspecified'}
    - Source: ${incidentData.source || 'Unknown source'}
    - Additional Context: ${incidentData.additionalContext || 'No additional context'}
    
    Create a PROFESSIONAL NARRATIVE that:
    1. Opens with key facts (who, what, when, where)
    2. Describes the incident sequence
    3. Identifies involved parties
    4. Assesses immediate impact
    5. Notes significant details
    6. Concludes with implications
    
    Requirements:
    - Length: 3-4 sentences
    - Tone: Professional, factual, concise
    - Style: Intelligence reporting standard
    - Include relevant details but avoid speculation
    - Mark unverified information appropriately
    
    Write the narrative summary:`;

    return await this.callGroq(prompt, { 
      max_tokens: 300,
      temperature: 0.2
    });
  }

  /**
   * Detect patterns and emerging trends - ENHANCED
   */
  async detectPatterns(currentWeekIncidents, previousWeekIncidents) {
    const prompt = `You are a pattern analysis expert for Nigerian security intelligence.

    CONDUCT COMPARATIVE PATTERN ANALYSIS:
    
    CURRENT WEEK (${currentWeekIncidents.length} incidents):
    ${currentWeekIncidents.slice(0, 25).map((item, i) => `${i + 1}. ${item.title} [${item.severity || 'Unknown'}]`).join('\n')}
    
    PREVIOUS WEEK (${previousWeekIncidents.length} incidents):
    ${previousWeekIncidents.slice(0, 25).map((item, i) => `${i + 1}. ${item.title} [${item.severity || 'Unknown'}]`).join('\n')}
    
    STATISTICAL COMPARISON:
    - Volume Change: ${((currentWeekIncidents.length - previousWeekIncidents.length) / previousWeekIncidents.length * 100).toFixed(1)}%
    - Severity Shift: ${this.calculateSeverityShift(currentWeekIncidents, previousWeekIncidents)}
    - Geographic Distribution: ${this.compareGeographicDistribution(currentWeekIncidents, previousWeekIncidents)}
    
    Analyze for:
    
    1. SIGNIFICANT PATTERNS
       - Tactical Patterns (methods, timing, targeting)
       - Geographic Patterns (clustering, spread, movement)
       - Temporal Patterns (time of day, day of week)
       - Perpetrator Patterns (group behavior, coordination)
    
    2. EMERGING TRENDS
       - New Threat Developments
       - Escalation Indicators
       - De-escalation Signals
       - Unusual Activity
    
    3. COMPARATIVE ANALYSIS
       - Week-over-Week Changes
       - Severity Escalation/De-escalation
       - Geographic Shifts
       - Tactical Evolution
    
    4. INTELLIGENCE INSIGHTS
       - Key Findings
       - Predictive Indicators
       - Warning Signs
       - Opportunities for Intervention
    
    5. CONFIDENCE ASSESSMENT
       - Data Reliability
       - Pattern Confidence
       - Forecast Confidence
    
    Provide actionable intelligence insights in professional format.`;

    return await this.callGroq(prompt, { 
      model: this.models.enhanced,
      max_tokens: 2500,
      temperature: 0.3
    });
  }

  /**
   * Generate professional alert message for critical incidents
   */
  async generateAlert(incident) {
    const prompt = `Generate a PROFESSIONAL SECURITY ALERT for immediate distribution:

    INCIDENT DETAILS:
    - Type: ${incident.category || 'Security Incident'}
    - Location: ${incident.location || 'Location unspecified'}
    - Time: ${incident.timestamp || 'Recent'}
    - Source: ${incident.source || 'Multiple sources'}
    - Details: ${incident.summary || incident.title}
    - Verified: ${incident.verified ? 'Confirmed' : 'Initial report'}
    
    Create a SECURITY ALERT with this structure:
    
    [ALERT HEADER]
    SECURITY ALERT: [INCIDENT TYPE] - [LOCATION]
    ISSUED: ${new Date().toISOString()}
    ALERT LEVEL: [DETERMINE BASED ON SEVERITY]
    
    [SITUATION]
    Brief description of incident with verified facts.
    
    [IMPACT]
    Immediate impact on safety, travel, operations.
    
    [THREAT ASSESSMENT]
    Current threat level and potential escalation.
    
    [ACTION REQUIRED]
    Specific actions for different stakeholders:
    - All Personnel: [actions]
    - Security Teams: [actions]
    - Management: [actions]
    
    [RESTRICTIONS]
    Any movement or operational restrictions.
    
    [CONTACTS]
    Emergency contacts and reporting channels.
    
    [VALID UNTIL]
    Time for next update or alert expiration.
    
    Requirements:
    - Length: 200-300 words
    - Tone: Urgent but professional
    - Clarity: Clear, actionable instructions
    - Format: Easy to read and forward
    - Include verification status
    
    Generate the complete alert:`;

    const response = await this.callGroq(prompt, { 
      max_tokens: 500,
      temperature: 0.1
    });
    
    return {
      alert: response,
      metadata: {
        generated: new Date().toISOString(),
        alertId: `ALERT-${Date.now()}`,
        incidentType: incident.category,
        location: incident.location,
        severity: incident.severity || 'High',
        distributionChannels: ['WhatsApp', 'Email', 'SMS'],
        requiresAcknowledgement: true
      }
    };
  }

  /**
   * Enhance incident data with professional AI extraction
   */
  async enrichIncidentData(incidents) {
    console.log(`🤖 Enhancing ${incidents.length} incidents with professional AI analysis...`);
    
    const enrichedData = [];
    const batchSize = 3; // Smaller batches for reliability
    const maxIncidents = Math.min(incidents.length, 30); // Limit for performance
    
    for (let i = 0; i < maxIncidents; i += batchSize) {
      const batch = incidents.slice(i, i + batchSize);
      
      try {
        const enrichedBatch = await Promise.all(
          batch.map(async (incident) => {
            try {
              const classification = await this.classifyIncident(incident.title, incident.summary);
              
              // Generate narrative summary
              const narrative = await this.generateNarrativeSummary(incident);
              
              return {
                ...incident,
                enriched: true,
                aiAnalysis: {
                  classification: classification.category,
                  subcategory: classification.subcategory,
                  severity: classification.severity,
                  confidence: classification.confidence,
                  casualties: classification.casualties,
                  perpetrators: classification.perpetrators,
                  locations: classification.locations,
                  extractedFacts: classification.extracted_facts,
                  verificationStatus: classification.verification_status,
                  threatIndicators: classification.threat_indicators,
                  recommendedResponse: classification.recommended_response
                },
                narrativeSummary: narrative,
                riskAssessment: {
                  level: classification.severity,
                  score: this.calculateRiskScoreFromClassification(classification),
                  factors: this.extractRiskFactors(classification)
                },
                metadata: {
                  enrichedAt: new Date().toISOString(),
                  modelUsed: this.defaultModel,
                  processingTime: 'batch',
                  confidence: classification.confidence
                }
              };
              
            } catch (err) {
              console.error(`❌ Failed to enrich incident "${incident.title.substring(0, 50)}...":`, err.message);
              
              // Return incident with minimal enrichment
              return {
                ...incident,
                enriched: false,
                aiAnalysis: {
                  classification: 'Processing Failed',
                  severity: 'Unknown',
                  confidence: 'Low'
                },
                metadata: {
                  enrichedAt: new Date().toISOString(),
                  error: err.message,
                  fallback: true
                }
              };
            }
          })
        );
        
        enrichedData.push(...enrichedBatch);
        
        // Rate limiting with exponential backoff
        const delay = Math.min(3000, 1000 * Math.pow(1.5, i / batchSize));
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`✅ Enriched batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(maxIncidents/batchSize)}`);
        
      } catch (batchError) {
        console.error('❌ Batch enrichment error:', batchError.message);
        // Add unenriched incidents to continue
        enrichedData.push(...batch.map(inc => ({...inc, enriched: false})));
      }
    }
    
    // Add remaining incidents without enrichment
    if (incidents.length > maxIncidents) {
      const remaining = incidents.slice(maxIncidents).map(inc => ({
        ...inc,
        enriched: false,
        metadata: {
          enrichedAt: new Date().toISOString(),
          note: 'Not enriched due to rate limits'
        }
      }));
      enrichedData.push(...remaining);
    }
    
    console.log(`🎯 Total enriched: ${enrichedData.filter(item => item.enriched).length}/${enrichedData.length}`);
    
    return enrichedData;
  }

  // ===== NEW PROFESSIONAL METHODS =====

  /**
   * Generate comprehensive executive analysis
   */
  async generateComprehensiveAnalysis(data) {
    const { currentIncidents, historicalData, geopoliticalContext } = data;
    
    const prompt = `You are the Chief Security Intelligence Officer at Suntrenia.
    
    PREPARE COMPREHENSIVE SECURITY ANALYSIS:
    
    CURRENT SITUATION (${currentIncidents.length} incidents):
    ${this.formatIncidentsForExecutiveAnalysis(currentIncidents)}
    
    HISTORICAL CONTEXT (${historicalData?.length || 0} data points):
    ${historicalData ? this.formatHistoricalData(historicalData) : 'Limited historical data available'}
    
    GEOPOLITICAL CONTEXT:
    ${geopoliticalContext || 'Standard Nigerian security context'}
    
    PRODUCE PROFESSIONAL INTELLIGENCE ASSESSMENT:
    
    1. EXECUTIVE OVERVIEW (BLUF Format)
       - Bottom Line Up Front
       - Key Decision Points
       - Immediate Implications
    
    2. SITUATIONAL AWARENESS
       - Threat Environment Assessment
       - Key Incident Analysis
       - Pattern Recognition
       - Anomaly Detection
    
    3. THREAT INTELLIGENCE
       - Actor Analysis
       - Capability Assessment
       - Intent Assessment
       - Opportunity Analysis
    
    4. RISK ASSESSMENT
       - National Risk Profile
       - Regional Risk Breakdown
       - Sector-Specific Risks
       - Confidence Levels
    
    5. PREDICTIVE ANALYSIS
       - 7-Day Forecast
       - Scenario Planning
       - Early Warning Indicators
       - Probability Estimates
    
    6. STAKEHOLDER IMPACT
       - Government Implications
       - Private Sector Impact
       - Civil Society Concerns
       - International Relations
    
    7. RECOMMENDATIONS
       - Strategic Recommendations
       - Operational Measures
       - Tactical Actions
       - Contingency Planning
    
    8. INTELLIGENCE REQUIREMENTS
       - Collection Priorities
       - Analysis Gaps
       - Verification Needs
       - Future Focus Areas
    
    Format: Professional intelligence assessment for senior leadership.
    Classification: RESTRICTED
    Length: Comprehensive but concise.`;

    return await this.callGroq(prompt, {
      model: this.models.professional,
      max_tokens: 4000,
      temperature: 0.2
    });
  }

  /**
   * Generate predictive risk assessment
   */
  async generatePredictiveRiskAssessment(params) {
    const { state, timeframe, incidents, includeProbability, includeMitigation } = params;
    
    const prompt = `CONDUCT PREDICTIVE RISK ASSESSMENT:
    
    AREA: ${state || 'National - Nigeria'}
    TIMEFRAME: ${timeframe || '7 days'}
    DATA POINTS: ${incidents?.length || 0} incidents
    
    ${incidents ? `RECENT INCIDENTS:\n${incidents.slice(0, 15).map((item, i) => `${i + 1}. ${item.title}`).join('\n')}` : ''}
    
    ANALYZE FOR:
    
    1. RISK PROJECTION
       - Probability of Incidents
       - Likely Severity Levels
       - Geographic Probability Distribution
       - Temporal Risk Patterns
    
    2. THREAT FORECAST
       - Most Likely Threat Types
       - Potential Perpetrator Actions
       - Target Vulnerability Assessment
       - Capability Projections
    
    3. SCENARIO PLANNING
       - Base Case Scenario
       - Worst Case Scenario
       - Best Case Scenario
       - Trigger Events for Each
    
    4. CONFIDENCE METRICS
       - Data Quality Assessment
       - Prediction Confidence Intervals
       - Key Assumptions
       - Uncertainty Factors
    
    5. ${includeMitigation ? 'MITIGATION STRATEGIES' : 'OBSERVATION PRIORITIES'}
       - Preventive Measures
       - Detection Enhancements
       - Response Preparedness
       - Recovery Planning
    
    6. MONITORING REQUIREMENTS
       - Key Indicators to Watch
       - Information Requirements
       - Collection Priorities
       - Reporting Protocols
    
    Provide professional predictive assessment with actionable insights.`;

    const response = await this.callGroq(prompt, {
      model: this.models.enhanced,
      max_tokens: 2000,
      temperature: 0.3
    });
    
    return {
      assessment: response,
      metadata: {
        generated: new Date().toISOString(),
        area: state || 'National',
        timeframe: timeframe,
        confidence: this.extractConfidenceLevel(response),
        probabilityIncluded: includeProbability,
        mitigationIncluded: includeMitigation
      }
    };
  }

  /**
   * Generate protective actions by threat type
   */
  async generateProtectiveActions(params) {
    const { threatType, location, entityType, assetsAtRisk, includeChecklists, includeContacts, includeEvacuation } = params;
    
    const prompt = `DEVELOP PROTECTIVE ACTION PLAN:
    
    THREAT: ${threatType}
    LOCATION: ${location}
    ENTITY TYPE: ${entityType}
    ASSETS AT RISK: ${assetsAtRisk?.join(', ') || 'General assets'}
    
    CREATE COMPREHENSIVE PROTECTION PLAN:
    
    1. THREAT-SPECIFIC COUNTERMEASURES
       - Preventive Measures
       - Detection Systems
       - Response Procedures
       - Recovery Plans
    
    2. ENTITY-SPECIFIC GUIDANCE
       - ${entityType === 'expatriate' ? 'Personal Safety Protocols' : 'Organizational Security Measures'}
       - Communication Procedures
       - Emergency Protocols
       - Daily Security Routines
    
    3. ${includeChecklists ? 'SECURITY CHECKLISTS' : 'KEY ACTIONS'}
       - Pre-Incident Preparation
       - During-Incident Actions
       - Post-Incident Procedures
       - Continuous Improvement
    
    4. ${includeContacts ? 'EMERGENCY CONTACTS & COORDINATION' : 'COORDINATION REQUIREMENTS'}
       - Local Authorities
       - Security Services
       - Medical Support
       - Diplomatic Contacts
    
    5. ${includeEvacuation ? 'EVACUATION & RELOCATION PLANS' : 'CONTINGENCY PLANS'}
       - Trigger Conditions
       - Routes & Methods
       - Safe Havens
       - Communication During Movement
    
    6. TRAINING & PREPAREDNESS
       - Required Training
       - Drills & Exercises
       - Equipment Requirements
       - Skill Development
    
    7. MONITORING & ADJUSTMENT
       - Threat Monitoring
       - Plan Review Schedule
       - Update Triggers
       - Performance Metrics
    
    Provide actionable, practical guidance suitable for immediate implementation.`;

    const response = await this.callGroq(prompt, {
      model: this.models.enhanced,
      max_tokens: 2500,
      temperature: 0.2
    });
    
    return {
      protectivePlan: response,
      metadata: {
        generated: new Date().toISOString(),
        threatType,
        location,
        entityType,
        assetsAtRisk,
        includesChecklists: includeChecklists,
        includesContacts: includeContacts,
        includesEvacuation: includeEvacuation,
        validityPeriod: '30 days or until threat changes'
      }
    };
  }

  /**
   * Monitor real-time threats
   */
  async monitorRealTimeThreats(params) {
    const { incidents, sensitivity, includePredictive, notifyLevel } = params;
    
    const prompt = `REAL-TIME THREAT MONITORING ANALYSIS:
    
    CURRENT INCIDENTS: ${incidents.length}
    MONITORING SENSITIVITY: ${sensitivity}
    NOTIFICATION LEVEL: ${notifyLevel}
    
    INCIDENT STREAM:
    ${incidents.slice(0, 20).map((item, i) => `${i + 1}. ${item.title} [${item.severity || 'Unknown'}]`).join('\n')}
    
    CONDUCT REAL-TIME ANALYSIS:
    
    1. THREAT DETECTION
       - Immediate Threats
       - Emerging Threats
       - Escalating Situations
       - Unusual Activity
    
    2. PRIORITIZATION
       - Threat Severity Ranking
       - Urgency Assessment
       - Impact Evaluation
       - Resource Implications
    
    3. ${includePredictive ? 'PREDICTIVE MONITORING' : 'TREND MONITORING'}
       - Next 24-48 Hour Projections
       - Escalation Probabilities
       - Cascade Effects
       - Secondary Threats
    
    4. ALERT CRITERIA ASSESSMENT
       - Meets Notification Threshold?
       - Required Response Level
       - Stakeholder Notification Requirements
       - Public Communication Needs
    
    5. RESPONSE READINESS
       - Available Resources
       - Response Time Estimates
       - Coordination Requirements
       - Contingency Activation
    
    6. INTELLIGENCE GAPS
       - Missing Information
       - Verification Requirements
       - Collection Priorities
       - Analysis Needs
    
    Provide real-time assessment with immediate actionable items.`;

    const response = await this.callGroq(prompt, {
      model: this.models.standard,
      max_tokens: 1500,
      temperature: 0.1
    });
    
    const alerts = this.extractAlertsFromResponse(response, incidents);
    
    return {
      monitoringSummary: response,
      alerts: alerts,
      status: this.determineMonitoringStatus(alerts, sensitivity),
      metadata: {
        monitoringTime: new Date().toISOString(),
        incidentsMonitored: incidents.length,
        alertsGenerated: alerts.length,
        sensitivityLevel: sensitivity,
        predictiveIncluded: includePredictive
      }
    };
  }

  // ===== HELPER METHODS =====

  /**
   * Core API call to Groq with enhanced error handling
   */
  async callGroq(prompt, options = {}) {
    try {
      const startTime = Date.now();
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: options.model || this.defaultModel,
          messages: [
            {
              role: 'system',
              content: 'You are a professional security intelligence analyst with expertise in Nigerian security affairs, counter-terrorism, risk assessment, and intelligence reporting. Provide accurate, actionable, well-structured analysis suitable for professional security stakeholders.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options.temperature || 0.3,
          max_tokens: options.max_tokens || 1000,
          top_p: options.top_p || 0.9,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      const processingTime = Date.now() - startTime;
      
      console.log(`✅ Groq API call completed in ${processingTime}ms`);
      
      return response.data.choices[0].message.content;
      
    } catch (error) {
      console.error('❌ Groq API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Provide fallback responses based on error type
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your GROQ_API_KEY environment variable.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. The Groq API is taking too long to respond.');
      } else {
        throw new Error(`Groq API call failed: ${error.message}`);
      }
    }
  }

  /**
   * Extract risk level from text
   */
  extractRiskLevel(text) {
    const levels = ['Critical', 'High', 'Medium', 'Low'];
    
    // Try multiple patterns
    for (const level of levels) {
      const patterns = [
        new RegExp(`Risk Level:\\s*${level}`, 'i'),
        new RegExp(`${level}\\s*Risk`, 'i'),
        new RegExp(`risk level is ${level.toLowerCase()}`, 'i'),
        new RegExp(`assessed as ${level}`, 'i'),
        new RegExp(`${level}\\s*threat`, 'i')
      ];
      
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          return level;
        }
      }
    }
    
    // Default based on keywords
    if (text.includes('critical') || text.includes('severe') || text.includes('emergency')) {
      return 'Critical';
    } else if (text.includes('high') || text.includes('elevated') || text.includes('significant')) {
      return 'High';
    } else if (text.includes('medium') || text.includes('moderate')) {
      return 'Medium';
    }
    
    return 'Medium'; // Conservative default
  }

  /**
   * Extract confidence level from text
   */
  extractConfidenceLevel(text) {
    if (text.includes('high confidence') || text.includes('confidence: high') || text.includes('certain')) {
      return 'High';
    } else if (text.includes('medium confidence') || text.includes('confidence: medium') || text.includes('likely')) {
      return 'Medium';
    } else if (text.includes('low confidence') || text.includes('confidence: low') || text.includes('uncertain')) {
      return 'Low';
    }
    return 'Medium';
  }

  /**
   * Calculate risk score (1-100)
   */
  calculateRiskScore(text, incidentCount) {
    const riskLevel = this.extractRiskLevel(text);
    const baseScores = {
      'Critical': 85,
      'High': 70,
      'Medium': 50,
      'Low': 25
    };
    
    let score = baseScores[riskLevel] || 50;
    
    // Adjust based on incident count
    if (incidentCount > 20) score += 15;
    else if (incidentCount > 10) score += 10;
    else if (incidentCount > 5) score += 5;
    
    // Cap at 100
    return Math.min(100, score);
  }

  /**
   * Extract predictive risk from response
   */
  extractPredictiveRisk(text) {
    const patterns = [
      /predict.*escalat.*next.*(\d+).*day/i,
      /forecast.*increase.*next.*(\d+).*day/i,
      /likely.*next.*(\d+).*day/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return `Potential escalation in next ${match[1]} days`;
      }
    }
    
    return 'Stable forecast for next 7 days';
  }

  /**
   * Extract recommendations from response
   */
  extractRecommendations(text) {
    const recommendations = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('recommend') || line.includes('suggest') || line.includes('should') || 
          line.match(/^\d+\./) || line.match(/^[-*•]/)) {
        const cleanLine = line.replace(/^\d+\.\s*|^[-*•]\s*/, '').trim();
        if (cleanLine.length > 20 && cleanLine.length < 200) {
          recommendations.push(cleanLine);
        }
      }
    }
    
    return recommendations.slice(0, 10); // Limit to top 10
  }

  /**
   * Format incidents for executive analysis
   */
  formatIncidentsForExecutiveAnalysis(incidents) {
    return incidents.slice(0, 20).map((item, i) => {
      const severity = item.severity || 'Unknown';
      const source = item.source || 'Unknown';
      const summary = item.summary ? item.summary.substring(0, 150) + '...' : 'No summary';
      return `${i + 1}. [${severity}] ${item.title} (${source}) - ${summary}`;
    }).join('\n');
  }

  /**
   * Format historical data
   */
  formatHistoricalData(historicalData) {
    if (!historicalData || historicalData.length === 0) {
      return 'No historical data available';
    }
    
    const summary = {
      totalIncidents: historicalData.length,
      dateRange: this.getDateRange(historicalData),
      avgPerDay: (historicalData.length / 30).toFixed(1)
    };
    
    return `Historical baseline: ${summary.totalIncidents} incidents over ${summary.dateRange} (avg ${summary.avgPerDay}/day)`;
  }

  /**
   * Get date range from incidents
   */
  getDateRange(incidents) {
    if (!incidents || incidents.length === 0) return 'No dates';
    
    const dates = incidents
      .map(item => new Date(item.timestamp))
      .filter(date => !isNaN(date.getTime()));
    
    if (dates.length === 0) return 'Date unspecified';
    
    const oldest = new Date(Math.min(...dates));
    const newest = new Date(Math.max(...dates));
    
    return `${oldest.toLocaleDateString()} to ${newest.toLocaleDateString()}`;
  }

  /**
   * Calculate severity distribution
   */
  calculateSeverityDistribution(incidents) {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0, Unknown: 0 };
    
    incidents.forEach(item => {
      const severity = item.severity || 'Unknown';
      counts[severity] = (counts[severity] || 0) + 1;
    });
    
    return Object.entries(counts)
      .filter(([severity, count]) => count > 0)
      .map(([severity, count]) => `${severity}: ${count}`)
      .join(', ');
  }

  /**
   * Identify perpetrator patterns
   */
  identifyPerpetratorPatterns(incidents) {
    const perpetrators = new Set();
    
    incidents.forEach(item => {
      if (item.perpetrators) {
        if (Array.isArray(item.perpetrators)) {
          item.perpetrators.forEach(p => perpetrators.add(p));
        } else if (typeof item.perpetrators === 'string') {
          perpetrators.add(item.perpetrators);
        }
      }
    });
    
    return Array.from(perpetrators).slice(0, 5).join(', ') || 'Unknown';
  }

  /**
   * Analyze targets
   */
  analyzeTargets(incidents) {
    const targets = {
      civilian: 0,
      military: 0,
      police: 0,
      infrastructure: 0,
      economic: 0
    };
    
    incidents.forEach(item => {
      const content = (item.title + ' ' + item.summary).toLowerCase();
      
      if (content.includes('civilian') || content.includes('villager') || content.includes('resident')) {
        targets.civilian++;
      }
      if (content.includes('military') || content.includes('soldier') || content.includes('army')) {
        targets.military++;
      }
      if (content.includes('police') || content.includes('officer')) {
        targets.police++;
      }
      if (content.includes('school') || content.includes('hospital') || content.includes('road')) {
        targets.infrastructure++;
      }
      if (content.includes('market') || content.includes('bank') || content.includes('business')) {
        targets.economic++;
      }
    });
    
    return Object.entries(targets)
      .filter(([_, count]) => count > 0)
      .map(([target, count]) => `${target}: ${count}`)
      .join(', ');
  }

  /**
   * Categorize incidents
   */
  categorizeIncidents(incidents) {
    const categories = {};
    
    incidents.forEach(item => {
      const category = item.category || 'Uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return categories;
  }

  /**
   * Identify hotspots
   */
  identifyHotspots(incidents) {
    const locations = {};
    
    incidents.forEach(item => {
      const location = item.location || 'Unknown';
      locations[location] = (locations[location] || 0) + 1;
    });
    
    return Object.entries(locations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
  }

  /**
   * Analyze state trend
   */
  analyzeStateTrend(incidents) {
    if (incidents.length < 2) return 'Insufficient data';
    
    // Simple trend based on dates
    const sorted = incidents
      .map(item => new Date(item.timestamp))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a - b);
    
    if (sorted.length < 2) return 'Stable';
    
    const recentCount = sorted.filter(date => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return date > weekAgo;
    }).length;
    
    const olderCount = sorted.length - recentCount;
    
    if (recentCount > olderCount * 1.5) return 'Increasing';
    if (recentCount < olderCount * 0.5) return 'Decreasing';
    return 'Stable';
  }

  /**
   * Extract sources
   */
  extractSources(incidents) {
    const sources = new Set();
    incidents.forEach(item => {
      if (item.source) sources.add(item.source);
    });
    return Array.from(sources).slice(0, 5).join(', ');
  }

  /**
   * Get latest incident date
   */
  getLatestIncidentDate(incidents) {
    const dates = incidents
      .map(item => new Date(item.timestamp))
      .filter(date => !isNaN(date.getTime()));
    
    if (dates.length === 0) return 'Unknown';
    
    const latest = new Date(Math.max(...dates));
    return latest.toISOString().split('T')[0];
  }

  /**
   * Calculate risk score from classification
   */
  calculateRiskScoreFromClassification(classification) {
    const severityScores = {
      'Critical': 90,
      'High': 70,
      'Medium': 50,
      'Low': 30
    };
    
    let score = severityScores[classification.severity] || 50;
    
    // Adjust based on casualties
    if (classification.casualties) {
      const deaths = parseInt(classification.casualties.deaths) || 0;
      const abducted = parseInt(classification.casualties.abducted) || 0;
      
      if (deaths > 10) score += 20;
      else if (deaths > 5) score += 15;
      else if (deaths > 0) score += 10;
      
      if (abducted > 20) score += 15;
      else if (abducted > 10) score += 10;
      else if (abducted > 0) score += 5;
    }
    
    return Math.min(100, score);
  }

  /**
   * Extract risk factors
   */
  extractRiskFactors(classification) {
    const factors = [];
    
    if (classification.severity === 'Critical' || classification.severity === 'High') {
      factors.push('High severity incident');
    }
    
    if (classification.casualties) {
      const deaths = parseInt(classification.casualties.deaths) || 0;
      const abducted = parseInt(classification.casualties.abducted) || 0;
      
      if (deaths > 0) factors.push(`Fatalities: ${deaths}`);
      if (abducted > 0) factors.push(`Abductions: ${abducted}`);
    }
    
    if (classification.perpetrators?.primary && classification.perpetrators.primary !== 'Unknown') {
      factors.push(`Perpetrator: ${classification.perpetrators.primary}`);
    }
    
    if (classification.verification_status === 'Confirmed') {
      factors.push('Verified incident');
    }
    
    return factors.length > 0 ? factors : ['Standard security incident'];
  }

  /**
   * Calculate severity shift
   */
  calculateSeverityShift(currentWeek, previousWeek) {
    const getAvgSeverity = (incidents) => {
      const severityValues = {
        'Critical': 4,
        'High': 3,
        'Medium': 2,
        'Low': 1,
        'Unknown': 1
      };
      
      const total = incidents.reduce((sum, item) => {
        return sum + (severityValues[item.severity] || 1);
      }, 0);
      
      return incidents.length > 0 ? total / incidents.length : 1;
    };
    
    const currentAvg = getAvgSeverity(currentWeek);
    const previousAvg = getAvgSeverity(previousWeek);
    
    const change = ((currentAvg - previousAvg) / previousAvg) * 100;
    
    if (change > 10) return 'Significant increase in severity';
    if (change > 5) return 'Moderate increase in severity';
    if (change < -10) return 'Significant decrease in severity';
    if (change < -5) return 'Moderate decrease in severity';
    return 'Stable severity levels';
  }

  /**
   * Compare geographic distribution
   */
  compareGeographicDistribution(currentWeek, previousWeek) {
    const getLocations = (incidents) => {
      const locations = new Set();
      incidents.forEach(item => {
        if (item.location) locations.add(item.location);
      });
      return Array.from(locations);
    };
    
    const currentLocs = getLocations(currentWeek);
    const previousLocs = getLocations(previousWeek);
    
    const newLocations = currentLocs.filter(loc => !previousLocs.includes(loc));
    const disappearedLocations = previousLocs.filter(loc => !currentLocs.includes(loc));
    
    if (newLocations.length > 0 && disappearedLocations.length > 0) {
      return 'Geographic shift detected';
    } else if (newLocations.length > 0) {
      return 'Expanding geographic spread';
    } else if (disappearedLocations.length > 0) {
      return 'Contracting geographic spread';
    }
    return 'Stable geographic distribution';
  }

  /**
   * Extract alerts from monitoring response
   */
  extractAlertsFromResponse(response, incidents) {
    const alerts = [];
    const lines = response.split('\n');
    
    let currentAlert = null;
    
    for (const line of lines) {
      if (line.includes('ALERT:') || line.includes('Alert:') || line.includes('Urgent:')) {
        if (currentAlert) alerts.push(currentAlert);
        
        currentAlert = {
          title: line.replace(/ALERT:|Alert:|Urgent:/, '').trim(),
          level: this.extractAlertLevel(line),
          details: [],
          timestamp: new Date().toISOString()
        };
      } else if (currentAlert && line.trim().length > 0) {
        currentAlert.details.push(line.trim());
      }
    }
    
    if (currentAlert) alerts.push(currentAlert);
    
    // If no alerts extracted, create default based on incidents
    if (alerts.length === 0 && incidents.length > 0) {
      const criticalIncidents = incidents.filter(item => item.severity === 'Critical');
      if (criticalIncidents.length > 0) {
        alerts.push({
          title: `Critical Incident Alert: ${criticalIncidents[0].title.substring(0, 50)}...`,
          level: 'Critical',
          details: ['Multiple critical incidents detected', 'Immediate attention required'],
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return alerts.slice(0, 5); // Limit to 5 alerts
  }

  /**
   * Extract alert level from text
   */
  extractAlertLevel(text) {
    if (text.includes('Critical') || text.includes('Emergency')) return 'Critical';
    if (text.includes('High') || text.includes('Urgent')) return 'High';
    if (text.includes('Medium') || text.includes('Warning')) return 'Medium';
    if (text.includes('Low') || text.includes('Advisory')) return 'Low';
    return 'Medium';
  }

  /**
   * Determine monitoring status
   */
  determineMonitoringStatus(alerts, sensitivity) {
    const criticalAlerts = alerts.filter(alert => alert.level === 'Critical').length;
    const highAlerts = alerts.filter(alert => alert.level === 'High').length;
    
    if (criticalAlerts > 0) return 'RED - Critical alert active';
    if (highAlerts > 0 && sensitivity === 'high') return 'ORANGE - High alert active';
    if (highAlerts > 0) return 'YELLOW - Elevated monitoring';
    if (alerts.length > 0) return 'GREEN - Routine monitoring';
    return 'GREEN - Normal operations';
  }

  /**
   * Additional professional methods can be added here
   */
  
  async generateExecutiveSummary(analysis) {
    const prompt = `Create an EXECUTIVE SUMMARY from this analysis:
    
    ${analysis.substring(0, 1000)}...
    
    Summarize in BLUF (Bottom Line Up Front) format:
    1. One-sentence key finding
    2. Three key implications
    3. Two immediate recommendations
    4. Risk level assessment
    
    Keep it under 200 words.`;
    
    return await this.callGroq(prompt, { max_tokens: 300 });
  }
  
  async generateThreatAssessment(analysis) {
    const prompt = `Extract THREAT ASSESSMENT from this analysis:
    
    ${analysis.substring(0, 1500)}...
    
    Structure as:
    1. Current Threat Level
    2. Primary Threat Actors
    3. Key Vulnerabilities
    4. Escalation Indicators
    5. Protective Posture`;
    
    return await this.callGroq(prompt, { max_tokens: 500 });
  }
  
  async generateStrategicRecommendations(analysis) {
    const prompt = `Generate STRATEGIC RECOMMENDATIONS:
    
    ${analysis.substring(0, 1000)}...
    
    Provide 5-7 strategic recommendations for:
    1. Policy makers
    2. Security leadership
    3. International partners
    4. Private sector`;
    
    return await this.callGroq(prompt, { max_tokens: 600 });
  }

  async generateTacticalRecommendations(analysis) {
    const prompt = `Generate TACTICAL RECOMMENDATIONS:
    
    ${analysis.substring(0, 1000)}...
    
    Provide actionable tactical measures for:
    1. Field operations
    2. Security patrols
    3. Intelligence collection
    4. Community engagement`;
    
    return await this.callGroq(prompt, { max_tokens: 500 });
  }

  async analyzeHistoricalPatterns(historicalData, options) {
    const prompt = `Analyze HISTORICAL PATTERNS:
    
    Data Points: ${historicalData.length}
    Analysis Type: ${options.analysisType}
    
    Identify:
    1. Long-term trends
    2. Seasonal patterns
    3. Cyclical behavior
    4. Breaking points
    5. Predictive indicators
    
    ${options.includeForecast ? 'Include 30-day forecast' : 'Focus on historical analysis'}`;
    
    return await this.callGroq(prompt, { 
      model: this.models.enhanced,
      max_tokens: 1500 
    });
  }

  async analyzeGeospatialPatterns(incidents) {
    const prompt = `Conduct GEOSPATIAL ANALYSIS:
    
    Incidents: ${incidents.length}
    
    Analyze for:
    1. Spatial clustering
    2. Movement patterns
    3. Corridor analysis
    4. Hotspot identification
    5. Risk diffusion`;
    
    return await this.callGroq(prompt, { 
      model: this.models.enhanced,
      max_tokens: 1200 
    });
  }

  async batchClassifyIncidents(params) {
    const { incidents, classificationType, includeRiskScoring } = params;
    
    console.log(`🔍 Batch classifying ${incidents.length} incidents...`);
    
    const results = [];
    
    for (let i = 0; i < incidents.length; i++) {
      try {
        const incident = incidents[i];
        const classification = await this.classifyIncident(incident.title, incident.summary);
        
        results.push({
          originalIndex: i,
          title: incident.title,
          classification: classification.category,
          severity: classification.severity,
          confidence: classification.confidence,
          riskScore: includeRiskScoring ? this.calculateRiskScoreFromClassification(classification) : null,
          metadata: {
            processingTime: new Date().toISOString(),
            modelUsed: this.defaultModel
          }
        });
        
        // Rate limiting
        if (i % 5 === 0 && i > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`❌ Failed to classify incident ${i}:`, error.message);
        results.push({
          originalIndex: i,
          title: incidents[i].title,
          classification: 'Processing Failed',
          severity: 'Unknown',
          confidence: 'Low',
          error: error.message
        });
      }
    }
    
    return results;
  }

  async generateDashboardRecommendations(incidents) {
    const prompt = `Generate DASHBOARD RECOMMENDATIONS for security operations:
    
    Current Situation: ${incidents.length} incidents
    Primary Threats: ${this.identifyPrimaryThreats(incidents)}
    
    Provide 5-7 actionable recommendations for:
    1. Immediate response
    2. Resource allocation
    3. Intelligence collection
    4. Stakeholder communication
    5. Contingency planning`;
    
    return await this.callGroq(prompt, { max_tokens: 400 });
  }

  identifyPrimaryThreats(incidents) {
    const threats = new Set();
    
    incidents.forEach(item => {
      const content = (item.title + ' ' + item.summary).toLowerCase();
      
      if (content.includes('kidnap') || content.includes('abduct')) threats.add('Kidnapping');
      if (content.includes('bandit')) threats.add('Banditry');
      if (content.includes('boko') || content.includes('terror')) threats.add('Terrorism');
      if (content.includes('herdsmen') || content.includes('farmer')) threats.add('Herder-Farmer Conflict');
      if (content.includes('cult')) threats.add('Cult Violence');
      if (content.includes('robbery') || content.includes('armed')) threats.add('Armed Robbery');
    });
    
    return Array.from(threats).slice(0, 3).join(', ') || 'Various security threats';
  }

  async generateProfessionalBriefing(params) {
    const { statistics, incidents, affectedStates, format, audience } = params;
    
    const prompt = `Generate ${format.toUpperCase()} BRIEFING for ${audience.toUpperCase()}:
    
    STATISTICS: ${JSON.stringify(statistics, null, 2)}
    INCIDENTS: ${incidents.length}
    AFFECTED STATES: ${affectedStates.length}
    
    Create briefing tailored for ${audience} with appropriate technical depth and actionable insights.`;
    
    return await this.callGroq(prompt, { 
      model: format === 'detailed' ? this.models.professional : this.models.enhanced,
      max_tokens: format === 'detailed' ? 2500 : 1200 
    });
  }

  async generateImmediateStateRecommendations(stateName, incidents) {
    const prompt = `Generate IMMEDIATE RECOMMENDATIONS for ${stateName}:
    
    Based on ${incidents.length} recent incidents.
    
    Focus on actions for next 24-48 hours:
    1. Security posture adjustments
    2. Intelligence requirements
    3. Public communication
    4. Resource deployment`;
    
    return await this.callGroq(prompt, { max_tokens: 400 });
  }

  async generateStrategicStateRecommendations(stateName, incidents) {
    const prompt = `Generate STRATEGIC RECOMMENDATIONS for ${stateName}:
    
    Based on ${incidents.length} incidents.
    
    Focus on 30-90 day strategy:
    1. Policy adjustments
    2. Capacity building
    3. Community engagement
    4. International cooperation`;
    
    return await this.callGroq(prompt, { max_tokens: 500 });
  }

  async generateRiskForecast(params) {
    const { incidents, timeframe, includeRegions, includeConfidence } = params;
    
    const prompt = `Generate RISK FORECAST for Nigeria:
    
    Timeframe: ${timeframe}
    Recent Incidents: ${incidents.length}
    
    ${includeRegions ? 'Include regional breakdown' : 'National forecast only'}
    ${includeConfidence ? 'Include confidence intervals' : 'Point estimates'}`;
    
    return await this.callGroq(prompt, { 
      model: this.models.enhanced,
      max_tokens: 1500 
    });
  }

  async generateIncidentSummary(enrichedNews) {
    const prompt = `Generate INCIDENT SUMMARY from enriched data:
    
    Total Incidents: ${enrichedNews.length}
    Severity Distribution: ${this.calculateSeverityDistribution(enrichedNews)}
    
    Summarize key findings and implications.`;
    
    return await this.callGroq(prompt, { max_tokens: 300 });
  }

  async detectPatternsAndTrends(params) {
    const { currentData, historicalData, timeframe, analysisType } = params;
    
    return await this.detectPatterns(currentData, historicalData);
  }

  async generateProfessionalAlert(params) {
    const { incident, alertLevel, includeActions } = params;
    
    return await this.generateAlert(incident);
  }

  async enrichIncidentsWithProfessionalAnalysis(incidents) {
    return await this.enrichIncidentData(incidents);
  }

  async analyzeIncidents(incidents) {
    return await this.analyzeIncidents(incidents);
  }
}

module.exports = GroqService;
