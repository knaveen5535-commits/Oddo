const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');

/**
 * Cloudinary image cache for place photos.
 *
 * Each Google place photo (referenced by its `name`) is uploaded to Cloudinary
 * once and then served from the Cloudinary CDN, so:
 *   - the Google Places photo quota is hit at most once per photo,
 *   - images load fast from a reliable CDN,
 *   - the Google API key never reaches the browser.
 */
class CloudinaryService {
  constructor() {
    this.cloudName = process.env.CLOUDINARY_NAME;
    this.apiKey = process.env.CLOUDINARY_API_KEY;
    this.apiSecret = process.env.CLOUDINARY_API_SECRET;
    this.enabled = Boolean(this.cloudName && this.apiKey && this.apiSecret);

    if (this.enabled) {
      cloudinary.config({
        cloud_name: this.cloudName,
        api_key: this.apiKey,
        api_secret: this.apiSecret,
      });
    } else {
      console.warn('[Cloudinary] Missing CLOUDINARY_* env vars - photo caching disabled.');
    }
  }

  isEnabled() {
    return this.enabled;
  }

  /**
   * Stable public id for a Google photo reference, so the same photo is
   * always cached under the same Cloudinary asset.
   * @param {string} reference
   * @returns {string}
   */
  photoPublicId(reference) {
    const hash = crypto.createHash('md5').update(reference).digest('hex');
    return `oddo/places/${hash}`;
  }

  /**
   * Looks up an already-cached photo. Returns { publicId, url } or null.
   * @param {string} reference
   * @returns {Promise<{publicId: string, url: string}|null>}
   */
  async findPhoto(reference) {
    if (!this.enabled) return null;
    const publicId = this.photoPublicId(reference);
    return new Promise((resolve) => {
      cloudinary.api.resource(publicId, (error, result) => {
        if (error || !result || !result.secure_url) return resolve(null);
        resolve({ publicId, url: result.secure_url });
      });
    });
  }

  /**
   * Uploads raw image bytes to Cloudinary and returns { publicId, url }.
   * @param {Buffer} buffer
   * @param {string} reference
   * @returns {Promise<{publicId: string, url: string}>}
   */
  async uploadBuffer(buffer, reference) {
    const publicId = this.photoPublicId(reference);
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: publicId, overwrite: true, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve({ publicId, url: result.secure_url });
        }
      );
      stream.end(buffer);
    });
  }
}

module.exports = new CloudinaryService();
