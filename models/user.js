const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  avatarUrl: String,
  chats: [
    {
      chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
      },
    },
  ],
  password: String
});

module.exports = model("User", userSchema);
