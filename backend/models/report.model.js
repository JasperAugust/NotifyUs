const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    // required: true  Change!
  },
  coordinates: {
    type: [Number],
    // required: true change after
  },
});

const reportSchema = new Schema({
  /* id: {
    type: String,
    default: uuid.v4
  }, */
  username: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  photo: {
    type: String,
    required: true,
  },
  location: {
    type: pointSchema,
    // required: true Change after!
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
