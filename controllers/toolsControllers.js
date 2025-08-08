const Tools = require('../models/ToolsSchema');
const HistorySchema = require('../models/HistorySchema'); 
const RentRequest = require('../models/RequestSchema');
const addTool = async (req, res) => {
       const { name, category, description, status ,imageUrl, quantity , specifications ,notes} = req.body;
        
          try {
            const newTool = new Tools({
              
              name,
              category,
              description, 
              status,
              quantity,
              imageUrl, 
              specifications,
              notes
            });
        
            await newTool.save();
            // await logToolAction({
            //   tool: newTool._id, 
            //   user: req.user._id, 
            //   admin: req.user._id,
            //   action: 'created' ,
            //   date: new Date(),
            // });
            res.status(201).json({ message: 'Tool added successfully', tool: newTool });
          } catch (error) {
      
            console.error("Error adding tool:", error); 
        res.status(500).json({ message: 'Error adding tool', error: error.message });
          }
}

const getAllTools =async (req, res) => {
    try {
      const tools = await Tools.find();
      res.status(200).json(tools); 
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ message: 'Error fetching tools', error: error.message });
    }
  };
  const getToolById = async (req, res) => {
     const { id } = req.params; 
      
        try {
          const tool = await Tools.findById(id); 
          if (!tool) {
            return res.status(404).json({ message: 'Tool not found' }); 
          }
      
          res.status(200).json(tool); 
        } catch (error) {
          console.error("Error fetching tool:", error);
          res.status(500).json({ message: 'Error fetching tool', error: error.message }); 
        }
  }
  const deleteAll = async (req , res) =>{
    try {
        const result = await Tools.deleteMany({});
          const requestDeleteResult = await RentRequest.deleteMany({});

   
    const logDeleteResult = await HistorySchema.deleteMany({});
        res.status(200).json({
      message: 'All tools, requests, and logs deleted successfully',
      deletedTools: result.deletedCount,
      deletedRequests: requestDeleteResult.deletedCount,
      deletedLogs: logDeleteResult.deletedCount
    });
  } catch (error) {
    console.error('error ', error);
    res.status(500).json({
      message: 'error deleting all tools, requests, and logs',
      error: error.message
    });
  }
  }
module.exports = {addTool , getAllTools , getToolById , deleteAll};