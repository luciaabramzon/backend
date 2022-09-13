const { Schema, model } = require("mongoose");

const webChat = new Schema({
  author: {type: Object, required: true},
  mensaje: {type: String, required: true},
},{timestamps:true});

const Chat = model('chat', webChat);

module.exports = {
  webChat,
  Chat
}