// Trikonet Frontend API Configuration
// Automatically routes to local backend when on localhost, or https://api.trikonet.com in production
const isLocal = typeof window !== 'undefined' && (
  !window.location.hostname ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('.local')
);

window.TRIKONET_CONFIG = window.TRIKONET_CONFIG || {
  apiBase: window.TRIKONET_API_BASE || (isLocal ? '' : 'https://api.trikonet.com')
};

// Global fetch wrapper to route relative /api/* requests to the configured backend domain
(function () {
  const originalFetch = window.fetch;
  window.fetch = function (resource, init = {}) {
    let url = typeof resource === 'string' ? resource : resource?.url;
    if (typeof url === 'string' && url.startsWith('/api/') && window.TRIKONET_CONFIG.apiBase) {
      const fullUrl = window.TRIKONET_CONFIG.apiBase.replace(/\/+$/, '') + url;
      return originalFetch(fullUrl, {
        credentials: 'include',
        ...init
      });
    }
    return originalFetch(resource, init);
  };
})();
