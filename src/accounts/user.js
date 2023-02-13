import jwt from 'jsonwebtoken';
import mongo from 'mongodb';
import { user } from '../user/user.js';
import { session } from '../session/session.js';
import { createTokens } from './tokens.js';

const { ObjectId } = mongo;
const JWTSignature = process.env.JWT_SIGNATURE;

export async function getUserFromCookies(req, res) {
  try {
    // Check to make sure access token exists
    if (req?.cookies?.accessToken) {
      const { accessToken } = req.cookies;
      // Decode access token
      const decodedAccessToken = jwt.verify(accessToken, JWTSignature);
      // Return user from record
      return user.findOne({
        _id: new ObjectId(decodedAccessToken.userId)
      })
    }
    // If refresh token exists
    if (req?.cookies?.refreshToken) {
      const { refreshToken }  = req.cookies;
      // Decode refresh token
      const { sessionToken} = jwt.verify(refreshToken, JWTSignature);
      // Look up session
      const currentSession = await session.findOne({ sessionToken });
      // Confirm session is valid
      if (currentSession.valid) {
        // Look up current user
        const currentUser = await user.findOne({
          _id: new ObjectId(currentSession.userId)
        })
        // refresh tokens
        await refreshTokens(sessionToken, currentUser._id, res);
        // Return current user
        return currentUser;
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export async function refreshTokens(sessionToken, userId, res) {
  try {
    // Create JWTs
    const { accessToken, refreshToken } = await createTokens(sessionToken, userId);
    // Set Cookie
    const now = new Date();
    const refreshExpires = new Date(now.setDate(now.getDate() + 30));
    res.cookie('refreshToken', refreshToken, {
      path: '/',
      domain: 'localhost',
      httpOnly: true,
      expires: refreshExpires
    })
    res.cookie('accessToken', accessToken, {
      path: '/',
      domain: 'localhost',
      httpOnly: true,
    });
  } catch (e) {
    console.error(e);
  }
}