const express = require('express');
const router = express.Router();
const Tool = require('../models/ToolsSchema'); 
const t = require('../scripts/toolschema');
const logToolAction = require('../utils/logToolAction'); 
const authMiddleware = require('../middleware/auth'); 
const multer = require('multer');
const xlsx = require('xlsx');
const upload = multer({ storage: multer.memoryStorage() });


const {addTool , getAllTools , getToolById , deleteAll} = require('../controllers/toolsControllers');

// POST /api/tools/add
router.post('/addTool',addTool);

  // PUT /api/tools/update/:id
router.put('/update/:toolId', async (req, res) => {
    const { toolId } = req.params;
    const updatedData = req.body;
  
    try {
      const updatedTool = await Tool.findByIdAndUpdate(
        toolId,            
        updatedData,       
        { new: true }
      );
  
      if (!updatedTool) {
        return res.status(404).json({ message: 'Tool not found' });
      }
  
      res.status(200).json({ message: 'Tool updated successfully', tool: updatedTool });
    } catch (error) {
      console.error("Error updating tool:", error);
      res.status(500).json({ message: 'Error updating tool', error: error.message });
    }
  });
  
  
// DELETE /api/tools/delete/:id
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedTool = await Tool.findByIdAndDelete(id);
      if (!deletedTool) return res.status(404).json({ message: 'Tool not found' });
  
      res.json({ message: 'Tool deleted successfully', tool: deletedTool });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting tool', error });
    }

  });

  
  router.delete('/delete-all', deleteAll);
// Get /api/tools/all
  router.get('/allTools' , getAllTools);
// Get /api/tools/all/:id
  router.get('/:id', getToolById);
  
//   router.post('/upload-excel', upload.single('file'), async (req, res) => {
//   try {
//     const fileBuffer = req.file.buffer;
//     const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);

//     // map الداتا حسب الموديل بتاعك
//     const equipmentData = jsonData.map((item, index) => ({
//       name: item.name,
//       description: item.description,
//       // category: item.category,
//       status: item.status || 'available',
//       // imageUrl: '/placeholder.svg',
//       quantity: item.quantity,
//       specifications: {
//         power: item.power || '',
//         weight: item.weight || '',
//         dimensions: item.dimensions || '',
//       },
//       // history: [{
//       //   userId: '1',
//       //   action: 'created',
//       //   timestamp: new Date().toISOString().split('T')[0],
//       //   notes: 'Equipment imported from Excel'
//       // }]
//     }));

//     await t.insertMany(equipmentData);

//     res.status(200).json({ message: `${equipmentData.length} items imported successfully!` });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to process Excel file.' });
//   }
// });
  
// router.post('/upload-excel', upload.single('file'), async (req, res) => {
//   try {
//     const fileBuffer = req.file.buffer;
//     const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);

//     console.log("🚀 Excel JSON Data:", jsonData);

//     res.status(200).json({ message: 'Excel file parsed successfully!', data: jsonData });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to process Excel file.' });
//   }
// });



router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {

     console.log("Received upload request");
    console.log("File:", req.file);
    console.log("Category:", req.body.category);
    const fileBuffer = req.file.buffer;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    console.log("Parsed JSON Data:", jsonData);

    const parseQuantity = (val) => {
      if (typeof val === 'string') {
        const numbers = val.match(/\d+/g);
        return numbers ? numbers.map(Number).reduce((a, b) => a + b, 0) : 0;
      }
      return Number(val) || 0;
    };

    const toolsData = jsonData.map((item, index) => ({
      name: item.name || `Unnamed ${index + 1}`,
      quantity: parseQuantity(item.quantity),
      description: item.description || '',
      notes: item.notes || '',
      category, 
      status: 'available',
    }));

    await Tool.insertMany(toolsData);

    res.status(200).json({ message: `${toolsData.length} items imported successfully!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process Excel file.' });
  }
});



  module.exports = router;