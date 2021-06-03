const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`Database Connected`);
  } catch (err) {
    if (err) console.log(err.message);
  }
};

module.exports = connectDB;
