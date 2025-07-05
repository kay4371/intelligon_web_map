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

// server.js (Full Implementation with Chart-based PDF Report)
const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const RSSParser = require('rss-parser');
const NodeCache = require('node-cache');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');
const fs = require('fs');
const sharp = require('sharp');

const app = express();
const port = 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

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

// --- Scrape RSS feeds ---
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
  

// --- Fallback Free News API (WorldNewsAPI) ---
const WORLDNEWS_URL = 'https://api.worldnewsapi.com/search-news?source-country=ng&language=en&number=50&api-key=demo'; // Replace demo with valid key
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

// --- Optional Telegram integration stub ---
async function fetchFromTelegram() {
  // Not activated yet – placeholder for future Telegram RSS
  return [];
}

// --- Aggregate all sources ---
async function scrapeAllSources() {
  const [rss, api, tg] = await Promise.all([
    fetchFromRSS(),
    fetchFromApi(),
    fetchFromTelegram()
  ]);
  return [...rss, ...api, ...tg];
}

// --- API: aggregated news ---
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

app.get('/api/affected-states', async (req, res) => {
    const news = newsCache.get('news') || await scrapeAllSources();
    
    // Map keywords to rough state mentions — simple example
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
        'NG-JI': [' Jigawa'.toLowerCase()],
        'NG-KD': ['kaduna'],
        'NG-KE': ['kebbi'],
        'NG-KN': ['kano'],
        'NG-KO': ['kogi'],
        'NG-KT': ['kastina','katsina'].map(s=>s.toLowerCase())[0] ? ['katsina'] : ['katsina'], // corrected
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
// Add to server.js
app.get('/api/incident-summary', async (req, res) => {
  const news = newsCache.get('news') || await scrapeAllSources();
  
  // Simple analysis - in a real app you'd want more sophisticated counting
  const incidents = news.length;
  const abducted = news.filter(item => 
    (item.title + item.summary).toLowerCase().includes('kidnap') ||
    (item.title + item.summary).toLowerCase().includes('abduct')
  ).length;
  
  const fatalities = news.filter(item => 
    (item.title + item.summary).toLowerCase().includes('kill') ||
    (item.title + item.summary).toLowerCase().includes('death') ||
    (item.title + item.summary).toLowerCase().includes('dead')
  ).length * 3; // Rough estimate
  
  const statesResponse = await axios.get('http://localhost:3000/api/affected-states');
  const statesAffected = statesResponse.data.affected.length;
  
  res.json({
    incidents,
    abducted,
    fatalities,
    statesAffected
  });
});
app.get('/api/news/pdf', async (req, res) => {
  const data = newsCache.get('news') || await scrapeAllSources();
  const doc = new PDFDocument({ margin: 40 });
  const stream = new Readable().wrap(doc);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="security_intel_report.pdf"');

  doc.fontSize(20).text('🛰️ Nigeria Security Intelligence Report', { align: 'center' }).moveDown(2);

  // === Generate Stats ===
  const keywordCounts = {};
  const sourceCounts = {};
  const dates = {};

  for (const item of data) {
    const content = (item.title + ' ' + item.summary).toLowerCase();
    keywords.forEach(k => {
      if (content.includes(k)) {
        keywordCounts[k] = (keywordCounts[k] || 0) + 1;
      }
    });

    const source = item.source || 'Unknown';
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;

    const date = new Date(item.timestamp).toISOString().split('T')[0];
    dates[date] = (dates[date] || 0) + 1;
  }

  const createChart = async (title, labels, data) => {
    const chart = new QuickChart();
    chart.setWidth(500);
    chart.setHeight(300);
    chart.setConfig({
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: title, data }]
      }
    });
    return await chart.getShortUrl();
  };

  const keywordChart = await createChart('Incidents by Keyword', Object.keys(keywordCounts), Object.values(keywordCounts));
  const sourceChart = await createChart('Incidents by Source', Object.keys(sourceCounts), Object.values(sourceCounts));
  const timelineChart = await createChart('Incidents Over Time', Object.keys(dates), Object.values(dates));

  // === Insert Charts ===
  doc.fontSize(16).text('📊 Data Visualization', { underline: true }).moveDown();
  doc.image(await getImageBuffer(keywordChart), { width: 400 }).moveDown();
  doc.image(await getImageBuffer(sourceChart), { width: 400 }).moveDown();
  doc.image(await getImageBuffer(timelineChart), { width: 400 }).moveDown();

  // === Detailed Incidents ===
  doc.addPage();
  doc.fontSize(16).text('🗒️ Incident Summaries', { underline: true }).moveDown();

  if (!data.length) {
    doc.fontSize(12).text('No relevant incidents found.');
  } else {
    data.forEach((item, index) => {
      doc.fontSize(14).text(`${index + 1}. ${item.title}`, { underline: true });
      doc.fontSize(10).fillColor('blue').text(item.link, { link: item.link });
      doc.fontSize(12).fillColor('black').text(item.summary).moveDown();
    });
  }


  const svgBuffer = fs.readFileSync(path.join(__dirname, 'public', 'nigeria-states.svg'));

  const pngBuffer = await sharp(svgBuffer)
    .resize({ width: 500 }) // Resize if needed
    .png()
    .toBuffer();
  
  // Now embed it in PDF
  doc.addPage();
  doc.fontSize(16).text('🗺️ Affected Areas Map', { underline: true }).moveDown();
  doc.image(pngBuffer, { width: 450 }).moveDown();
  



  doc.end();
  stream.pipe(res);
});

// Helper to fetch chart image as buffer
const getImageBuffer = async (url) => {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(res.data, 'binary');
};

// --- Launch ---
app.listen(port, () => console.log(`✅ Server listening on http://localhost:${port}`));
