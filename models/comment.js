const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: String,
  upvotedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
  ],
  downvotedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  added: {
    type: Date,
    required: true,
    default: Date.now,
    immutable: true,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
