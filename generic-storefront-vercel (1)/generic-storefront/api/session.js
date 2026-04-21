import { readCookie, verifySession } from './_auth.js';

export default async function handler(req, res) {
  const token = readCookie(req, 'admin_session');
  const ok = verifySession(token, process.env.SESSION_SECRET || '');
  res.status(200).json({ authenticated: ok });
}
