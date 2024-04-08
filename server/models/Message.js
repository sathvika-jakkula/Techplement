const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MessageSchema = new Schema({
    message: { type: String },
    author: { type: String },
    joinedInfo: {
        type: String
    }
},{
    timestamps:true
});

const Message = model('Message', MessageSchema);

module.exports = Message;
