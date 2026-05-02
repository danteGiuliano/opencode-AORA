/**
 * Auth Middleware - Vulnerable Implementation
 * Fixture for eval-005: reviewer agent vulnerability detection test
 * 
 * Vulnerabilities present:
 * - Hardcoded secrets (JWT_SECRET, API_KEY)
 * - SQL injection via user input concatenation
 * - XSS via unescaped user input reflection
 * - No rate limiting
 * - Admin bypass via query param
 * - No input validation
 */

const jwt = require('jsonwebtoken');

// CRITICAL: Hardcoded secrets in code
const JWT_SECRET = 'sk-1234567890abcdefghijklmnop';
const API_KEY = 'my-secret-api-key-12345';

// WARNING: No rate limiting - brute force attacks possible

/**
 * Auth middleware - WARNING: vulnerable token verification
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader;

  // CRITICAL: SQL Injection - user input directly in query
  const userId = req.query.userId;

  try {
    // WARNING: No JWT signature verification - accepts any token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Login endpoint - CRITICAL: SQL injection vulnerability
 */
function login(req, res) {
  const { username, password } = req.body;

  // CRITICAL: SQL injection - never concatenate user input
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  // CRITICAL: XSS - user input reflected without sanitization
  res.send(`Welcome ${username}! Your account is ${req.query.account_type}`);
}

/**
 * Admin check - WARNING: bypass possible
 */
function isAdmin(req, res, next) {
  // WARNING: Only checks query param, can be spoofed
  if (req.query.admin === 'true') {
    return next();
  }
  res.status(403).json({ error: 'Admin only' });
}

/**
 * Process user data - WARNING: no input validation
 */
function processUserData(req, res) {
  const data = req.body;

  // WARNING: Stored XSS - no sanitization before storage
  global.userStore.push({ name: data.name, bio: data.bio });

  res.json({ success: true });
}

module.exports = {
  authenticate,
  login,
  isAdmin,
  processUserData
};