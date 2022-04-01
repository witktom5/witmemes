const mongoose = require('mongoose');
const { Schema } = mongoose;

const Comment = require('./comment');

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

ImageSchema.virtual('displayImg').get(function () {
  return this.url.replace('/upload', '/upload/w_800');
});

const opts = { toJSON: { virtuals: true } };

const MemeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: ImageSchema,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    category: {
      type: 'String',
      required: true,
      enum: [
        'Funny',
        'Gaming',
        'Weird',
        'Sport',
        'Movies',
        'Politics',
        'Animals',
      ],
      default: 'Funny',
    },
    upvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    added: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
    },
  },
  opts
);

MemeSchema.virtual('totalUpvotes').get(function () {
  return this.upvotedBy.length;
});

MemeSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
  }
});

module.exports = mongoose.model('Meme', MemeSchema);
