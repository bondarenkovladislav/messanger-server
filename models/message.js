const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  content: String,
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: String, required: true },
});

module.exports = model("Message", messageSchema);
