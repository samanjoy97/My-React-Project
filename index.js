const express = require("express");
const app = express();

const fileupload = require("express-fileupload");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(fileupload());

const db = require("./models");

//Routers
const questionRouter = require("./routes/Questions");
//./routes/Questions
app.use("/questions", questionRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
