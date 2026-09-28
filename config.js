// Trikonet Frontend API Configuration
// Backend domain configured for https://api.trikonet.com
window.TRIKONET_CONFIG = window.TRIKONET_CONFIG || {
  apiBase: window.TRIKONET_API_BASE || (
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://127.0.0.1:4173'
      : 'https://api.trikonet.com'
  )
};

// Global fetch wrapper to route relative /api/* requests to the configured backend domain
(function () {
  const originalFetch = window.fetch;
  window.fetch = function (resource, init = {}) {
    let url = typeof resource === 'string' ? resource : resource?.url;
    if (typeof url === 'string' && url.startsWith('/api/')) {
      const fullUrl = window.TRIKONET_CONFIG.apiBase.replace(/\/+$/, '') + url;
      return originalFetch(fullUrl, {
        credentials: 'include',
        ...init
      });
    }
    return originalFetch(resource, init);
  };
})();
