const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['competition', 'update', 'workshop', 'announcement' , 'tranning'], 
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  photos: {
    type: [String],
    default: []
  },
  googleFormUrl: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Event", EventSchema);
