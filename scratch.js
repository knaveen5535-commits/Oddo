require('dotenv').config({ path: 'backend/.env' });
const axios = require('axios');

async function run() {
  const gs = require('./backend/src/services/googlePlacesService.js');
  const results = await gs.getRecommendations('Paris');
  console.log(JSON.stringify(results.attractions[0], null, 2));
}
run();
