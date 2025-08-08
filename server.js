require("dotenv").config();
const express = require("express");
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const toolRoutes = require('./routes/tools');
const userRoutes = require('./routes/users');
 const requestRoutes = require('./routes/Request'); 
 const toolHistoryRoutes = require('./routes/History'); 
 const eventRoutes = require("./routes/Events");
const connectDB = require('./config/DB');
const PORT_1 = 3000;

app.use(cors());
app.use(express.json()); 


app.use('/api/auth', authRoutes);
app.use('/api', toolRoutes);
app.use('/api', userRoutes); 
app.use('/api', requestRoutes);
app.use('/api/history', toolHistoryRoutes);  
app.use("/api/events", eventRoutes);
 
  app.get("/", (req, res) => { 
  res.send("Serverrr is running.......");   
});
app.get("/ping", (req, res) => {    
  res.send("pong");
});
  
connectDB();
// db.stats();
// if (require.main === module) {
  
  
// }
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
// module.exports = app;


// const Config = require('./models/ConfigSchema');

// const initializeConfig = async () => {
//   const config = await Config.findOne();
//   if (!config) {
//     await Config.create({ isLoginDisabledForUser: false });
//     console.log("Default config document created.");
//   }
// };

// initializeConfig();

// const XLSX = require('xlsx');
// const path = require('path');
// const Tool = require('./scripts/toolschema');

// async function importExcelData() {
//   try {
//       console.log("📥 Started importing Excel data...");
//    const filePath = path.join(__dirname, 'Components List.xlsx');

//     console.log("Loading Excel file from:", filePath);

//     const workbook = XLSX.readFile(filePath);
//     const categories = workbook.SheetNames;

//     console.log(`📁 Found sheets: ${categories.join(', ')}`);

//     for (let sheetName of categories) {
//       const sheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(sheet);
// console.log(data);
//       console.log(`📄 Processing sheet: ${sheetName} - ${data.length} rows`);

//       const tools = data.map((item) => ({
//         name: item['Component Name'] || 'Unnamed',
//         description: item['Description'] || '',
//         specification: item['Specification'] || '',
//         quantity: parseInt(extractNumber(item['Quantity'])) || 0,
//         available: parseInt(extractNumber(item['Available'])) || 0,
//         category: sheetName,
//       }));

//       if (tools.length > 0) {
//         await Tool.insertMany(tools);
//         console.log(`✅ Inserted ${tools.length} tools from "${sheetName}"`);
//       } else {
//         console.log(`⚠️ No tools found in "${sheetName}"`);
//       }
//     }

//     mongoose.disconnect();
//     console.log("🔌 MongoDB disconnected");
//   } catch (error) {
//     console.error('❌ Error during import:', error);
//     mongoose.disconnect();
//   }
// }

// function extractNumber(value) {
//   if (!value) return 0;
//   try {
//     if (typeof value === 'number') return value;
//     if (value.includes('x')) {
//       return value.split('x').reduce((a, b) => parseInt(a) * parseInt(b));
//     }
//     if (value.includes('+')) {
//       return value.split('+').reduce((a, b) => parseInt(a) + parseInt(b));
//     }
//     return parseInt(value);
//   } catch {
//     return 0;
//   }
// }
// console.log("✅ Script finished");

