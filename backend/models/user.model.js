const mongoose = require('mongoose');
const uuid = require('uuid');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    /*  id: {
      type: String,
      default: uuid.v4
    }, */
    username: {
      type: String,
      required: true,

      unique: true,
      trim: true,
      minlength: 3,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
