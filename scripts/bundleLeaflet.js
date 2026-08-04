const fs   = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const jsContent  = fs.readFileSync(path.join(root, 'assets/leaflet/leaflet.min.js'),  'utf8');
const cssContent = fs.readFileSync(path.join(root, 'assets/leaflet/leaflet.min.css'), 'utf8');

const output = `// Auto-generado — no editar manualmente
// Fuente: leaflet@1.9.4 (cdn.jsdelivr.net)
export const LEAFLET_JS  = ${JSON.stringify(jsContent)};
export const LEAFLET_CSS = ${JSON.stringify(cssContent)};
`;

fs.writeFileSync(path.join(root, 'src/utils/leafletBundle.js'), output, 'utf8');
console.log('leafletBundle.js generado OK');
