const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-[#F2F2F7]': 'bg-academy-bg',
  'border-[#F2F2F7]': 'border-academy-border',
  'divide-[#F2F2F7]': 'divide-academy-border',
  'text-[#1C1C1E]': 'text-academy-text',
  'bg-[#1C1C1E]': 'bg-academy-text',
  'text-[#8B5CF6]': 'text-academy-primary',
  'bg-[#8B5CF6]': 'bg-academy-primary',
  'border-[#8B5CF6]': 'border-academy-primary',
  'text-[#8E8E93]': 'text-academy-muted',
  'bg-[#8E8E93]': 'bg-academy-muted',
  'bg-[#E9E9EB]': 'bg-academy-soft',
  'bg-[#E5E5EA]': 'bg-academy-border',
  'border-[#E5E5EA]': 'border-academy-border',
  'text-[#C7C7CC]': 'text-academy-muted',
  "'#F2F2F7'": "'var(--academy-bg)'",
  "'#1C1C1E'": "'var(--academy-text)'",
  "'#8B5CF6'": "'var(--academy-primary)'"
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  for (const [key, value] of Object.entries(replacements)) {
    // Escape brackets for regex
    const regex = new RegExp(key.replace(/[\[\]]/g, '\\$&'), 'g');
    updated = updated.replace(regex, value);
  }
  
  if (content !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Done.');
