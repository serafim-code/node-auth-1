import cookieParser from 'cookie-parser';
import 'dotenv/config.js';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { authorizeUser } from './src/accounts/authorize.js';
import { loginUser } from './src/accounts/loginUser.js';
import { logoutUser } from './src/accounts/logoutUser.js';
import { registerUser } from './src/accounts/register.js';
import { getUserFromCookies } from './src/accounts/user.js';
import { connectDb } from './src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SIGNATURE));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', async (req, res) => {
  try {
    const userId = await registerUser(req.body.email, req.body.password);
    if (userId) {
      await loginUser(req, res, userId);
      res.send({
        data: { userId }
      });
    }
  } catch (e) {
    console.error(e);
    res.send({
      data: {
        status: 'FAILED',
      }
    })
  }
});

app.post('/api/logout', async (req, res) => {
  try {
    await logoutUser(req, res);
    res.send({
      data: {
        status: 'SUCCESS'
      }
    })
  } catch (e) {
    console.error(e);
    res.send({
      data: {
        status: 'FAILED',
      }
    })
  }
});

app.post('/api/authorize', async (req, res) => {
  try {
    const { isAuthorized, userId } = await authorizeUser(req.body.email, req.body.password);
    if (isAuthorized) {
      await loginUser(req, res, userId);
      res.send({
        data: {
          userId
        }
      });
    } else {
      console.error(e);
      res.send({
        data: {
          status: 'FAILED',
        }
      })
    }
  } catch (e) {
    console.error(e);
  }
})

app.get('/test', async (req, res) => {
  try {
    // Verify user login
    const user = await getUserFromCookies(req, res);
    // Return user email, if it exists, otherwise return unauthorized
    if (user?._id) {
      res.send({ user })
    } else {
      res.send({
        data: 'User lookup failed'
      })
    }
  } catch (e) {
    throw new Error(e);
  }
})

function startServer() {
  server.listen(3000);
}

connectDb().then(() => {
  startServer();
})