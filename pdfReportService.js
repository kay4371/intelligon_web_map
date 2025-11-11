// pdfReportService.js - Complete PDF Report Generation & Delivery System
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const axios = require('axios');
const QuickChart = require('quickchart-js');

class PDFReportService {
  constructor() {
    // Configure email transporter
    this.emailTransporter = nodemailer.createTransport({
      service: 'gmail', // or 'outlook', 'yahoo', etc.
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASSWORD // your app password
      }
    });
  }

  /**
   * Generate comprehensive AI-enhanced PDF report
   */
  async generateEnhancedReport(data, options = {}) {
    const {
      includeAIAnalysis = true,
      includeCharts = true,
      includeMap = true,
      reportType = 'weekly' // 'weekly', 'daily', 'custom'
    } = options;

    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50,
      info: {
        Title: 'Suntrenia Security Intelligence Report',
        Author: 'Suntrenia AI',
        Subject: 'Nigeria Security Analysis',
        Keywords: 'security, intelligence, Nigeria, AI'
      }
    });

    // === COVER PAGE ===
    this.addCoverPage(doc, reportType);
    
    // === EXECUTIVE SUMMARY ===
    if (includeAIAnalysis) {
      await this.addExecutiveSummary(doc, data);
    }

    // === STATISTICS DASHBOARD ===
    this.addStatisticsDashboard(doc, data);

    // === CHARTS & VISUALIZATIONS ===
    if (includeCharts) {
      await this.addCharts(doc, data);
    }

    // === MAP VISUALIZATION ===
    if (includeMap) {
      await this.addMapVisualization(doc, data);
    }

    // === AI-ENHANCED INCIDENT DETAILS ===
    this.addIncidentDetails(doc, data);

    // === STATE-BY-STATE ANALYSIS ===
    await this.addStateAnalysis(doc, data);

    // === PATTERN DETECTION ===
    await this.addPatternAnalysis(doc, data);

    // === RECOMMENDATIONS ===
    this.addRecommendations(doc, data);

    // === FOOTER & METADATA ===
    this.addFooter(doc);

    return doc;
  }

  /**
   * Cover Page
   */
  addCoverPage(doc, reportType) {
    doc.fontSize(32)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('SUNTRENIA', { align: 'center' });
    
    doc.moveDown(0.5);
    doc.fontSize(24)
       .fillColor('#3498db')
       .text('Security Intelligence Report', { align: 'center' });
    
    doc.moveDown(1);
    doc.fontSize(16)
       .fillColor('#7f8c8d')
       .text(`${reportType.toUpperCase()} ANALYSIS`, { align: 'center' });
    
    doc.moveDown(0.5);
    doc.fontSize(12)
       .text(`Generated: ${new Date().toLocaleString('en-US', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
       })}`, { align: 'center' });

    // Add logo or watermark
    doc.moveDown(2);
    doc.fontSize(10)
       .fillColor('#95a5a6')
       .text('🛰️ Powered by Grok AI', { align: 'center' });
    
    doc.addPage();
  }

  /**
   * Executive Summary (AI-Generated)
   */
  async addExecutiveSummary(doc, data) {
    doc.fontSize(20)
       .fillColor('#2c3e50')
       .text('📋 EXECUTIVE SUMMARY', { underline: true });
    
    doc.moveDown(1);

    // Get AI-generated briefing
    const briefing = data.aiBriefing || 'No AI briefing available';
    
    doc.fontSize(11)
       .fillColor('#34495e')
       .text(briefing, {
         align: 'justify',
         lineGap: 4
       });

    doc.moveDown(2);
  }

  /**
   * Statistics Dashboard
   */
  addStatisticsDashboard(doc, data) {
    doc.fontSize(18)
       .fillColor('#2c3e50')
       .text('📊 KEY STATISTICS', { underline: true });
    
    doc.moveDown(1);

    const stats = [
      { label: 'Total Incidents', value: data.incidents?.length || 0, color: '#e74c3c' },
      { label: 'States Affected', value: data.statesAffected || 0, color: '#e67e22' },
      { label: 'Estimated Casualties', value: data.casualties || 0, color: '#c0392b' },
      { label: 'Abductions', value: data.abductions || 0, color: '#d35400' }
    ];

    const boxWidth = 120;
    const boxHeight = 80;
    const spacing = 20;
    let xPos = 50;
    const yPos = doc.y;

    stats.forEach((stat, i) => {
      // Draw stat box
      doc.rect(xPos, yPos, boxWidth, boxHeight)
         .fillAndStroke(stat.color, '#34495e');
      
      // Add value
      doc.fontSize(24)
         .fillColor('#ffffff')
         .text(stat.value, xPos, yPos + 20, {
           width: boxWidth,
           align: 'center'
         });
      
      // Add label
      doc.fontSize(10)
         .text(stat.label, xPos, yPos + 50, {
           width: boxWidth,
           align: 'center'
         });

      xPos += boxWidth + spacing;
    });

    doc.moveDown(6);
  }

  /**
   * Add Charts
   */
  async addCharts(doc, data) {
    doc.addPage();
    doc.fontSize(18)
       .fillColor('#2c3e50')
       .text('📈 VISUAL ANALYTICS', { underline: true });
    
    doc.moveDown(1);

    try {
      // Generate charts using QuickChart
      const keywordChartUrl = await this.generateChart(
        'bar',
        'Incidents by Keyword',
        data.keywordCounts || {}
      );

      const timelineChartUrl = await this.generateChart(
        'line',
        'Incident Timeline',
        data.timeline || {}
      );

      const categoryChartUrl = await this.generateChart(
        'pie',
        'Incident Categories',
        data.categories || {}
      );

      // Add charts to PDF
      const keywordImg = await this.fetchImageBuffer(keywordChartUrl);
      doc.image(keywordImg, { width: 500 }).moveDown(1);

      doc.image(await this.fetchImageBuffer(timelineChartUrl), { width: 500 }).moveDown(1);
      
      doc.addPage();
      doc.image(await this.fetchImageBuffer(categoryChartUrl), { width: 400 }).moveDown(1);

    } catch (error) {
      console.error('Chart generation error:', error);
      doc.fontSize(10)
         .fillColor('#e74c3c')
         .text('⚠️ Chart generation failed', { align: 'center' });
    }
  }

  /**
   * Add Map Visualization
   */
  async addMapVisualization(doc, data) {
    doc.addPage();
    doc.fontSize(18)
       .fillColor('#2c3e50')
       .text('🗺️ GEOGRAPHIC DISTRIBUTION', { underline: true });
    
    doc.moveDown(1);

    try {
      // If you have a pre-generated map image
      const mapPath = path.join(__dirname, 'public', 'nigeria-map-highlighted.png');
      
      if (fs.existsSync(mapPath)) {
        doc.image(mapPath, { width: 500 }).moveDown(1);
      } else {
        doc.fontSize(10)
           .fillColor('#7f8c8d')
           .text('Map visualization not available', { align: 'center' });
      }

      // List affected states
      doc.moveDown(1);
      doc.fontSize(12)
         .fillColor('#34495e')
         .text('Affected States:', { underline: true });
      
      doc.fontSize(10);
      const statesList = (data.affectedStates || []).join(', ');
      doc.text(statesList, { align: 'justify' });

    } catch (error) {
      console.error('Map visualization error:', error);
    }

    doc.moveDown(2);
  }

  /**
   * Incident Details
   */
  addIncidentDetails(doc, data) {
    doc.addPage();
    doc.fontSize(18)
       .fillColor('#2c3e50')
       .text('🗒️ DETAILED INCIDENT ANALYSIS', { underline: true });
    
    doc.moveDown(1);

    const incidents = data.incidents || [];
    
    if (incidents.length === 0) {
      doc.fontSize(11).text('No incidents to report.');
      return;
    }

    incidents.slice(0, 15).forEach((incident, i) => {
      // Check if we need a new page
      if (doc.y > 700) {
        doc.addPage();
      }

      // Incident number and title
      doc.fontSize(12)
         .fillColor('#2c3e50')
         .font('Helvetica-Bold')
         .text(`${i + 1}. ${incident.title}`);
      
      // Severity badge
      if (incident.severity) {
        const severityColors = {
          'Critical': '#c0392b',
          'High': '#e74c3c',
          'Medium': '#f39c12',
          'Low': '#27ae60'
        };
        
        doc.fontSize(9)
           .fillColor(severityColors[incident.severity] || '#7f8c8d')
           .text(`  ● ${incident.severity} Severity`);
      }

      // Category
      if (incident.aiClassification) {
        doc.fontSize(9)
           .fillColor('#3498db')
           .text(`  📌 ${incident.aiClassification}`);
      }

      // Summary
      doc.fontSize(10)
         .fillColor('#34495e')
         .font('Helvetica')
         .text(incident.summary, { align: 'justify' });

      // Casualties
      if (incident.casualties) {
        doc.fontSize(9)
           .fillColor('#e74c3c')
           .text(`  💀 Casualties: Deaths: ${incident.casualties.deaths || 0}, Injuries: ${incident.casualties.injuries || 0}, Abducted: ${incident.casualties.abducted || 0}`);
      }

      // Perpetrators
      if (incident.perpetrators) {
        doc.fontSize(9)
           .fillColor('#7f8c8d')
           .text(`  👥 Perpetrators: ${incident.perpetrators}`);
      }

      // Source link
      doc.fontSize(8)
         .fillColor('#3498db')
         .text(`  🔗 Source: ${incident.link}`, { link: incident.link });

      doc.moveDown(1);
    });
  }

  /**
   * State-by-State Analysis
   */
  async addStateAnalysis(doc, data) {
    doc.addPage();
    doc.fontSize(18)
       .fillColor('#2c3e50')
       .text('🏛️ STATE-BY-STATE RISK ASSESSMENT', { underline: true });
    
    doc.moveDown(1);

    const stateAnalyses = data.stateRiskAnalyses || [];

    if (stateAnalyses.length === 0) {
      doc.fontSize(11).text('No state-specific analysis available.');
      return;
    }

    stateAnalyses.forEach((analysis, i) => {
      if (doc.y > 650) doc.addPage();

      // State name
      doc.fontSize(14)
         .fillColor('#2c3e50')
         .font('Helvetica-Bold')
         .text(analysis.stateName);

      // Risk level with color
      const riskColors = {
        'Critical': '#c0392b',
        'High': '#e74c3c',
        'Medium': '#f39c12',
        'Low': '#27ae60'
      };

      doc.fontSize(11)
         .fillColor(riskColors[analysis.riskLevel] || '#7f8c8d')
         .text(`Risk Level: ${analysis.riskLevel}`);

      // Incident count
      doc.fontSize(10)
         .fillColor('#34495e')
         .font('Helvetica')
         .text(`Incidents Reported: ${analysis.incidentCount}`);

      // AI Analysis
      doc.fontSize(9)
         .text(analysis.analysis, { align: 'justify' });

      doc.moveDown(1.5);
    });
  }

  /**
   * Pattern Analysis
   */
  async addPatternAnalysis(doc, data) {
    doc.addPage();
    doc.fontSize(18)
       .fillColor('#2c3e50')
       .text('🔍 PATTERN DETECTION & TRENDS', { underline: true });
    
    doc.moveDown(1);

    if (data.patternAnalysis) {
      doc.fontSize(11)
         .fillColor('#34495e')
         .text(data.patternAnalysis, { align: 'justify' });
    } else {
      doc.fontSize(11).text('Pattern analysis not available.');
    }

    doc.moveDown(2);
  }

  /**
   * Recommendations
   */
  addRecommendations(doc, data) {
    doc.addPage();
    doc.fontSize(18)
       .fillColor('#2c3e50')
       .text('💡 RECOMMENDATIONS', { underline: true });
    
    doc.moveDown(1);

    const recommendations = data.recommendations || [
      'Increase security presence in high-risk states',
      'Enhance intelligence gathering and sharing mechanisms',
      'Implement community-based security initiatives',
      'Strengthen inter-agency coordination',
      'Deploy advanced surveillance technologies in hotspots'
    ];

    recommendations.forEach((rec, i) => {
      doc.fontSize(11)
         .fillColor('#34495e')
         .text(`${i + 1}. ${rec}`, { align: 'justify' });
      doc.moveDown(0.5);
    });

    doc.moveDown(2);
  }

  /**
   * Footer
   */
  addFooter(doc) {
    doc.fontSize(8)
       .fillColor('#95a5a6')
       .text('_______________________________________________', { align: 'center' });
    
    doc.text('This report is generated by Suntrenia AI Security Intelligence Platform', { align: 'center' });
    doc.text('For inquiries: contact@suntrenia.com | www.suntrenia.com', { align: 'center' });
    doc.text(`Report ID: ${Date.now()} | Confidential`, { align: 'center' });
  }

  /**
   * Generate Chart using QuickChart
   */
  async generateChart(type, label, dataObj) {
    const chart = new QuickChart();
    chart.setConfig({
      type,
      data: {
        labels: Object.keys(dataObj),
        datasets: [{
          label,
          data: Object.values(dataObj),
          backgroundColor: type === 'pie' 
            ? ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
            : '#3498db',
          borderColor: '#2c3e50',
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: label
          }
        }
      }
    });
    chart.setWidth(500).setHeight(300);
    return await chart.getShortUrl();
  }

  /**
   * Fetch image as buffer
   */
  async fetchImageBuffer(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  }

  /**
   * Send Report via Email
   */
  async sendReportEmail(recipientEmail, pdfBuffer, reportName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `Suntrenia Security Report - ${new Date().toLocaleDateString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">🛰️ Suntrenia Security Intelligence Report</h2>
            <p>Dear Subscriber,</p>
            <p>Please find attached your latest security intelligence report for Nigeria.</p>
            <div style="background: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3498db;">Report Summary</h3>
              <ul>
                <li><strong>Report Type:</strong> Weekly Analysis</li>
                <li><strong>Generated:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Powered by:</strong> Grok AI</li>
              </ul>
            </div>
            <p><strong>Key Features:</strong></p>
            <ul>
              <li>✅ AI-Enhanced Incident Classification</li>
              <li>✅ State-by-State Risk Assessment</li>
              <li>✅ Pattern Detection & Trend Analysis</li>
              <li>✅ Executive Summary & Recommendations</li>
            </ul>
            <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
              This is an automated report from Suntrenia AI Security Intelligence Platform.<br>
              For support, contact: support@suntrenia.com
            </p>
          </div>
        `,
        attachments: [{
          filename: reportName || 'suntrenia-security-report.pdf',
          content: pdfBuffer
        }]
      };

      const info = await this.emailTransporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Schedule automated reports
   */
  scheduleAutomatedReports(schedule = 'weekly') {
    const cron = require('node-cron');
    
    const schedules = {
      'daily': '0 8 * * *',      // Every day at 8 AM
      'weekly': '0 8 * * MON',   // Every Monday at 8 AM
      'monthly': '0 8 1 * *'     // 1st of every month at 8 AM
    };

    const cronSchedule = schedules[schedule] || schedules.weekly;

    cron.schedule(cronSchedule, async () => {
      console.log(`📅 Running scheduled ${schedule} report...`);
      
      try {
        // Fetch latest data
        const data = await this.fetchLatestData();
        
        // Generate report
        const doc = await this.generateEnhancedReport(data);
        
        // Convert to buffer
        const pdfBuffer = await this.streamToBuffer(doc);
        
        // Send to subscribers
        const subscribers = await this.getSubscribers();
        
        for (const subscriber of subscribers) {
          await this.sendReportEmail(
            subscriber.email,
            pdfBuffer,
            `suntrenia-${schedule}-report-${Date.now()}.pdf`
          );
        }
        
        console.log('✅ Automated reports sent successfully');
      } catch (error) {
        console.error('❌ Automated report error:', error);
      }
    });

    console.log(`✅ Scheduled ${schedule} reports enabled`);
  }

  /**
   * Helper: Stream to Buffer
   */
  streamToBuffer(doc) {
    return new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      doc.end();
    });
  }

  /**
   * Placeholder: Fetch latest data
   */
  async fetchLatestData() {
    // Implement your data fetching logic here
    return {
      incidents: [],
      aiBriefing: '',
      statesAffected: 0,
      casualties: 0,
      abductions: 0,
      // ... other data
    };
  }

  /**
   * Placeholder: Get subscribers
   */
  async getSubscribers() {
    // Fetch from database
    return [
      { email: 'user@example.com', name: 'User Name' }
    ];
  }
}

module.exports = PDFReportService;