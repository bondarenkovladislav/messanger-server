const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const schema = require("./graphql/schema");
const resolver = require("./graphql/resolver");
const jwt = require("express-jwt");
const keys = require("./keys");
const setupWebSocket = require("./lib/setupWebSocket");

const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }
  return null;
};

app.use(
  jwt({
    secret: keys.JWT_SECRET,
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    algorithms: ["HS256"],
  })
);

const start = async () => {
  // await mongoose.connect('mongodb+srv://admin:ok2222@cluster0.abwwh.mongodb.net/data?retryWrites=true&w=majority', {
  await mongoose.connect(
    "mongodb+srv://admin:ok2222@cluster0.bdhv2.mongodb.net/data?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  );
  const port = process.env.PORT || 777;
  const expressServer = app.listen(port, () => {
    console.log("app available on port " + port);
    const wss = setupWebSocket(expressServer);
    app.use(
      graphqlHTTP((req) => ({
        schema: schema,
        rootValue: resolver,
        graphiql: true,
        context: {
          user: req.user,
          wss,
        },
      }))
    );
  });
};

start();

module.exports = app;
