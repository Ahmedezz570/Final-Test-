
// const mongoose = require('mongoose');

// const toolSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     default: '',
//   },
//   specification: {
//     type: String,
//     default: '',
//   },
//   quantity: {
//     type: Number,
//     default: 0,
//   },
//   available: {
//     type: Number,
//     default: 0,
//   },
//   status: {
//     type: String,
//     enum: ['Available', 'In Use', 'Maintenance'],
//     default: 'Available'
//   },
//   category: {
//     type: String, // زى Control, PCB, Structure
//     required: true
//   },
//   image: {
//     type: String,
//     default: '',
//   },
// });

// module.exports = mongoose.model('Toolll', toolSchema);

const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
category: {
    type: String, 
    required: true
  },

}, { timestamps: true });


module.exports = mongoose.model('Toollll', ToolSchema);

