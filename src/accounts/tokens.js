import jwt from 'jsonwebtoken';

const JWTSignature = process.env.JWT_SIGNATURE;

export async function createTokens(sessionToken, userId) {
  try {
    // Create Refresh Token(Session ID)
    const refreshToken = jwt.sign({
      sessionToken
    }, JWTSignature)
    // Create Access Token(Session ID, User ID)
    const accessToken = jwt.sign({
      sessionToken,
      userId
    }, JWTSignature);
    // Return Refresh Token and Access Token
    return { accessToken, refreshToken }
  } catch (e) {
    console.error(e);
  }
}