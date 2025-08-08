const ToolHistory = require('../models/HistorySchema');

const logToolAction = async ({ tool, user, admin, action, date ,dataReturned , quantity}) => {
  try {
    
    const log = new ToolHistory({
      tool,
      user,
      admin,
      action,
      date,
      quantity,
      dataReturned
    });
    await log.save();
    console.log('Action logged successfully:', action, admin, tool, user);

   
    const history = await ToolHistory.find({ tool })
      .sort({ date: -1 }) 
      .skip(10); 

    if (history.length > 0) {
      const idsToDelete = history.map(item => item._id);
      await ToolHistory.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`Deleted ${idsToDelete.length} old history logs for tool ${tool}`);
    }

  } catch (err) {
    console.error("Error logging tool action:", err.message);
  }
};

module.exports = logToolAction;
