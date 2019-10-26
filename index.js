const express = require('express')
const app = express()
const basicAuth = require('express-basic-auth')
const port = 3000

const { getShortlink, setShortlink } = require('./shortener.js')

// Handle creating new links. Use basic auth. This overwrites existing links
const ADMIN_PASS = process.env.ADMIN_PASS || 'password'
app.use(express.json())
app.post('/create', basicAuth({ users: { 'admin': ADMIN_PASS } }), async (req, res, next) => {
  const { key, value } = req.body;
  try {
    await setShortlink(key, value);
  } catch (err) {
    next(err.message)
  }
  res.send('Successfully set ' + key);
});

// Get link. Either redirects or returns a Not Found if it's a bad link
app.get('/:slug', async (req, res, next) => {
  try {
    const val = await getShortlink(req.params.slug)
    val ? res.redirect(val) : res.send("Not found");
  } catch (err) {
    next(err.message)
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
