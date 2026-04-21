export default async function handler(req, res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', `admin_session=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0; ${isProd ? 'Secure;' : ''}`);
  res.status(200).json({ ok: true });
}
