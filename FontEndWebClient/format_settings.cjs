const fs = require('fs');
const file = 'e:/project/AgriculturalMarketplace/FontEndWebClient/src/pages/admin/SettingsPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace labels
content = content.replace(/className="block text-sm font-medium text-gray-700 mb-1"/g, 'className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1"');

// Replace inputs and textareas
const inputClass = 'className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"';
const newClass = 'className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"';

content = content.split(inputClass).join(newClass);

fs.writeFileSync(file, content);
console.log('Done');
