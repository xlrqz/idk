import { makeSession } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { password } = req.body || {};
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!expected || !secret) {
    res.status(500).json({ error: 'Server env vars are missing' });
    return;
  }

  if (typeof password !== 'string' || password !== expected) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }

  const token = makeSession(secret);
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', `admin_session=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=43200; ${isProd ? 'Secure;' : ''}`);
  res.status(200).json({ ok: true });
}
