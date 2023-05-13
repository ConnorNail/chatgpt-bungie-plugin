import crypto from 'crypto';
import { serialize, parse } from 'cookie';

export default function handler(req, res) {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

  if (req.method === 'GET' && req.query.code) {
    // This is the callback from Bungie OAuth
    const code = req.query.code;
    const state = parse(req.headers.cookie).state;

    if (req.query.state !== state) {
      // Possible CSRF attack, abort
      return res.status(400).send('Invalid state');
    }

    // Return the code
    return res.json({ code });
  } else {
    // This is the initial request, redirect to Bungie OAuth
    const state = generateRandomString();
    const authUrl = `https://www.bungie.net/en/oauth/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    // Store the state in a secure HttpOnly cookie
    const stateCookie = serialize('state', state, { httpOnly: true, path: '/' });
    res.setHeader('Set-Cookie', stateCookie);

    res.redirect(authUrl);
  }
}

function generateRandomString() {
  return crypto.randomBytes(20).toString('hex');
}
