require('dotenv').config();
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const Tool = require('./toolschema');

mongoose.connect("mongodb+srv://ahmedez570:7253416@cluster.bxlgmut.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log('✅ Connected'))
  .then(importExcelData)
  .catch(err => console.error('❌ Error:', err));

async function importExcelData() {
  try {
      console.log("📥 Started importing Excel data...");
    const filePath = path.join(__dirname, './ComponentList.xlsx');
    const workbook = XLSX.readFile(filePath);
    const categories = workbook.SheetNames;

    console.log(`📁 Found sheets: ${categories.join(', ')}`);

    for (let sheetName of categories) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
console.log(data);
      console.log(`📄 Processing sheet: ${sheetName} - ${data.length} rows`);

      const tools = data.map((item) => ({
        name: item['Component Name'] || 'Unnamed',
        description: item['Description'] || '',
        specification: item['Specification'] || '',
        quantity: parseInt(extractNumber(item['Quantity'])) || 0,
        available: parseInt(extractNumber(item['Available'])) || 0,
        category: sheetName,
      }));

      if (tools.length > 0) {
        await Tool.insertMany(tools);
        console.log(`✅ Inserted ${tools.length} tools from "${sheetName}"`);
      } else {
        console.log(`⚠️ No tools found in "${sheetName}"`);
      }
    }

    mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  } catch (error) {
    console.error('❌ Error during import:', error);
    mongoose.disconnect();
  }
}

// استخراج الرقم من صيغة زي "5x3" أو "10+5"
function extractNumber(value) {
  if (!value) return 0;
  try {
    if (typeof value === 'number') return value;
    if (value.includes('x')) {
      return value.split('x').reduce((a, b) => parseInt(a) * parseInt(b));
    }
    if (value.includes('+')) {
      return value.split('+').reduce((a, b) => parseInt(a) + parseInt(b));
    }
    return parseInt(value);
  } catch {
    return 0;
  }
}
console.log("✅ Script finished");
