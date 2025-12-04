// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 3000;

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // API endpoint to get Nigerian states data
// app.get('/api/states', (req, res) => {
//     try {
//         const statesData = require('./nigeria-states.json');
//         res.json(statesData);
//     } catch (error) {
//         console.error('Error loading states data:', error);
//         res.status(500).json({ error: 'Failed to load states data' });
//     }
// });

// // Simple root route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const express = require('express');
// const path = require('path');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const RSSParser = require('rss-parser');
// const NodeCache = require('node-cache');
// const PDFDocument = require('pdfkit');
// const { Readable } = require('stream');

// const app = express();
// const port = 3000;

// // Serve frontend
// app.use(express.static(path.join(__dirname, 'public')));

// // Cache for 15 minutes
// const newsCache = new NodeCache({ stdTTL: 900 });

// // Keywords to filter
// const keywords = [
//   'bandits','kidnap','gunmen','violence','attack','boko haram',
//   'herdsmen','militants','conflict','bomb','suicide','terror','raid',
//   'ipob','esn','insurgents','abduction','shooting'
// ];

// const parser = new RSSParser();

// // --- Scrape RSS feeds ---
// const rssFeeds = [
//   'https://guardian.ng/feed/',
//   'https://www.premiumtimesng.com/feed',
//   'https://dailypost.ng/feed'
// ];

// async function fetchFromRSS() {
//   const items = [];
//   for (const url of rssFeeds) {
//     try {
//       const feed = await parser.parseURL(url);
//       feed.items.forEach(item => {
//         const text = (item.contentSnippet || item.content || '') + ' ' + item.title;
//         if (keywords.some(k => text.toLowerCase().includes(k))) {
//           items.push({
//             title: item.title,
//             link: item.link,
//             summary: item.contentSnippet || '',
//             source: feed.title,
//             timestamp: item.pubDate || item.isoDate
//           });
//         }
//       });
//     } catch (err) {
//       console.warn(`⚠️ RSS fetch failed (${url}): ${err.message}`);
//     }
//   }
//   return items;
// }

// // --- Fallback Free News API (WorldNewsAPI) ---
// const WORLDNEWS_URL = 'https://api.worldnewsapi.com/search-news?source-country=ng';
// async function fetchFromApi() {
//   try {
//     const resp = await axios.get(WORLDNEWS_URL);
//     const articles = resp.data.articles || [];
//     return articles
//       .filter(a => keywords.some(k => a.summary?.toLowerCase().includes(k) || a.title?.toLowerCase().includes(k)))
//       .map(a => ({
//         title: a.title,
//         link: a.url,
//         summary: a.summary || '',
//         source: a.source_name || 'API',
//         timestamp: a.publishedAt
//       }));
//   } catch (err) {
//     console.warn(`⚠️ Free API fetch failed: ${err.message}`);
//     return [];
//   }
// }

// // --- Optional Telegram integration stub ---
// async function fetchFromTelegram() {
//   // Not activated yet – placeholder for future Telegram RSS
//   return [];
// }

// // --- Aggregate all sources ---
// async function scrapeAllSources() {
//   const [rss, api, tg] = await Promise.all([
//     fetchFromRSS(),
//     fetchFromApi(),
//     fetchFromTelegram()
//   ]);
//   return [...rss, ...api, ...tg];
// }

// // --- API: aggregated news ---
// app.get('/api/news', async (req, res) => {
//   const cached = newsCache.get('news');
//   if (cached) return res.json(cached);

//   try {
//     const data = await scrapeAllSources();
//     newsCache.set('news', data);
//     res.json(data);
//   } catch (err) {
//     console.error('🛠️ ScrapeAll error:', err.message);
//     res.status(500).json({ error: 'Failed to fetch news' });
//   }
// });

// // --- PDF download route ---
// app.get('/api/news/pdf', async (req, res) => {
//   const data = newsCache.get('news') || await scrapeAllSources();
//   const doc = new PDFDocument();
//   const stream = new Readable().wrap(doc);

//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', 'attachment; filename="security_intel_report.pdf"');

