import {readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {cleanSvgFile} from './clean-svg.mjs';

const here = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(here), '..');
const svgDir = path.join(projectRoot, 'src', 'assets', 'svg');

const run = async () => {
  let entries;
  try {
    entries = await readdir(svgDir, {withFileTypes: true});
  } catch (error) {
    console.error(`Unable to read SVG directory at ${svgDir}:`, error);
    process.exit(1);
  }

  const svgFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))
    .map((entry) => path.join(svgDir, entry.name));

  if (svgFiles.length === 0) {
    console.log(`No SVG files found in ${svgDir}.`);
    return;
  }

  let hadError = false;
  for (const file of svgFiles) {
    try {
      await cleanSvgFile(file);
      console.log('Cleaned & validated:', path.relative(projectRoot, file));
    } catch (error) {
      hadError = true;
      console.error(error instanceof Error ? error.message : error);
    }
  }

  if (hadError) {
    process.exit(2);
  }
};

run().catch((error) => {
  console.error('Unexpected failure while cleaning SVG files:', error);
  process.exit(3);
});
