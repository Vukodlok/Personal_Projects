require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

const urlDatabase = {};
let counter = 1;

// url shortener API endpoint
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res) => {
  const { url }= req.body;
  const urlObj = new URL(url);

  dns.lookup(urlObj.hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const short_url = counter++;
    urlDatabase[short_url] = url;

    res.json({ original_url: url, short_url });
  });
});

app.get ('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;
  const original_url = urlDatabase[short_url];
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
