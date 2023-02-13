import jwt from 'jsonwebtoken';
import { session } from '../session/session.js';

const JWTSignature = process.env.JWT_SIGNATURE;

export async function logoutUser(req, res) {
  try {
    if (req?.cookies?.refreshToken) {
      const { refreshToken } = req.cookies;
      // Decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature);
      // Delete database's record for session
      await session.deleteOne({ sessionToken });
    }
    // Remove cookie
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken')
  } catch (e) {
    console.error(e)
  }
}