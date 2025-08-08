const express = require('express');
const router = express.Router();
const ToolHistory = require('../models/HistorySchema');

// GET tool history
router.get('/:toolId/history', async (req, res) => {
  try {
    const history = await ToolHistory.find({ tool: req.params.toolId })
      .populate('user', 'name email')
       .populate('admin', 'name email') 
      .sort({ date: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
