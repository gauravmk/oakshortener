const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const { client, getShortlink, setShortlink } = require("./shortener.js");
const { logPageView } = require("./analytics.js");

const { promisify } = require("util");
const smembersAsync = promisify(client.smembers).bind(client);

app.use(express.urlencoded({ extended: true }));

app.post("/slack/set", async (req, res, next) => {
  try {
    if (req.body.token !== process.env.SLACK_TOKEN) {
      res.send("Unauthorized request");
    }

    // Only allow whitelisted user
    const admins = await smembersAsync("adminusers");

    if (!admins.includes(req.body.user_id)) {
      res.send("Unauthorized. Talk to gaurav about getting access");
    }

    const [key, value] = req.body.text.split(" ");
    await setShortlink(key, value);
    res.send(`Successfully set http://oakca.us/${key}`);
  } catch (err) {
    res.send(`Shortlink failed: ${err.message}`);
    next(err);
  }
});

app.get("/", async (req, res, next) => {
  res.redirect("https://oaklandca.gov");
  await logPageView(req);
});

app.get("/:slug", async (req, res, next) => {
  try {
    const val = await getShortlink(req.params.slug);
    val ? res.redirect(val) : res.send("Not found");
    await logPageView(req);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

app.listen(port, () => console.log(`Shortener listening on port ${port}!`));
