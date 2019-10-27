const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const { getShortlink, setShortlink } = require('./shortener.js')
const { logPageView } = require('./analytics.js')

const basicAuth = require('express-basic-auth')
const authMiddleware = basicAuth({ users: { 'admin': process.env.ADMIN_PASS || 'password' } })

app.post('/create', express.json(), authMiddleware, async (req, res, next) => {
  try {
    const { key, value } = req.body;
    await setShortlink(key, value);
    res.send('Successfully set ' + key);
  } catch (err) {
    next(err)
  }
});

app.get('/', async (req, res, next) => {
  res.redirect('https://oaklandca.gov')
  await logPageView(req)
});

app.get('/:slug', async (req, res, next) => {
  try {
    const val = await getShortlink(req.params.slug)
    val ? res.redirect(val) : res.send("Not found");
    await logPageView(req)
  } catch (err) {
    next(err)
  }
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message)
})

app.listen(port, () => console.log(`Shortener listening on port ${port}!`))
