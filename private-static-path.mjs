// The application root contains server code and fallback account snapshots.
// These are never public assets, even if a matching file exists on disk.
export function isPrivateStaticPath(path) {
  const segments=String(path).replace(/\\/g,'/').split('/').filter(Boolean);
  return segments.some(segment=>segment.startsWith('.')) ||
    ['data','node_modules','scripts'].includes(segments[0]) ||
    /\.(?:mjs|test\.js|test\.html)$/i.test(path) ||
    /\/(?:server\.js|package(?:-lock)?\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml)$/i.test(path);
}
