import { Schema, Types, model } from 'mongoose';

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    posts: [{ type: Types.ObjectId, ref: 'Post' }],
  },
  {
    timestamps: true,
  },
);

export default model('User', schema);
