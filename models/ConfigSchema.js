const mongoose = require('mongoose');

const config = new mongoose.Schema({
  isLoginDisabledForUser :{
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('config', config);
