const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

//App Config
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

//Middleware
app.use(express.json({ extended: false }));
app.use(cors());

//Database
connectDB();

//Api Routes
app.use("/api/user", require("./routes/user"));

app.listen(port, () => {
  console.log(`Server running on Port: ${port}`);
});
