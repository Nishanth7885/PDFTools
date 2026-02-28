const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

walk(path.join(__dirname, 'src', 'app'), file => {
    if (!file.endsWith('.js')) return;
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Pattern 1:
    let oldP1 = "let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText || 'Server error' }; }";
    let newP1 = "let errData; const errText = await response.text(); try { errData = JSON.parse(errText); } catch(e) { errData = { error: errText.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : (errText || 'Server error') }; }";

    if (content.includes(oldP1)) {
        content = content.split(oldP1).join(newP1);
        changed = true;
    }

    // Pattern 2:
    let oldP2 = "!r.ok) { let eTxt = await r.text(); let eObj={}; try { eObj=JSON.parse(eTxt); } catch(e){} throw new Error(eObj.error || eTxt || ";
    let newP2 = "!r.ok) { let eTxt = await r.text(); let eObj={}; try { eObj=JSON.parse(eTxt); } catch(e){} throw new Error(eObj.error || (eTxt.includes('<html') ? 'This PDF is unsupported, corrupted, or too complex to process.' : eTxt) || ";

    if (content.includes(oldP2)) {
        content = content.split(oldP2).join(newP2);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
});
