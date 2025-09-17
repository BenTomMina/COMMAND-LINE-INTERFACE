import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Import Model
import Auctions from "./models/auctions.js";

// Import Seed Data
import seedData from "./seedData.js";

// Connect to DB
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.info(chalk.green("Connected to MongoDB - seeding documents"));

  await Auctions.deleteMany({}); //clear existing
  await Auctions.insertMany(seedData);

  console.info(chalk.green("Documents seeded"));
  await mongoose.connection.close();
});
