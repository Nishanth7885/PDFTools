const fs = require('fs');
let code = fs.readFileSync('controllers/pdfController.js', 'utf8');

const helpers = `
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const os = require('os');

const getGS = () => os.platform() === 'win32' ? 'gswin64c' : 'gs';

const tryGhostscriptCompress = async (inputPath, outputPath) => {
    try {
        const cmd = \`\${getGS()} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="\${outputPath}" "\${inputPath}"\`;
        await execPromise(cmd);
        return true;
    } catch (e) { return false; }
};

const tryGhostscriptRepair = async (inputPath, outputPath) => {
    try {
        const cmd = \`\${getGS()} -o "\${outputPath}" -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress "\${inputPath}"\`;
        await execPromise(cmd);
        return true;
    } catch (e) { return false; }
};

const robustLoad = async (filePath) => {
    try {
        const bytes = fs.readFileSync(filePath);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        return { doc, bytes };
    } catch (e) {
        if (e.message.includes('pattern') || e.message.includes('Failed to parse')) {
            const tempOut = filePath + '.fixed.pdf';
            const repaired = await tryGhostscriptRepair(filePath, tempOut);
            if (!repaired) throw new Error('Cannot repair this PDF structure. Please ensure Ghostscript is installed (apt-get install ghostscript).');
            const newBytes = fs.readFileSync(tempOut);
            fs.unlinkSync(tempOut);
            const doc = await PDFDocument.load(newBytes, { ignoreEncryption: true });
            return { doc, bytes: newBytes };
        }
        throw e;
    }
};
`;

code = code.replace("const path = require('path');", "const path = require('path');\n" + helpers);

const oldCmp = "const pdfDoc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });";
code = code.replace("const inputBytes = fs.readFileSync(req.file.path);\n        const pdfDoc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });", "const { doc: pdfDoc, bytes: inputBytes } = await robustLoad(req.file.path);");

// Merge
code = code.split("const b = fs.readFileSync(f.path); totalSize += b.length; const d = await PDFDocument.load(b, { ignoreEncryption: true });").join("const { doc: d, bytes: b } = await robustLoad(f.path); totalSize += b.length;");

// Split
code = code.split("const pdfDoc = await PDFDocument.load(fs.readFileSync(req.file.path), { ignoreEncryption: true });").join("const { doc: pdfDoc } = await robustLoad(req.file.path);");

fs.writeFileSync('controllers/pdfController.js', code);
console.log('Robust loading added to main functions.');
