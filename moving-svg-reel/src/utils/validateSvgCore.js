import {XMLParser} from 'fast-xml-parser';

const allowedTags = new Set([
  'svg',
  'path',
  'defs',
  'linearGradient',
  'clipPath',
  'mask',
  'g',
  'text',
  'tspan',
  'stop',
  'title',
  'desc',
]);

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: false,
  removeNSPrefix: true,
});

export const validateSvgString = (svgString) => {
  const reasons = [];
  if (typeof svgString !== 'string' || svgString.trim().length === 0) {
    return {ok: false, reasons: ['SVG input is empty or not a string.']};
  }

  let parsed;
  try {
    parsed = parser.parse(svgString);
  } catch (error) {
    reasons.push(`SVG parsing failed: ${error instanceof Error ? error.message : String(error)}`);
    return {ok: false, reasons};
  }

  if (!parsed || typeof parsed !== 'object' || !parsed.svg) {
    reasons.push('Root <svg> element is missing.');
    return {ok: false, reasons};
  }

  let pathCount = 0;

  const visitNode = (nodeName, nodeValue, ancestry) => {
    if (!allowedTags.has(nodeName)) {
      reasons.push(`Tag <${nodeName}> is not allowed. Path: ${[...ancestry, nodeName].join(' > ')}`);
    }

    if (nodeValue == null) {
      return;
    }

    const attributes = {};
    for (const key of Object.keys(nodeValue)) {
      if (key.startsWith('@_')) {
        attributes[key.slice(2)] = nodeValue[key];
      }
    }

    if (nodeName === 'path') {
      pathCount += 1;
      if (attributes.stroke && attributes.stroke !== 'none') {
        const cap = attributes['stroke-linecap'] ?? attributes.strokeLinecap;
        const join = attributes['stroke-linejoin'] ?? attributes.strokeLinejoin;
        if ((cap ?? '').toLowerCase() !== 'round') {
          reasons.push('Path stroke-linecap must be "round" when stroke is present.');
        }
        if ((join ?? '').toLowerCase() !== 'round') {
          reasons.push('Path stroke-linejoin must be "round" when stroke is present.');
        }
      }
    }

    for (const key of Object.keys(nodeValue)) {
      if (key.startsWith('@_')) {
        continue;
      }
      const child = nodeValue[key];
      if (child == null) {
        continue;
      }
      if (Array.isArray(child)) {
        for (const entry of child) {
          if (entry && typeof entry === 'object') {
            visitNode(key, entry, [...ancestry, nodeName]);
          }
        }
      } else if (typeof child === 'object') {
        visitNode(key, child, [...ancestry, nodeName]);
      }
    }
  };

  visitNode('svg', parsed.svg, []);

  if (pathCount === 0) {
    reasons.push('At least one <path> element is required.');
  }

  if (pathCount > 12) {
    reasons.push(`SVG should contain a limited number of <path> elements (found ${pathCount}).`);
  }

  return {ok: reasons.length === 0, reasons};
};