//   doc.fontSize(20).text('🛰️ Nigeria Security Incident Report', { align: 'center' }).moveDown();

//   if (!data.length) {
//     doc.fontSize(12).text('No relevant incidents found.');
//   } else {
//     data.forEach((a, i) => {
//       doc.fontSize(14).text(`${i + 1}. ${a.title}`, { underline: true });
//       doc.fontSize(10).fillColor('blue').text(a.link);
//       doc.fontSize(12).fillColor('black').text(a.summary).moveDown();
//     });
//   }

//   doc.end();
//   stream.pipe(res);
// });

// // --- Root page ---
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // --- Error handlers ---
// app.use((req, res) => res.status(404).send('🚫 Page not found'));
// app.use((err, req, res, next) => {
//   console.error('💥 Server Error:', err);
//   res.status(500).send('Server error');
// });

// // --- Launch ---
// app.listen(port, () => console.log(`✅ Server listening on http://localhost:${port}`));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// server.js - Enhanced with Grok AI Integration

// ✅ 1. Load environment variables FIRST
require('dotenv').config();
const express = require('express');
const PDFReportService = require('./pdfReportService');
const pdfService = new PDFReportService();
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const RSSParser = require('rss-parser');
const NodeCache = require('node-cache');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');
const fs = require('fs');
const sharp = require('sharp');
const GroqService = require('./groqService');

const app = express();
const port = 3000;

// ✅ 3. Initialize Groq service (no hardcoded key!)
const groqService = new GroqService(process.env.GROQ_API_KEY);

// ✅ 4. Continue with the rest of your server code...
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Cache for 15 minutes
const newsCache = new NodeCache({ stdTTL: 900 });
const addWeeklySummaryRoute = require('./WeeklyReport');
addWeeklySummaryRoute(app, newsCache, scrapeAllSources);

// Keywords to filter
const keywords = [
  'bandits','kidnap','gunmen','violence','attack','boko haram',
  'herdsmen','militants','conflict','bomb','suicide','terror','raid',
  'ipob','esn','insurgents','abduction','shooting'
];

const parser = new RSSParser();

// RSS feeds
const rssFeeds = [
  'https://guardian.ng/feed/',
  'https://www.premiumtimesng.com/feed',
  'https://dailypost.ng/feed'
];

async function fetchFromRSS() {
  const items = [];
  for (const url of rssFeeds) {
    try {
      const response = await axios.get(url, { responseType: 'text' });
      const sanitized = response.data.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;');
      const feed = await parser.parseString(sanitized);

      feed.items.forEach(item => {
        const text = (item.contentSnippet || item.content || '') + ' ' + item.title;
        if (keywords.some(k => text.toLowerCase().includes(k))) {
          items.push({
            title: item.title,
            link: item.link,
            summary: item.contentSnippet || '',
            source: feed.title,
            timestamp: item.pubDate || item.isoDate
          });
        }
      });
    } catch (err) {
      console.warn(`⚠️ RSS fetch failed (${url}): ${err.message}`);
    }
  }
  return items;
}

// Free News API
const WORLDNEWS_URL = 'https://api.worldnewsapi.com/search-news?source-country=ng&language=en&number=50&api-key=demo';
async function fetchFromApi() {
  try {
    const resp = await axios.get(WORLDNEWS_URL);
    const articles = resp.data.articles || [];
    return articles
      .filter(a => keywords.some(k => a.summary?.toLowerCase().includes(k) || a.title?.toLowerCase().includes(k)))
      .map(a => ({
        title: a.title,
        link: a.url,
        summary: a.summary || '',
        source: a.source_name || 'WorldNewsAPI',
        timestamp: a.publishedAt
      }));
  } catch (err) {
    console.warn(`⚠️ Free API fetch failed: ${err.message}`);
    return [];
  }
}

async function fetchFromTelegram() {
  return [];
}

// Aggregate all sources
async function scrapeAllSources() {
  const [rss, api, tg] = await Promise.all([
    fetchFromRSS(),
    fetchFromApi(),
    fetchFromTelegram()
  ]);
  return [...rss, ...api, ...tg];
}

// === ORIGINAL ENDPOINTS ===

