const fs = require('fs');
const path = require('path');

const appDir = path.join('d:', 'PDFtools', 'frontend', 'src', 'app');

// Find all directories in src/app
const dirs = fs.readdirSync(appDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

// Function to inject alternate canonical tag into metadata
const injectCanonical = (filePath, slug) => {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // If alternates already exists, we skip it to prevent duplication
    if (content.includes('alternates:')) {
        console.log(`SKIP (Already has alternates): ${slug} in ${path.basename(filePath)}`);
        return;
    }

    const exportMatch = content.match(/export const metadata = \{/);
    if (exportMatch) {
        const injectStr = `
  alternates: {
    canonical: '/${slug}',
  },`;

        const newContent = content.replace(/export const metadata = \{/, `export const metadata = {${injectStr}`);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`ENRICHED: Added canonical '/${slug}' to ${path.basename(filePath)}`);
    }
};

for (const dir of dirs) {
    // We check both layout.js and page.js since sometimes metadata is in one or the other
    const layoutPath = path.join(appDir, dir, 'layout.js');
    const pagePath = path.join(appDir, dir, 'page.js');

    const hasLayout = fs.existsSync(layoutPath) && fs.readFileSync(layoutPath, 'utf8').includes('export const metadata');
    const hasPage = fs.existsSync(pagePath) && fs.readFileSync(pagePath, 'utf8').includes('export const metadata');

    if (hasLayout) {
        injectCanonical(layoutPath, dir);
    } else if (hasPage) {
        injectCanonical(pagePath, dir);
    } else {
        console.log(`WARNING: Could not find metadata export in ${dir}`);
    }
}

console.log('Finished processing canonical tags!');
