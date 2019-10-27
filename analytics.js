const request = require('request');
const requestIp = require('request-ip');
const uuidv4 = require('uuid/v4');

request.debug = true

function logPageView(req) {
  return new Promise(resolve => {
    const payload = {
      v: 1,
      tid: process.env.GOOGLE_TRACKING_ID,
      cid: uuidv4(),
      uip: requestIp.getClientIp(req),
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
      console.log(body)
      resolve()
    });
  });
}

module.exports = { logPageView }
