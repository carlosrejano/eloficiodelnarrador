const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const middlewares = require("./middlewares");
const path = require("path");
const app = express();

app.use(morgan("common"));
//app.use(helmet());
app.use(express.static("src/public"));
app.use("/static", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  // res.json({
  //   message: "hello world",
  // });
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
