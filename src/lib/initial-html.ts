import fs from 'fs';
import path from 'path';

// Note: This reads the file at build time. 
// Changes to initial.html will require a server restart in development.
export const initialHtml = fs.readFileSync(
  path.join(process.cwd(), 'src/lib/initial.html'),
  'utf8'
);
