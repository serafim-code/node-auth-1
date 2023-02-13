import bcrypt from 'bcryptjs';
import { user } from '../user/user.js';

const { compare } = bcrypt;

export async function authorizeUser(email, password) {
  // Look up user
  const userData = await user.findOne({
    'email.address': email
  });
  // Get user Password
  const savedPassword = userData.password;
  // Compare password with one in database
  const isAuthorized = await compare(password, savedPassword);
  // Return boolean if password is correct
  return { isAuthorized, userId: userData._id};
}