const mongoose = require('mongoose');

const WorkloadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  weekname: {
    type: String,
    required: true
  },
  weekstartdate: {
    type: Date,
    required: true
  },
  weeklastdate: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('workload', WorkloadSchema);
