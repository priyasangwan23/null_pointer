const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'style_dataset.json');

const DEFAULT_PHRASES = {
  casual: [
    "kuch nahi yaar 😄",
    "arey neend aa gayi thi lol",
    "haha same yaar, par karna padta hai na 😄",
    "lol me too, college life hai bhai 😭"
  ],
  respectful: [
    "college mein hoon mummy, classes chal rahi hain",
    "thik hoon mummy, abhi hostel pahunchi",
    "haan ji, classes khatam ho gayi hain",
    "bas library mein padh rahi hoon"
  ],
  neutral: [
    "haan bol rahi hoon",
    "college ke assignments kar rahi hoon",
    "haan, wahi to main bhi bol rahi thi"
  ]
};

const getCategoryForRole = (role) => {
  if (role === 'mother' || role === 'elder') return 'respectful';
  if (role === 'stranger') return 'neutral';
  return 'casual'; // default / friend / best_friend
};

// Ensure directory and file exist
const initDataset = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  // Check if file doesn't exist or is in the old flat array format
  let needWrite = !fs.existsSync(DATA_FILE);
  if (!needWrite) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        needWrite = true; // Old format, reset to new format
      }
    } catch {
      needWrite = true;
    }
  }

  if (needWrite) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_PHRASES, null, 2), 'utf-8');
  }
};

const getStyleDataset = (role) => {
  try {
    initDataset();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    const category = getCategoryForRole(role);
    return parsed[category] || DEFAULT_PHRASES[category];
  } catch (err) {
    console.error('Error reading style dataset:', err.message);
    const category = getCategoryForRole(role);
    return DEFAULT_PHRASES[category];
  }
};

const learnFromResponse = (response, role) => {
  if (!response || typeof response !== 'string') return;

  try {
    initDataset();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    const category = getCategoryForRole(role);
    
    if (!parsed[category]) {
      parsed[category] = [];
    }

    const dataset = parsed[category];

    // Split response into sentences or clauses
    const candidates = response
      .split(/[.!?\n\r]+/)
      .map(p => p.trim())
      .filter(p => p.length >= 8 && p.length <= 60);

    let updated = false;

    for (const candidate of candidates) {
      if (
        candidate.includes('{') || 
        candidate.includes('}') || 
        candidate.includes('<') || 
        candidate.includes('>') ||
        candidate.startsWith('#') ||
        candidate.startsWith('-') ||
        candidate.startsWith('*')
      ) {
        continue;
      }

      const lowerCandidate = candidate.toLowerCase();
      const exists = dataset.some(existing => existing.toLowerCase() === lowerCandidate);

      if (!exists) {
        dataset.push(candidate);
        updated = true;
      }
    }

    if (updated) {
      const MAX_PHRASES = 15;
      if (dataset.length > MAX_PHRASES) {
        dataset.splice(0, dataset.length - MAX_PHRASES);
      }

      fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error writing/updating style dataset:', err.message);
  }
};

module.exports = {
  getStyleDataset,
  learnFromResponse
};
