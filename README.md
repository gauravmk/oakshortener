# oakshortener
A super basic URL shortener. Lives at [oakca.us](http://oakca.us). 

[oakca.us/a](http://oakca.us/a) takes you back here.

## Features

All short links are stored in redis since it's just a series of key values. This is as barebones as it gets. There are two routes:

- `GET /:slug` looks up the slug in redis and redirects to the value it finds
- `POST /create` creates (or overrides) an existing link. It's protected by simple Basic Auth with the password in an env var.

Lastly we do capture some analytics. We simply log every pageview to google analytics using their server side API.
<br/><br/><br/>
<sub>Made with ❤️ in beautiful. downtown. oakland. california.</sub>
