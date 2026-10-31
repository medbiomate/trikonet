export function adminDomainRedirect(path, search = '') {
  const login = ['/admin-login','/admin-portal','/trikonet-admin-access'];
  if (login.includes(path.replace(/\/$/,''))) return 'https://api.trikonet.com/admin-login';
  if (path === '/admin' || path.startsWith('/admin/')) return 'https://api.trikonet.com' + path + search;
  return null;
}
