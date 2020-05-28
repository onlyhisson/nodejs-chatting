import mongoose from "mongoose";

const PostsSchema = new mongoose.Schema({
  //name: String,
  //email: String,
  title: String,
  subTitle: String,
  postContent: String,
  fileUrl: String,
  writerId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  },
});

const model = mongoose.model("Posts", PostsSchema);

export default model;
