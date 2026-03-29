const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif'];

function isImageFile(str) {
  return imageExtensions.some(e => str.endsWith(e));
}

export async function resolve(specifier, context, nextResolve) {
  if (isImageFile(specifier)) {
    return {
      url: 'data:text/javascript,export default ""',
      shortCircuit: true,
    };
  }
  try {
    const result = await nextResolve(specifier, context);
    if (result && result.url && isImageFile(result.url)) {
      return {
        url: 'data:text/javascript,export default ""',
        shortCircuit: true,
      };
    }
    return result;
  } catch (err) {
    if (err && err.message && imageExtensions.some(e => err.message.includes(e))) {
      return {
        url: 'data:text/javascript,export default ""',
        shortCircuit: true,
      };
    }
    throw err;
  }
}

export async function load(url, context, nextLoad) {
  if (isImageFile(url)) {
    return {
      format: 'module',
      source: 'export default ""',
      shortCircuit: true,
    };
  }
  try {
    return await nextLoad(url, context);
  } catch (err) {
    if (err && err.message && imageExtensions.some(e => err.message.includes(e))) {
      return {
        format: 'module',
        source: 'export default ""',
        shortCircuit: true,
      };
    }
    throw err;
  }
}
