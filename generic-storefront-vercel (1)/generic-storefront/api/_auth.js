import crypto from 'crypto';

function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function fromB64url(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  return Buffer.from(input, 'base64').toString('utf8');
}

export function makeSession(secret, maxAgeSec = 60 * 60 * 12) {
  const payload = JSON.stringify({ exp: Math.floor(Date.now() / 1000) + maxAgeSec, role: 'admin' });
  const encoded = b64url(payload);
  const sig = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifySession(token, secret) {
  if (!token || !secret) return false;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return false;
  const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    const payload = JSON.parse(fromB64url(encoded));
    return payload.exp > Math.floor(Date.now() / 1000) && payload.role === 'admin';
  } catch {
    return false;
  }
}

export function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  const parts = raw.split(';').map(x => x.trim());
  const found = parts.find(p => p.startsWith(name + '='));
  return found ? decodeURIComponent(found.split('=').slice(1).join('=')) : '';
}
