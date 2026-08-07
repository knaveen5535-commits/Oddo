import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * REDUNDANT SECURITY INTERCEPTOR (NUCLEAR VERSION)
 * Ensures the Authorization header is present by any means necessary.
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (token) {
        const bearer = `Bearer ${token}`;
        
        // 1. Set on config headers object
        config.headers['Authorization'] = bearer;
        
        // 2. Set on config headers using Axios set method
        if (config.headers.set) {
          config.headers.set('Authorization', bearer);
        }
        
        // 3. Set globally for this instance just in case
        api.defaults.headers.common['Authorization'] = bearer;

        console.log(`[AUTH] Token successfully injected into request: ${config.url}`);
      } else {
        console.warn('[AUTH] No traveler session found for request to ' + config.url);
      }
    } catch (err) {
      console.error('[AUTH] Interceptor Critical Error:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('[AUTH] 401 - Operational Clearance Denied');
      console.log('[AUTH] Request Headers at failure:', error.config?.headers);
    }
    return Promise.reject(error);
  }
);

export default api;
