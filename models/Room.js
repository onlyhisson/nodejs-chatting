import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    max: {
        type: Number,
        required: true,
        default: 10,
        min: 2,
    },
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    password: String,   // 설정하면 비공개방, 설정하지 않으면 공개방
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const model = mongoose.model("Room", RoomSchema);

export default model;
