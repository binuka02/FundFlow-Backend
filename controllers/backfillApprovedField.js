// scripts/backfillApprovedField.js
const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await User.updateMany(
      { approved: { $exists: false } },
      { $set: { approved: true } } // or false, depending on your logic
    );

    console.log("Updated documents:", result.modifiedCount);
    mongoose.disconnect();
  } catch (err) {
    console.error("Error updating users:", err);
    process.exit(1);
  }
})();
