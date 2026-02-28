const fs = require('fs');

const path = 'src/app/globals.css';
let content = fs.readFileSync(path, 'utf8');

const adStyles = `

/* ==========================================================
   ADSENSE PLACEHOLDERS
   ========================================================== */
.adsense-wrapper {
  margin: 40px auto;
  max-width: 800px;
  text-align: center;
  position: relative;
}

.adsense-container {
  background: rgba(59, 130, 246, 0.03);
  min-height: 120px;
  border: 1px dashed rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  overflow: hidden;
  position: relative;
}

.adsense-container::before {
  content: 'Advertisement Space';
  font-size: 13px;
  color: rgba(59, 130, 246, 0.4);
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: absolute;
  z-index: 0;
}

.adsbygoogle {
  z-index: 1;
  position: relative;
}

.adsense-note {
  font-size: 13px;
  color: #64748b;
  display: block;
  margin-top: 8px;
}
`;

if (!content.includes('ADSENSE PLACEHOLDERS')) {
    fs.appendFileSync(path, adStyles);
    console.log('Appended AdSense styles.');
} else {
    console.log('Styles already exist.');
}
