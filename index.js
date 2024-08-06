// all packages imports
const express = require("express");
const cors = require("cors");
// initializing the packagess
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// server runnings
app.listen(port, () => {
  console.log("server runninng on port:", port);
});
