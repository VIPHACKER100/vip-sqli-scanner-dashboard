const express = require('express');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// -------------------------------------------------------------------------
// MIDDLEWARE CONFIGURATION
// -------------------------------------------------------------------------

app.use(cors({
  origin: '*', // Allow all origins for this local tool
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(morgan('dev'));
app.use(express.json());

// -------------------------------------------------------------------------
// PROXY ENDPOINT :: MISSION CONTROL UNIT
// -------------------------------------------------------------------------

app.post('/proxy', async (req, res) => {
  const { url, method = 'GET', headers = {}, body = null } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Target trajectory (URL) not specified.' });
  }

  console.log(`[PROXY] Mission Initiated: ${method} :: ${url}`);

  try {
    const startTime = Date.now();
    
    // Mission Configuration
    const axiosConfig = {
      method,
      url,
      headers: {
        'User-Agent': 'VIPHACKER-XNODE/2.2.4 (SQLiHunter Forensic Agent)',
        ...headers
      },
      data: body,
      timeout: 15000, // 15s timeout for deep forensic responses
      validateStatus: () => true // Protocol: Capture EVERYTHING (even 404/500)
    };

    const response = await axios(axiosConfig);
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`[PROXY] Mission Success: ${response.status} (${duration}ms)`);

    // Reporting Result to Dashboard
    return res.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: response.data,
      duration,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[PROXY] Mission Critical Error: ${error.message}`);
    
    return res.status(500).json({
      error: 'Mission compromised via Proxy Bridge failure.',
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString()
    });
  }
});

// -------------------------------------------------------------------------
// EXFILTRATION HUB :: TELEMETRY RELAY
// -------------------------------------------------------------------------

app.post('/alert', async (req, res) => {
  const { webhookUrl, payload } = req.body;

  if (!webhookUrl || !payload) {
    return res.status(400).json({ error: 'Exfiltration Telemetry compromised: Missing endpoint or payload.' });
  }

  console.log(`[ALERT] Telemetry Synchronizing with remote Vault...`);

  try {
    const response = await axios.post(webhookUrl, payload, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(`[ALERT] Telemetry Sychronized: ${response.status}`);
    return res.json({ success: true, status: response.status });

  } catch (error) {
    console.error(`[ALERT] Telemetry Failure: ${error.message}`);
    return res.status(502).json({ error: 'Telemetry Interrupted', message: error.message });
  }
});

// -------------------------------------------------------------------------
// HEALTH CHECK :: SYSTEM INTEGRITY
// -------------------------------------------------------------------------

app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    identity: 'VIPHACKER-XNODE-BRIDGE',
    version: '2.2.4',
    engine: 'Express/Axios-Forensic-Ready'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('==========================================================');
  console.log('       VIP SQLi SCANNER :: PROXY BRIDGE SYSTEM v2.2       ');
  console.log('==========================================================');
  console.log(`[BRIDGE] System initialized on PORT: ${PORT}`);
  console.log(`[BRIDGE] Monitoring local vector at: http://localhost:${PORT}/proxy`);
  console.log('==========================================================');
  console.log(' MISSION READY :: PRESS CTRL+C TO DEACTIVATE BRIDGE ');
});