app.get('/api/news', async (req, res) => {
  const cached = newsCache.get('news');
  if (cached) return res.json(cached);

  try {
    const data = await scrapeAllSources();
    newsCache.set('news', data);
    res.json(data);
  } catch (err) {
    console.error('🛠️ ScrapeAll error:', err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});


// === 🆕 GROK-ENHANCED ENDPOINTS ===

// Enhanced news with AI classification
// Enhanced news with AI classification
app.get('/api/news/enhanced', async (req, res) => {
  try {
    const cached = newsCache.get('enriched_news');
    if (cached) return res.json(cached);

    const rawNews = newsCache.get('news') || await scrapeAllSources();
    
    console.log('🤖 Enriching incidents with Groq AI...');
    // ✅ FIXED: Using groqService consistently
    const enrichedNews = await groqService.enrichIncidentData(rawNews);
    
    newsCache.set('enriched_news', enrichedNews, 1800);
    res.json(enrichedNews);
  } catch (err) {
    console.error('❌ Enrichment error:', err.message);
    res.status(500).json({ error: 'Failed to enrich news data' });
  }
});
// AI-generated executive briefing
// AI-generated executive briefing
// AI-generated executive briefing
app.get('/api/briefing/weekly', async (req, res) => {
  try {
    const news = newsCache.get('news') || await scrapeAllSources();
    const statesResponse = await axios.get('http://localhost:3000/api/affected-states');
    const stats = await axios.get('http://localhost:3000/api/incident-summary').then(r => r.data);
    
    console.log('🤖 Generating AI briefing...');
    // ✅ FIXED: Using groqService consistently
    const briefing = await groqService.generateWeeklyBriefing(
      stats,
      news,
      statesResponse.data.affected
    );
    
    res.json({ 
      briefing, 
      generatedAt: new Date(),
      stats,
      affectedStates: statesResponse.data.affected.length
    });
  } catch (err) {
    console.error('❌ Briefing generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate briefing' });
  }
});

// State-specific risk assessment
// State-specific risk assessment
// State-specific risk assessment
app.get('/api/risk/:state', async (req, res) => {
  try {
    const news = newsCache.get('news') || await scrapeAllSources();
    
    console.log(`🤖 Analyzing risk for ${req.params.state}...`);
    // ✅ FIXED: Using groqService consistently
    const assessment = await groqService.generateStateRiskAssessment(
      req.params.state,
      news
    );
    
    res.json(assessment);
  } catch (err) {
    console.error('❌ Risk assessment error:', err.message);
    res.status(500).json({ error: 'Failed to generate risk assessment' });
  }
});


// Pattern detection and trend analysis
// Pattern detection and trend analysis
// Pattern detection and trend analysis
app.get('/api/patterns', async (req, res) => {
  try {
    const currentWeek = newsCache.get('news') || await scrapeAllSources();
    const previousWeek = newsCache.get('previous_week_news') || [];
    
    if (previousWeek.length === 0) {
      return res.json({ 
        message: 'Insufficient historical data for pattern detection. Check back next week.',
        currentWeekIncidents: currentWeek.length
      });
    }
    
    console.log('🤖 Detecting patterns...');
    // ✅ FIXED: Using groqService consistently
    const patterns = await groqService.detectPatterns(currentWeek, previousWeek);
    
    res.json({ 
      patterns, 
      analyzedAt: new Date(),
      comparedWeeks: {
        current: currentWeek.length,
        previous: previousWeek.length
      }
    });
  } catch (err) {
    console.error('❌ Pattern detection error:', err.message);
    res.status(500).json({ error: 'Failed to detect patterns' });
  }
});


// Generate alert for specific incident
app.post('/api/alert/generate', async (req, res) => {
  try {
    const { incident } = req.body;
    
    if (!incident || !incident.title) {
      return res.status(400).json({ error: 'Invalid incident data' });
    }
    
    console.log('🤖 Generating alert...');
    // ✅ FIXED: Using groqService consistently
    const alert = await groqService.generateAlert(incident);
    
    res.json({ alert, generatedAt: new Date() });
  } catch (err) {
    console.error('❌ Alert generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate alert' });
  }
});

