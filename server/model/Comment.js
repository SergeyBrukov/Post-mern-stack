import { Schema, Types, model } from 'mongoose';

const schema = Schema(
  {
    postId: { type: Types.ObjectId, ref: 'Post' },
    author: {
      type: Object,
      userId: {
        type: Types.ObjectId,
        ref: 'User',
      },
      userName: {
        type: String,
        required: true,
      },
    },
    text: { type: String, required: true },
    like: {
      count: { type: Number, default: 0 },
      userLikesId: [{ type: Types.ObjectId, ref: 'User' }],
    },
    disLike: {
      count: { type: Number, default: 0 },
      userLikesId: [{ type: Types.ObjectId, ref: 'User' }],
    },
  },
  {
    timestamps: true,
  },
);

export default model('Comment', schema);
