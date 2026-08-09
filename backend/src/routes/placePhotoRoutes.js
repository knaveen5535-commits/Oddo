const express = require('express');
const axios = require('axios');
const cloudinaryService = require('../services/cloudinaryService');
const googlePlacesService = require('../services/googlePlacesService');

const router = express.Router();

const MAX_WIDTH_CAP = 4096;

/**
 * GET /api/places/photo?name=<google photo name>&max=<maxWidthPx>
 *
 * Server-side proxy for Google Place Photos media:
 *   1. Checks the Cloudinary cache; if present, redirects to the CDN URL.
 *   2. Otherwise fetches the image from Google with the API key (server-side
 *      only - the key never reaches the browser) and uploads it to Cloudinary.
 *   3. Falls back to streaming the bytes directly if Cloudinary is unavailable.
 *
 * On any failure returns 404, which the frontend swaps for its curated fallback.
 */
router.get('/photo', async (req, res) => {
  const name = req.query.name || req.query.reference;
  const max = Math.min(parseInt(req.query.max, 10) || 1200, MAX_WIDTH_CAP);

  if (!name) {
    return res.status(400).json({ error: 'Missing photo name parameter' });
  }

  try {
    if (cloudinaryService.isEnabled()) {
      const cached = await cloudinaryService.findPhoto(name);
      if (cached) return res.redirect(cached.url);
    }

    const googleUrl = `https://places.googleapis.com/v1/${name.replace(/^\//, '')}/media?maxWidthPx=${max}`;
    const response = await axios.get(googleUrl, {
      headers: { 'X-Goog-Api-Key': googlePlacesService.apiKey },
      responseType: 'arraybuffer',
      validateStatus: (status) => status < 400,
    });

    const buffer = Buffer.from(response.data);

    if (cloudinaryService.isEnabled()) {
      try {
        const uploaded = await cloudinaryService.uploadBuffer(buffer, name);
        if (uploaded) return res.redirect(uploaded.url);
      } catch (error) {
        console.error('[PlacesPhoto] Cloudinary upload failed, serving directly:', error.message);
      }
    }

    res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(buffer);
  } catch (error) {
    console.error('[PlacesPhoto] Proxy error:', error.message);
    return res.status(404).json({ error: 'Photo unavailable' });
  }
});

module.exports = router;
