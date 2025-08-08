const express = require('express');
const router = express.Router();
const RentRequest = require('../models/RequestSchema');

const authMiddleware = require('../middleware/auth'); 
const Tool = require('../models/ToolsSchema');
const logToolAction = require('../utils/logToolAction');
router.post('/rent/:toolId', authMiddleware, async (req, res) => {
  const { toolId } = req.params;
  const { reason } = req.body;

   console.log(req.body.startDate);
    console.log(req.body.level);
    console.log(req.body.reason);
    console.log(req.body.quantity);

  try {
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    const request = new RentRequest({
       toolId: toolId,      
       userId: req.user._id,    
      reason,
      expectedReturnDate: req.body.expectedReturnDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      startDate: req.body.startDate || new Date(),
      level: req.body.level || 'none',
      quantity : req.body.quantity || 1,
    });
   

    await request.save();
    //  await logToolAction({
    //         tool: tool._id, 
    //         user: req.user._id, 
    //         action: 'pending' ,
    //         date: new Date(),
    //       });
    res.status(201).json({ message: 'Request has been send succefuly', request }); 

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the request' });
  }
});


router.get('/rent/requests', async (req, res) => {
  try {
    const requests = await RentRequest.find(); 
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الطلبات' });
  }
});


router.post('/rent/approve/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const request = await RentRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: ' Request not found' });
    }

    const tool = await Tool.findById(request.toolId);
    if (!tool) {
      return res.status(404).json({ error: 'Tool Not Exsit' });
    }

    const quantity = Number(tool.quantity);
    if (quantity <= 0) {
       console.log('Quantity is not enough');
      return res.status(400).json({ error: 'Quantity is not enough' });
     
    }

   
   

   
    if (tool.quantity > 0) {
      tool.quantity = quantity - request.quantity;
    } else {
      tool.status = 'rented';
    }
    if (tool.quantity == 0){
      tool.status = 'rented';
    }

    await tool.save();

    request.status = 'approved';
    await request.save();

    // await logToolAction({
    //   tool: request.toolId,
    //   user: request.userId,
    //   admin: req.user._id,
    //   action: 'rented',
    // });

    res.status(200).json({ message: 'Done', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error during approved' });
  }
});




router.post('/rent/reject/:id', async (req, res) => {
  const { id } = req.params;
    const { reason } = req.body;

   try {
    const request = await RentRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }

    request.status = 'rejected';
    request.rejectionReason = reason || 'لم يتم تحديد السبب'; 
    await request.save();

    res.status(200).json({ message: 'تم رفض الطلب بنجاح', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء رفض الطلب' });
  }
});

router.delete('/rent/delete/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const request = await RentRequest.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }

    res.status(200).json({ message: 'تم حذف الطلب بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف الطلب' });
  }
});

router.post('/rent/return/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const request = await RentRequest.findById(id);
    if (!request || request.status !== 'approved') {
      return res.status(400).json({ error: 'الطلب غير موجود أو غير مؤجَّر حاليًا' });
    }

    request.status = 'returned';
    await request.save();

    const tool = await Tool.findById(request.toolId);
    if (tool) {
      tool.status = 'Available';
      tool.quantity += request.quantity; 
      await tool.save();
    }

    await logToolAction({
      tool: request.toolId,
      user: request.userId,
      admin: req.user._id,
      action: 'returned',
      dataReturned: new Date(),
      date : request.startDate,
      quantity: request.quantity
    });

    res.status(200).json({ message: 'تم إرجاع الأداة بنجاح', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ أثناء إرجاع الأداة' });
  }
});


module.exports = router;
