const bcrypt = require('bcrypt');
const User = require("../models/UsersSchema"); 
const RentalRequest = require("../models/RequestSchema");
const Tools = require("../models/ToolsSchema");
const AddUser =  async (req, res) => {
  const { name, email, password, role, studentId } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); 
  try {
    const newUser = new User({
      name,
      email,
      password: hashedPassword, 
      role,
      studentId,
    });
    
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message }); 
  }
};

const UpdateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, studentId } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

   
    let hashedPassword = user.password;
    if (password && password !== user.password) {
      const isSame = await bcrypt.compare(password, user.password);
      if (!isSame) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        password: hashedPassword,
        role,
        studentId,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const DeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Delete related rental requests
    await RentalRequest.deleteMany({ userId: id });

    res.status(200).json({ message: "User and related requests deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const AllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
const deleteAll = async (req, res) => {
  try {
    console.log("🔁 deleteAll route HIT!");

    // Step 1: Delete non-admin users
    console.log("🧹 Step 1: Deleting all non-admin users...");
    const result = await User.deleteMany({ role: { $ne: "admin" } });
    console.log(`✅ Step 1 done: Deleted ${result.deletedCount} users.`);

    // Step 2: Delete all rental requests
    console.log("🧹 Step 2: Deleting all rental requests...");
    const deletedRequests = await RentalRequest.deleteMany({});
    console.log(`✅ Step 2 done: Deleted ${deletedRequests.deletedCount} rental requests.`);

    // Step 3: Update all tools to status = 'Available'
    console.log("🔄 Step 3: Setting all tools status to 'Available'...");
    const updatedTools = await Tools.updateMany({}, { status: "Available" });
    console.log(`✅ Step 3 done: Updated ${updatedTools.modifiedCount || updatedTools.nModified} tools.`);

    res.status(200).json({
      message: "All non-admin users and rental requests deleted, and all tools set to Available.",
      deletedUsers: result.deletedCount,
      deletedRequests: deletedRequests.deletedCount,
      updatedTools: updatedTools.modifiedCount || updatedTools.nModified
    });
  } catch (error) {
    console.error("❌ Error deleting data:", error);
    res.status(500).json({
      message: "Failed to complete delete/reset operation.",
      error: error.message
    });
  }
};




module.exports = {
    AllUsers ,
    AddUser,
    UpdateUser,
    DeleteUser,
    deleteAll
};