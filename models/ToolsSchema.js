const mongoose = require('mongoose');

const Request = require('./RequestSchema');
const toolSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  imageUrl: String,
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance'], 
    default: 'Available'
  },
  quantity: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    default: ''
  },
  specifications: {
    type: String,
    default: ''
  },
});

toolSchema.pre('findOneAndDelete', async function (next) {
  const tool = await this.model.findOne(this.getQuery());
  if (tool) {
    await Request.deleteMany({ toolId: tool._id }); 
  }
  next();
});

module.exports = mongoose.model('Tool', toolSchema);
