const { setShortlink } = require('./shortener.js')
const [_, __, key, value] = process.argv;

setShortlink(key, value).then(() => {
  console.log("Successfully set " + key);
  process.exit(0)
}).catch(err => {
  console.error(err.message);
  process.exit(1)
});
