import { createSession } from './session.js';
import { refreshTokens } from './user.js';

export async function loginUser(req, res, userId) {
  const connectionInformation = {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  }
  // Create Session
  const sessionToken = await createSession(userId, connectionInformation);
  // Create JWTs
  // Set Cookie
  await refreshTokens(sessionToken, userId, res)
}