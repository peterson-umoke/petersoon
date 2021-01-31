import * as functions from 'firebase-functions';
const { convert } = require('convert-svg-to-png');
import express = require('express');
import cors = require('cors');

const app = express();
const whitelist = [
  /localhost:4200/,
  /d17sb6rpeaxdkn\.amplifyapp\.com$/,
  /blipbillboards.com/,
];

const regexMatchInWhitelist = (list: RegExp[], toMatch: string) => {
  for (const str of list) {
    if (toMatch.match(str)) {
      return true;
    }
  }
  return false;
};

const corsOptions = {
  origin: function(origin: any, callback: any) {
    if (regexMatchInWhitelist(whitelist, origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.options('/');
// build multiple CRUD interfaces:
app.post('/', async (req, res) => {
  try {
    const png = await convert(req.body, {
      puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
      },
    });
    res.set('Content-Type', 'image/png');
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export const svgToPng = functions
  .runWith({ timeoutSeconds: 180, memory: '1GB' })
  .https.onRequest(app);
