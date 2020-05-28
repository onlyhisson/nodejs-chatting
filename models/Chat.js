import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room',
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    chat: String,
    gif: String,    // gif 이미지 주소
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const model = mongoose.model("Chat", ChatSchema);

export default model;
