export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.png') || specifier.endsWith('.jpg') || specifier.endsWith('.jpeg') || specifier.endsWith('.svg') || specifier.endsWith('.gif') || specifier.endsWith('.webp') || specifier.startsWith('@assets/')) {
    return { url: 'data:text/javascript,export default ""', shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
