import bcrypt from 'bcryptjs'
import { user } from '../user/user.js';
const { genSalt, hash } = bcrypt;

export async function registerUser(email, password) {
  // generate salt
  const salt = await genSalt(10);

  // hash with salt
  const hashedPassword = await hash(password, salt)

  // store in database
  const result = await user.insertOne({
    email: {
      address: email,
      verified: false
    },
    password: hashedPassword
  });

  // return user from database
  return result.insertedId;
}