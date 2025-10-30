import {readFile, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import process from 'node:process';
import {optimize} from 'svgo';
import {validateSvgString} from '../src/utils/validateSvgCore.js';

const loadSvgoConfig = async () => {
  try {
    const imported = await import('../svgo.config.js');
    return imported.default ?? imported;
  } catch (error) {
    console.warn('Warning: Unable to load svgo.config.js, using defaults.');
    return {};
  }
};

export const cleanSvgFile = async (input) => {
  const raw = await readFile(input, 'utf8');
  const svgoConfig = await loadSvgoConfig();
  const {data: optimized} = optimize(raw, {
    path: input,
    ...svgoConfig,
  });

  const result = validateSvgString(optimized);
  if (!result.ok) {
    const error = new Error(
      `SVG validation failed for ${input}:\n${result.reasons.map((r) => ` - ${r}`).join('\n')}`
    );
    error.reasons = result.reasons;
    throw error;
  }

  await writeFile(input, optimized, 'utf8');
  return input;
};

const run = async () => {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node scripts/clean-svg.mjs path/to/file.svg');
    process.exit(1);
  }

  try {
    await cleanSvgFile(input);
    console.log('Cleaned & validated:', input);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(2);
  }
};

const isCliInvocation = () => {
  if (!process.argv[1]) {
    return false;
  }
  try {
    return pathToFileURL(process.argv[1]).href === import.meta.url;
  } catch (error) {
    return false;
  }
};

if (isCliInvocation()) {
  run().catch((error) => {
    console.error('Unexpected error while cleaning SVG:', error);
    process.exit(3);
  });
}
