/* eslint-disable no-console */
require('dotenv').config();
const readline = require('readline');
const TailFile = require('@logdna/tail-file');
const https = require('https');

function doRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve(responseBody);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

async function postWebhook(logline) {
  const data = JSON.stringify({
    content: logline,
  });

  const options = {
    hostname: process.env.DISCORD_WEBHOOK_HOST,
    path: process.env.DISCORD_WEBHOOK_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  try {
    const response = await doRequest(options, data);
    console.info(response);
  } catch (err) {
    console.error(err);
  }
}

async function startTail() {
  const logFile = process.env.LOG_TO_TAIL;
  const tail = new TailFile(logFile)
    .on('tail_error', (err) => {
      console.error('TailFile had an error!', err);
    });

  try {
    await tail.start();
    const linesplitter = readline.createInterface({
      input: tail,
    });

    linesplitter.on('line', (line) => {
      console.log(line);
      // See if we can add discord webhook here
      postWebhook(line);
    });
  } catch (err) {
    console.error('Cannot start.  Does the file exist?', err);
  }
}

startTail().catch((err) => {
  process.nextTick(() => {
    throw err;
  });
});
