const jwt = require('jsonwebtoken');
const db = require('../database/db');
const secret = () => process.env.JWT_SECRET || 'development-only-change-me';
function sign(user, remember = false) { return jwt.sign({ id: user.id, name: user.name, username: user.username }, secret(), { expiresIn: remember ? '30d' : '12h' }); }
function verify(token) { return jwt.verify(token, secret()); }
function requireAuth(req, res, next) { try { const cookieToken = req.headers.cookie?.match(/(?:^|;\s*)token=([^;]+)/)?.[1]; const token = cookieToken || req.headers.authorization?.replace('Bearer ', ''); req.user = verify(token); next(); } catch { res.status(401).json({ error: 'Please sign in to continue.' }); } }
function requireAdmin(req, res, next) { const user = db.prepare('SELECT is_admin FROM users WHERE id=?').get(req.user.id); if (!user?.is_admin) return res.status(403).json({ error: 'Administrator access is required.' }); next(); }
module.exports = { sign, verify, requireAuth, requireAdmin };
