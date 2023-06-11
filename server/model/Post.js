import { Schema, Types, model } from 'mongoose';

const schema = new Schema(
  {
    userName: { type: String },
    title: { type: String, required: true },
    text: { type: String, required: true },
    mainImage: { type: String, default: '' },
    gallery: [{ type: Object, default: [] }],
    views: { type: Number, default: 0 },
    author: { type: Types.ObjectId, ref: 'User' },
    comments: [{ type: Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  },
);

export default model('Post', schema);
