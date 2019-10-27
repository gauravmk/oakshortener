const request = require('request');

function logPageView(req) {
  return new Promise(resolve => {
    const payload = {
      v: 1,
      tid: process.env.GOOGLE_TRACKING_ID,
      uip: req.ip,
      ua: req.headers['user-agent'],
      t: 'pageview',
      dh: req.get('host'),
      dp: req.originalUrl,
    }

    const options = {
      uri: 'https://www.google-analytics.com/collect', 
      method: 'POST',
      json: payload,
    }

    request(options, (err, response, body) => {
      console.log("Recv code: " + response.statusCode);
      resolve()
    });
  });
}

module.exports = { logPageView }
