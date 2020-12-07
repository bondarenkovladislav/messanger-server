const { buildSchema } = require("graphql");
module.exports = buildSchema(`
    type Chat {
        _id: String!
        members: [User!]!
        lastMessage: Message
    }

    type Message {
        content: String
        chatId: String!
        authorId: String!
        date: String!
        _id: String!
    }
    
    type User {
        name: String!
        avatarUrl: String
        chats: [Chat!]!
        _id: String!
    }
    
    input UserInput {
        name: String!
        avatarUrl: String
        password: String!
    }
    
    input ChatInput {
        members: [String!]!
    }
    
    input MessageInput {
        content: String!
        chatId: String!
        authorId: String!
        date: String!
    }
    
    type Query {
        login(name: String!, password: String!): String
        getUser: User
        getUsers: [User!]!
        getChats(userId: ID!): [Chat!]!
        getMessages(chatId: ID!): [Message!]!
    }
    
    type Mutation {
        createUser(user: UserInput!): String
        createChat(chat: ChatInput): String
        createMessage(message: MessageInput): String
    }
      `);
