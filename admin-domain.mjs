export function isPublicAdminLogin(path) {
  return ['/admin-login','/admin-portal','/trikonet-admin-access'].includes(path.replace(/\/+$/,''));
}
export function adminDomainRedirect(path, search = '') {
  if (path === '/admin' || path.startsWith('/admin/')) return 'https://api.trikonet.com' + path + search;
  return null;
}
