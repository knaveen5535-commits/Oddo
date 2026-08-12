require('dotenv').config({ path: '.env' });
const axios = require('axios');

async function run() {
  try {
    const result = await axios.get('https://places.googleapis.com/v1/places/ChIJLU7jZClu5kcR4PcOOO6p3I0', {
      headers: {
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': '*'
      }
    });
    console.log(result.data.photos);
  } catch(e) {
    console.log(e.response?.data || e.message);
  }
}
run();
