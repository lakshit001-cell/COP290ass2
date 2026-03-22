import gts from 'gts';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let customConfig = [];
const ignoresPath = path.resolve(__dirname, 'eslint.ignores.js');

if (fs.existsSync(ignoresPath)) {
    // Dynamic import for the ignores file
    const { default: ignores } = await import('./eslint.ignores.cjs');
    customConfig = [{ ignores }];
}

export default [
    ...customConfig,
    ...gts 
];