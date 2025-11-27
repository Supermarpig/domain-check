const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_FILE = path.join(__dirname, 'config.json');
const BACKUP_DIR = path.join(__dirname, 'backups');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// Helper function to read config
function readConfig() {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Failed to read config file: ' + error.message);
  }
}

// Helper function to write config
function writeConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 4), 'utf8');
    return true;
  } catch (error) {
    throw new Error('Failed to write config file: ' + error.message);
  }
}

// GET /api/config - Read entire config
app.get('/api/config', (req, res) => {
  try {
    const config = readConfig();
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/config/:section - Read specific section
app.get('/api/config/:section', (req, res) => {
  try {
    const config = readConfig();
    const section = req.params.section;

    if (config.hasOwnProperty(section)) {
      res.json({
        success: true,
        data: config[section]
      });
    } else {
      res.status(404).json({
        success: false,
        error: `Section '${section}' not found`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/config - Update entire config
app.put('/api/config', (req, res) => {
  try {
    const newConfig = req.body;

    // Validate that it's a valid object
    if (!newConfig || typeof newConfig !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid config data'
      });
    }

    writeConfig(newConfig);
    res.json({
      success: true,
      message: 'Config updated successfully',
      data: newConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PATCH /api/config/:section - Update specific section
app.patch('/api/config/:section', (req, res) => {
  try {
    const config = readConfig();
    const section = req.params.section;
    const newData = req.body;

    if (!config.hasOwnProperty(section)) {
      return res.status(404).json({
        success: false,
        error: `Section '${section}' not found`
      });
    }

    config[section] = newData;
    writeConfig(config);

    res.json({
      success: true,
      message: `Section '${section}' updated successfully`,
      data: config[section]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/config/backup - Create backup
app.post('/api/config/backup', (req, res) => {
  try {
    const config = readConfig();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `config-backup-${timestamp}.json`);

    fs.writeFileSync(backupFile, JSON.stringify(config, null, 4), 'utf8');

    res.json({
      success: true,
      message: 'Backup created successfully',
      filename: path.basename(backupFile)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/config/backups - List all backups
app.get('/api/backups', (req, res) => {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('config-backup-') && file.endsWith('.json'))
      .map(file => ({
        filename: file,
        created: fs.statSync(path.join(BACKUP_DIR, file)).mtime
      }))
      .sort((a, b) => b.created - a.created);

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/config/restore/:filename - Restore from backup
app.post('/api/config/restore/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const backupFile = path.join(BACKUP_DIR, filename);

    if (!fs.existsSync(backupFile)) {
      return res.status(404).json({
        success: false,
        error: 'Backup file not found'
      });
    }

    const backupData = fs.readFileSync(backupFile, 'utf8');
    const config = JSON.parse(backupData);

    writeConfig(config);

    res.json({
      success: true,
      message: 'Config restored from backup successfully',
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Config CRUD API server running on http://localhost:${PORT}`);
  console.log(`📝 Admin panel: http://localhost:${PORT}/swag-admin-domain-asap.html`);
  console.log(`🌐 Main site: http://localhost:${PORT}/index.html`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET    /api/config`);
  console.log(`   GET    /api/config/:section`);
  console.log(`   PUT    /api/config`);
  console.log(`   PATCH  /api/config/:section`);
  console.log(`   POST   /api/config/backup`);
  console.log(`   GET    /api/backups`);
  console.log(`   POST   /api/config/restore/:filename`);
});
