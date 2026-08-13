require('dotenv').config({ path: '.env' });
const gs = require('./src/services/googlePlacesService.js');

async function run() {
  const result = await gs.getRecommendations('Paris');
  console.log(JSON.stringify(result.attractions.slice(0,2), null, 2));
}
run();
