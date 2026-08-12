const express = require('express');
const axios = require('axios');
const cloudinaryService = require('../services/cloudinaryService');

const router = express.Router();

// Only proxy images from known safe hosts (no SSRF through arbitrary URLs).
const ALLOWED_HOST_RE = /(^|\.)(unsplash\.com|wikimedia\.org|openstreetmap\.org|githubusercontent\.com|googleapis\.com)$/;
const MAX_WIDTH_CAP = 4096;

/**
 * GET /api/places/photo?url=<encoded image url>&max=<maxWidthPx>
 *
 * Generic image proxy + Cloudinary cache:
 *   1. Checks the Cloudinary cache; if present, redirects to the CDN URL.
 *   2. Otherwise fetches the source image server-side and uploads it once.
 *   3. Falls back to streaming the bytes directly if Cloudinary is unavailable.
 *
 * Returns 400 for bad input, 404 when the source image can't be fetched.
 */
router.get('/photo', async (req, res) => {
  const url = req.query.url || req.query.src;
  const max = Math.min(parseInt(req.query.max, 10) || 1200, MAX_WIDTH_CAP);

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  let host;
  try {
    host = new URL(url).host;
  } catch {
    return res.status(400).json({ error: 'Invalid image url' });
  }
  if (!ALLOWED_HOST_RE.test(host)) {
    return res.status(400).json({ error: 'Disallowed image host' });
  }

  try {
    const cached = await cloudinaryService.findPhoto(url);
    if (cached) return res.redirect(cached.url);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (status) => status < 400,
    });
    const buffer = Buffer.from(response.data);

    if (cloudinaryService.isEnabled()) {
      try {
        const uploaded = await cloudinaryService.uploadBuffer(buffer, url);
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