// Batch classify multiple incidents

// Batch classify multiple incidents (FIXED)
app.post('/api/classify/batch', async (req, res) => {
  try {
    const { incidents } = req.body;
    
    if (!Array.isArray(incidents)) {
      return res.status(400).json({ error: 'Incidents must be an array' });
    }
    
    console.log(`🤖 Classifying ${incidents.length} incidents...`);
    
    const classified = await Promise.all(
      incidents.map(async (incident) => {
        try {
          // ✅ FIXED: Using groqService consistently
          const classification = await groqService.classifyIncident(
            incident.title,
            incident.summary
          );
          return { ...incident, classification };
        } catch (err) {
          return { ...incident, classification: null, error: err.message };
        }
      })
    );
    
    res.json({ classified, processedAt: new Date() });
  } catch (err) {
    console.error('❌ Batch classification error:', err.message);
    res.status(500).json({ error: 'Failed to classify incidents' });
  }
});
// === ORIGINAL ENDPOINTS (kept for compatibility) ===

// ===== PDF REPORT ENDPOINTS =====

/**
 * 1. Generate and Download PDF Report
 */
app.get('/api/reports/generate', async (req, res) => {
  try {
    const { type = 'weekly' } = req.query;
    
    console.log(`📄 Generating ${type} PDF report...`);

    // Fetch all necessary data
    const [news, affectedStates, incidentSummary] = await Promise.all([
      scrapeAllSources(),
      axios.get('http://localhost:3000/api/affected-states').then(r => r.data),
      axios.get('http://localhost:3000/api/incident-summary').then(r => r.data)
    ]);

    // Get AI briefing if available
    let aiBriefing = '';
    try {
      const briefingRes = await axios.get('http://localhost:3000/api/briefing/weekly');
      aiBriefing = briefingRes.data.briefing;
    } catch (err) {
      console.warn('⚠️ AI briefing unavailable:', err.message);
    }

    // Get state risk analyses
    const stateRiskAnalyses = [];
    const topStates = affectedStates.affected?.slice(0, 5) || [];
    for (const stateCode of topStates) {
      try {
        const stateName = getStateNameFromCode(stateCode);
        const riskRes = await axios.get(`http://localhost:3000/api/risk/${stateName}`);
        stateRiskAnalyses.push(riskRes.data);
      } catch (err) {
        console.warn(`⚠️ Risk analysis unavailable for ${stateCode}`);
      }
    }

    // Get pattern analysis
    let patternAnalysis = '';
    try {
      const patternRes = await axios.get('http://localhost:3000/api/patterns');
      patternAnalysis = patternRes.data.patterns;
    } catch (err) {
      console.warn('⚠️ Pattern analysis unavailable:', err.message);
    }

    // Prepare data for PDF
    const reportData = {
      incidents: news,
      aiBriefing,
      statesAffected: affectedStates.affected?.length || 0,
      affectedStates: affectedStates.affected || [],
      casualties: incidentSummary.fatalities || 0,
      abductions: incidentSummary.abducted || 0,
      stateRiskAnalyses,
      patternAnalysis,
      keywordCounts: analyzeKeywords(news),
      timeline: analyzeTimeline(news),
      categories: analyzeCategories(news),
      recommendations: generateRecommendations(news, stateRiskAnalyses)
    };

    // Generate PDF
    const doc = await pdfService.generateEnhancedReport(reportData, {
      includeAIAnalysis: true,
      includeCharts: true,
      includeMap: true,
      reportType: type
    });

    // Set response headers
    const filename = `suntrenia-report-${type}-${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream PDF to response
    doc.pipe(res);

    console.log('✅ PDF report generated successfully');
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF report', details: error.message });
  }
});

/**
 * 2. Generate and Email PDF Report
 */
app.post('/api/reports/email', async (req, res) => {
  try {
    const { email, reportType = 'weekly' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log(`📧 Generating and emailing report to: ${email}`);

    // Fetch data (same as download endpoint)
    const [news, affectedStates, incidentSummary] = await Promise.all([
      scrapeAllSources(),
      axios.get('http://localhost:3000/api/affected-states').then(r => r.data),
      axios.get('http://localhost:3000/api/incident-summary').then(r => r.data)
    ]);

    let aiBriefing = '';
    try {
      const briefingRes = await axios.get('http://localhost:3000/api/briefing/weekly');
      aiBriefing = briefingRes.data.briefing;
    } catch (err) {
      console.warn('⚠️ AI briefing unavailable');
    }

    const reportData = {
      incidents: news,
      aiBriefing,
      statesAffected: affectedStates.affected?.length || 0,
      affectedStates: affectedStates.affected || [],
      casualties: incidentSummary.fatalities || 0,
      abductions: incidentSummary.abducted || 0,
      keywordCounts: analyzeKeywords(news),
      timeline: analyzeTimeline(news),
      categories: analyzeCategories(news)
    };

    // Generate PDF
    const doc = await pdfService.generateEnhancedReport(reportData, {
      includeAIAnalysis: true,
      includeCharts: true,
      reportType
    });

    // Convert to buffer
    const pdfBuffer = await pdfService.streamToBuffer(doc);

    // Send email
    const result = await pdfService.sendReportEmail(
      email,
      pdfBuffer,
      `suntrenia-report-${reportType}-${Date.now()}.pdf`
    );

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Report sent successfully to ' + email,
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send email', 
        details: result.error 
      });
    }

  } catch (error) {
    console.error('❌ Email report error:', error);
    res.status(500).json({ error: 'Failed to send report', details: error.message });
  }
});

/**
 * 3. Subscribe to Automated Reports
 */
app.post('/api/reports/subscribe', async (req, res) => {
  try {
    const { email, frequency = 'weekly', name = '' } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Store subscriber in database (implement your DB logic)
    // For now, we'll just log it
    console.log(`📬 New subscriber: ${email} (${frequency})`);

    // TODO: Save to database
    // await saveSubscriber({ email, frequency, name, subscribedAt: new Date() });

    res.json({ 
      success: true, 
      message: `Successfully subscribed to ${frequency} reports`,
      email 
    });

  } catch (error) {
    console.error('❌ Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe', details: error.message });
  }
});

/**
 * 4. Unsubscribe from Reports
 */
app.post('/api/reports/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    console.log(`📭 Unsubscribing: ${email}`);

    // TODO: Remove from database
    // await removeSubscriber(email);

    res.json({ 
      success: true, 
      message: 'Successfully unsubscribed from reports',
      email 
    });

  } catch (error) {
    console.error('❌ Unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe', details: error.message });
  }
});

/**
 * 5. Preview Report (without charts, for speed)
 */
app.get('/api/reports/preview', async (req, res) => {
  try {
    const news = await scrapeAllSources();
    
    const reportData = {
      incidents: news.slice(0, 10), // Preview only first 10
      statesAffected: 0,
      casualties: 0,
      abductions: 0,
      timeline: analyzeTimeline(news)
    };

    const doc = await pdfService.generateEnhancedReport(reportData, {
      includeAIAnalysis: false,
      includeCharts: false,
      includeMap: false,
      reportType: 'preview'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
    
    doc.pipe(res);

  } catch (error) {
    console.error('❌ Preview error:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

// ===== HELPER FUNCTIONS =====

function analyzeKeywords(news) {
  const keywords = [
    'bandits','kidnap','gunmen','violence','attack','boko haram',
    'herdsmen','militants','conflict','bomb','suicide','terror','raid',
    'ipob','esn','insurgents','abduction','shooting'
  ];

  const counts = {};
  news.forEach(item => {
    const content = (item.title + ' ' + item.summary).toLowerCase();
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        counts[keyword] = (counts[keyword] || 0) + 1;
      }
    });
  });

  return counts;
}

function analyzeTimeline(news) {
  const timeline = {};
  news.forEach(item => {
    const date = new Date(item.timestamp).toISOString().split('T')[0];
    timeline[date] = (timeline[date] || 0) + 1;
  });
  return timeline;
}

function analyzeCategories(news) {
  const categories = {
    'Kidnapping': 0,
    'Banditry': 0,
    'Terrorism': 0,
    'Communal Violence': 0,
    'Other': 0
  };

  news.forEach(item => {
    const content = (item.title + ' ' + item.summary).toLowerCase();
    
    if (content.includes('kidnap') || content.includes('abduct')) {
      categories['Kidnapping']++;
    } else if (content.includes('bandit')) {
      categories['Banditry']++;
    } else if (content.includes('boko') || content.includes('iswap') || content.includes('ipob')) {
      categories['Terrorism']++;
    } else if (content.includes('herdsmen') || content.includes('communal')) {
      categories['Communal Violence']++;
    } else {
      categories['Other']++;
    }
  });

  return categories;
}

function generateRecommendations(news, stateAnalyses) {
  const recommendations = [
    'Increase security presence in high-risk states identified in this report',
    'Enhance intelligence gathering and sharing mechanisms between agencies',
    'Implement community-based security initiatives in affected areas',
    'Deploy advanced surveillance technologies in identified hotspots',
    'Strengthen border security in states with cross-border threats'
  ];

  // Add dynamic recommendations based on data
  if (stateAnalyses.length > 0) {
    const highRiskStates = stateAnalyses.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical');
    if (highRiskStates.length > 0) {
      recommendations.push(`Priority attention required for: ${highRiskStates.map(s => s.stateName).join(', ')}`);
    }
  }

  return recommendations;
}

function getStateNameFromCode(code) {
  const stateMap = {
    'NG-AB': 'Abia', 'NG-AD': 'Adamawa', 'NG-AK': 'Akwa Ibom', 'NG-AN': 'Anambra',
    'NG-BA': 'Bauchi', 'NG-BE': 'Benue', 'NG-BO': 'Borno', 'NG-BY': 'Bayelsa',
    'NG-CR': 'Cross River', 'NG-DE': 'Delta', 'NG-EB': 'Ebonyi', 'NG-ED': 'Edo',
    'NG-EK': 'Ekiti', 'NG-EN': 'Enugu', 'NG-FC': 'FCT', 'NG-GO': 'Gombe',
    'NG-IM': 'Imo', 'NG-JI': 'Jigawa', 'NG-KD': 'Kaduna', 'NG-KE': 'Kebbi',
    'NG-KN': 'Kano', 'NG-KO': 'Kogi', 'NG-KT': 'Katsina', 'NG-KW': 'Kwara',
    'NG-LA': 'Lagos', 'NG-NA': 'Nasarawa', 'NG-NI': 'Niger', 'NG-OG': 'Ogun',
    'NG-ON': 'Ondo', 'NG-OS': 'Osun', 'NG-OY': 'Oyo', 'NG-PL': 'Plateau',
    'NG-RI': 'Rivers', 'NG-SO': 'Sokoto', 'NG-TA': 'Taraba', 'NG-YO': 'Yobe',
    'NG-ZA': 'Zamfara'
  };
  return stateMap[code] || code;
}

app.get('/api/affected-states', async (req, res) => {
  const news = newsCache.get('news') || await scrapeAllSources();
  
  const stateKeywords = {
    'NG-AB': ['abia'],
    'NG-AD': ['adamawa'],
    'NG-AK': ['akwa ibom','akwaibom'],
    'NG-AN': ['anambra'],
    'NG-BA': ['bauchi'],
    'NG-BE': ['benue'],
    'NG-BO': ['borno'],
    'NG-BY': ['bayelsa'],
    'NG-CR': ['cross river','cross‑river'],
    'NG-DE': ['delta'],
    'NG-EB': ['ebonyi'],
    'NG-ED': ['edo'],
    'NG-EK': ['ekiti'],
    'NG-EN': ['enugu'],
    'NG-FC': ['fct','abuja','abuja fct'],
    'NG-GO': ['gombe'],
    'NG-IM': ['imo'],
    'NG-JI': ['jigawa'],
    'NG-KD': ['kaduna'],
    'NG-KE': ['kebbi'],
    'NG-KN': ['kano'],
    'NG-KO': ['kogi'],
    'NG-KT': ['katsina'],
    'NG-KW': ['kwara'],
    'NG-LA': ['lagos'],
    'NG-NA': ['nassarawa','nasarawa'],
    'NG-NI': ['niger'],
    'NG-OG': ['ogun'],
    'NG-ON': ['ondo'],
    'NG-OS': ['osun'],
    'NG-OY': ['oyo'],
    'NG-PL': ['plateau'],
    'NG-RI': ['rivers'],
    'NG-SO': ['sokoto'],
    'NG-TA': ['taraba'],
    'NG-YO': ['yobe'],
    'NG-ZA': ['zamfara']
  };

  const affected = new Set();

  for (const article of news) {
    const content = (article.title + ' ' + article.summary).toLowerCase();
    for (const [stateId, terms] of Object.entries(stateKeywords)) {
      if (terms.some(t => content.includes(t))) {
        affected.add(stateId);
      }
    }
  }

  res.json({ affected: Array.from(affected) });
});

const QuickChart = require('quickchart-js');

app.get('/api/incident-summary', async (req, res) => {
  const news = newsCache.get('news') || await scrapeAllSources();
  
  const incidents = news.length;
  const abducted = news.filter(item => 
    (item.title + item.summary).toLowerCase().includes('kidnap') ||
    (item.title + item.summary).toLowerCase().includes('abduct')
  ).length;
  
  const fatalities = news.filter(item => 
    (item.title + item.summary).toLowerCase().includes('kill') ||
    (item.title + item.summary).toLowerCase().includes('death') ||
    (item.title + item.summary).toLowerCase().includes('dead')
  ).length * 3;
  
  const statesResponse = await axios.get('http://localhost:3000/api/affected-states');
  const statesAffected = statesResponse.data.affected.length;
  
  res.json({
    incidents,
    abducted,
    fatalities,
    statesAffected
  });
});

// Helper to fetch chart image as buffer
const getImageBuffer = async (url) => {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(res.data, 'binary');
};

// 🆕 Enhanced PDF with AI-generated insights
// 🆕 Enhanced PDF with AI-generated insights (FIXED)
app.get('/api/news/pdf-enhanced', async (req, res) => {
  try {
    const data = newsCache.get('enriched_news') || newsCache.get('news') || await scrapeAllSources();
    // ✅ FIXED: Using groqService consistently
    const briefing = await groqService.generateWeeklyBriefing(
      { fatalities: 0, abducted: 0 },
      data,
      []
    );
    
    const doc = new PDFDocument({ margin: 40 });
    const stream = new Readable().wrap(doc);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="ai_enhanced_report.pdf"');

    doc.fontSize(22).text('🛰️ SUNTRENIA AI-ENHANCED SECURITY REPORT', { align: 'center' });
    doc.fontSize(12).text('Powered by Groq AI', { align: 'center' }).moveDown(2);

    // AI Executive Summary
    doc.fontSize(16).text('📋 EXECUTIVE BRIEFING', { underline: true }).moveDown();
    doc.fontSize(11).text(briefing).moveDown(2);

    // Rest of your existing PDF code...
    doc.addPage();
    doc.fontSize(16).text('🗒️ DETAILED INCIDENTS', { underline: true }).moveDown();
    
    data.slice(0, 15).forEach((item, index) => {
      doc.fontSize(13).text(`${index + 1}. ${item.title}`, { underline: true });
      
      if (item.aiClassification) {
        doc.fontSize(10).fillColor('red').text(`Category: ${item.aiClassification} | Severity: ${item.severity}`);
      }
      
      doc.fontSize(10).fillColor('blue').text(item.link, { link: item.link });
      doc.fontSize(11).fillColor('black').text(item.summary).moveDown();
    });

    doc.end();
    stream.pipe(res);
  } catch (err) {
    console.error('❌ PDF generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});


// === Launch ===
app.listen(port, () => {
  console.log(`✅ Server listening on http://localhost:${port}`);
  console.log(`🤖 Groq AI integration: ${process.env.GROQ_API_KEY ? 'ENABLED' : 'DISABLED (set GROQ_API_KEY)'}`);
});
