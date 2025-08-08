const express = require("express");

const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');

const upload = multer();
const bcrypt = require('bcrypt');


const User = require("../models/UsersSchema");
const {AllUsers , AddUser , UpdateUser , DeleteUser , deleteAll}= require("../controllers/usersControllers");

router.post("/users", AddUser);

router.put("/users/:id",UpdateUser);


router.delete("/users/:id", DeleteUser);

router.get("/users/all", AllUsers);

router.delete("/deleteAll" , deleteAll);

router.get("/ping", (req, res) => {
  res.send("pong from /api/ping");
});




// Route to upload Excel for users
router.post('/upload-users', upload.single('file'), async (req, res) => {
  try {
    console.log("Received user upload request");
    const fileBuffer = req.file.buffer;

    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    console.log("Parsed Users Data:", jsonData);

    // Hash passwords before inserting
    const usersData = await Promise.all(jsonData.map(async (item, index) => {
      const hashedPassword = await bcrypt.hash(String(item.password), 10);


      return {
        name: item.name || `Unnamed ${index + 1}`,
        email: item.email,
        password: hashedPassword,
        role: 'student',
        studentId: item.studentId || `SID${index + 1}`,
      };
    }));

    await User.insertMany(usersData);

    res.status(200).json({ message: `${usersData.length} users imported successfully!` });
  } catch (error) {
    console.error("Error importing users:", error);
    res.status(500).json({ message: 'Failed to import users from Excel.' });
  }
});



module.exports = router;    
