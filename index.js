require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE = '2-270947367'; 
const BASE = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

// Homepage: list records
app.get('/', async (req, res) => {
  try {
    const resp = await axios.get(`${BASE}?properties=name,channel,episodes`, { headers });
    res.render('homepage', { title: 'Dramas | Integrating With HubSpot I Practicum', dramas: resp.data.results });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error fetching records');
  }
});

// Form page
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Create record
app.post('/update-cobj', async (req, res) => {
  const newRecord = {
    properties: {
      name: req.body.name,
      channel: req.body.channel,
      episodes: req.body.episodes
    }
  };
  try {
    await axios.post(BASE, newRecord, { headers });
    res.redirect('/');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error creating record');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));