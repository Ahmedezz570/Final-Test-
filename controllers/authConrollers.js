const User = require('../models/UsersSchema'); 
const Config = require('../models/ConfigSchema');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
     const { email, password } = req.body;
      console.log("Received login request:", req.body);
      try {
        const config = await Config.findOne();
       console.log("Looking for user...");
        const user = await User.findOne({ email }); 
        console.log("User:", user);
        if (config?.isLoginDisabledForUser && user.role !== 'admin'){
          return res.status(403).json({ message: "Login is currently disabled for users" });
        }
        if (!user) return res.status(400).json({ message: "User not found" });
    
        console.log("Comparing passwords...");
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log("Password match:", isPasswordCorrect);
        if (!isPasswordCorrect)
          return res.status(400).json({ message: "Invalid credentials" });
    
       
        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role , name : user.name },
          'your_secret_key',
          { expiresIn: '1d' }
        );
    
        
        res.status(200).json({
          message: "Login successful",
          token, 
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token, 
            createdAt: user.createdAt,
            studentId: user.studentId,
          }
        });
      } catch (err) {
        console.error("🔴 Error during login:", err.message);
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
      }
}

const checkLoginStatus = async (req, res) => {
     try {
       const {disableLogin}= req.body;
       await Config.updateOne({}, { isLoginDisabledForUser: disableLogin });
        res.status(200).json({ message: "Login status updated successfully" });
    
      } catch (err) {
        console.error("Error updating login status:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
      }
}

const loginStatus = async (req, res) => {
     try {
        const config = await Config.findOne();
        res.status(200).json({ isLoginDisabledForUser: config?.isLoginDisabledForUser });
      } catch (err) {
        res.status(500).json({ message: "Error fetching status", error: err.message });
      }
}

module.exports = {
    loginUser,
    checkLoginStatus,
    loginStatus
};