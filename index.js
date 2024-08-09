// all packages imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// initializing the packagess
const app = express();
const port = process.env.PORT || 3000;
const DB = process.env.MONGO_URI;
const routes = require("./routes/auth_routes");
// const cloudinary = require("./cloudinary/cloudinary.confi");

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);
// app.use("/", cloudinary);

// server runnings
app.get("/", (req, res) => {
  res.send("hell");
});

// Configuration
// cloudinary.config({
//   cloud_name: "dgm07yv9g",
//   api_key: "519773473144764",
//   api_secret: "dzJa7LOTbizs2Gq5gVr7zdeN7cA", // Click 'View Credentials' below to copy your API secret
// });
// console.log("cloudinary config", cloudinary.config());
mongoose
  .connect(DB)
  .then(() => console.log("Connected database"))
  .catch((err) => console.log("error occured", err));

app.listen(port, () => {
  console.log("server runninng on port:", port);
});
