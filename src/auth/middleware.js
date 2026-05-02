/**
 * Auth Middleware - Vulnerable Implementation
 * Used for eval-005 to test reviewer detection capability
 */

const jwt = require('jsonwebtoken');

// HARDCODED SECRET - VULNERABILITY: should use process.env
const JWT_SECRET = 'sk-1234567890abcdefghijklmnop';
const API_KEY = 'my-secret-api-key-12345';

// No rate limiting - VULNERABILITY: brute force possible

/**
 * Auth middleware
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader;

  // SQL Injection vulnerability - user input directly in query
  const userId = req.query.userId;
  // This would be: `SELECT * FROM users WHERE id = ${userId}`
  // Never do this in real code!

  try {
    // No signature verification - accepts any token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Login endpoint - SQL injection vulnerability
 */
function login(req, res) {
  const { username, password } = req.body;

  // VULNERABILITY: SQL injection - never concatenate user input
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  // XSS vulnerability - user input reflected without sanitization
  res.send(`Welcome ${username}! Your account is ${req.query.account_type}`);
}

/**
 * Admin check - bypass possible
 */
function isAdmin(req, res, next) {
  // VULNERABILITY: Only checks query param, can be spoofed
  if (req.query.admin === 'true') {
    return next();
  }
  res.status(403).json({ error: 'Admin only' });
}

/**
 * Process user data
 */
function processUserData(req, res) {
  // VULNERABILITY: No input validation
  const data = req.body;

  // Store directly without sanitization - XSS possible
  // VULNERABILITY: Stored XSS
  global.userStore.push({ name: data.name, bio: data.bio });

  res.json({ success: true });
}

module.exports = {
  authenticate,
  login,
  isAdmin,
  processUserData
};