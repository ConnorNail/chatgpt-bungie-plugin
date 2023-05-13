import crypto from 'crypto';
import { serialize } from 'cookie';

export default function handler(req, res) {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const state = generateRandomString();
  const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI);
  const authUrl = `https://www.bungie.net/en/oauth/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${redirectUri}`;

  // Store the state in a secure HttpOnly cookie
  const stateCookie = serialize('state', state, { httpOnly: true, path: '/' });
  res.setHeader('Set-Cookie', stateCookie);

  res.redirect(authUrl);
}

function generateRandomString() {
  return crypto.randomBytes(20).toString('hex');
}
