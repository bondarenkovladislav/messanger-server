const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");
const bcrypt = require("bcrypt");
const generateJwt = require("../lib/generateJwt");
const WebSocket = require("ws");

module.exports = {
  login: async ({ name, password }) => {
    const user = await User.findOne({ name });
    if (!user) {
      throw new Error("User Not Found");
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return generateJwt(name);
    } else {
      throw new Error("Incorrect password");
    }
  },
  createUser: async ({ user: { name, avatarUrl, password } }) => {
    const found = await User.find({ name });
    if (found.length) {
      throw new Error("User is already exists.");
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      avatarUrl,
      password: hash,
      chats: [],
    });
    await newUser.save();
    wss.broadcast("usersUpdate");
    return generateJwt(name);
  },
  getUser: async (_, { user }) => {
    if (!user) {
      throw new Error("Authentification error");
    }
    return User.findOne({ name: user.sub });
  },
  getUsers: async (_, { user }) => {
    if (!user) {
      throw new Error("Authentification error");
    }
    return User.find({ name: { $ne: user.sub } });
  },
  createChat: async ({ chat: { members } }) => {
    try {
      const newChat = new Chat({ members });
      await newChat.save();
      wss.broadcast("chatsUpdate");
      return "done";
    } catch (e) {
      throw new Error("Failed to create chat");
    }
  },
  createMessage: async ({ message }, { wss }) => {
    try {
      const newMessage = new Message(message);
      await newMessage.save();
      wss.broadcast("messagesUpdate");
      return "done";
    } catch (e) {
      throw new Error("Failed to create message");
    }
  },
  getChats: async ({ userId }) => {
    try {
      const chats = await Chat.find({ members: { $all: [userId] } }).populate(
        "members"
      );
      for (const chat of chats) {
        const messages = await Message.find({ chatId: chat._id }).sort([
          ["date", -1],
        ]);
        if (messages.length) {
          chat.lastMessage = messages[0];
        }
      }
      return chats;
    } catch (e) {
      throw new Error(e.message);
    }
  },
  getMessages: async ({ chatId }) => {
    try {
      return await Message.find({ chatId });
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
