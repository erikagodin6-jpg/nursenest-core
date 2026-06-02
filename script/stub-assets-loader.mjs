const assetExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp'];

export function resolve(specifier, context, nextResolve) {
  if (assetExtensions.some(ext => specifier.endsWith(ext))) {
    return { url: 'data:text/javascript,export default ""', shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
  if (assetExtensions.some(ext => url.endsWith(ext))) {
    return { format: 'module', source: 'export default ""', shortCircuit: true };
  }
  return nextLoad(url, context);
}
