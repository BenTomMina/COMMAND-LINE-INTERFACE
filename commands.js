#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import mongoose from "mongoose";
import Auctions from "./models/auctions.js";
import chalk from "chalk";
import {
  addListing,
  findListing,
  updateListing,
  removeListing,
  listListings,
} from "./index.js";

// Auction Listing Questions
const questions = [
  {
    type: "input",
    name: "title",
    message: "Listing Title: ",
  },
  {
    type: "input",
    name: "description",
    message: "Listing Description: ",
  },
  {
    type: "input",
    name: "start_price",
    message: "Auction starting price: ",
  },
  {
    type: "input",
    name: "reserve_price",
    message: "Auction reserve price: ",
  },
];

// Subclass Command
class CustomCommand extends Command {
  helpInformation() {
    return `
        Function                  Alias        Description
        trademe-cli add            a            To add new listing in the database
        trademe-cli list           l            To check all the listings in the database
        trademe-cli update [_ID]   u            To update details for specific listing in the database
        trademe-cli remove [_ID]   r            To remove details for specific listing in the database
        trademe-cli find [TITLE]   f            To find a specific listing in the database

`;
  }
}

const program = new CustomCommand();

program.version("1.0.0").description("Auction Listing Management System");

// program
//   .command("add <title> <description> <start_price> <reserve_price>")
//   .alias("a")
//   .description("Add a listing")
//   .action((title, description, start_price, reserve_price) => {
//     addListing({ title, description, start_price, reserve_price });
//   });

// Add Command
program
  .command("add")
  .alias("a")
  .description("Add a listing")
  .action(() => {
    inquirer.prompt(questions).then((answers) => {
      addListing(answers);
    });
  });

// Find Command
program
  .command("find <title>")
  .alias("f")
  .description("Find a listing")
  .action((title) => {
    findListing(title);
  });

// Update Command
// program
//   .command("update <_id>")
//   .alias("u")
//   .description("Update a listing")
//   .action((_id) => {
//     inquirer.prompt(questions).then((answers) => {
//       updateListing(_id, answers);
//     });
//   });

program
  .command("update <_id>")
  .alias("u")
  .description("Update a listing")
  .action((_id) => {
    Auctions.findById(_id)
      .then((doc) => {
        if (!doc) {
          throw new Error("Listing not found");
        }
        // Prompt when Object ID has been found
        inquirer.prompt(questions).then((answers) => {
          updateListing(_id, answers);
        });
      })
      .catch((err) => {
        console.error(chalk.red("Error updating listing:", err.message));
        mongoose.connection.close();
      });
  });

// Remove Command
program
  .command("remove <_id>")
  .alias("r")
  .description("Remove a listing")
  .action((_id) => {
    removeListing(_id);
  });

// List Command
program
  .command("list")
  .alias("l")
  .description("Lists all listings")
  .action(() => {
    listListings();
  });

program.parse(process.argv);
