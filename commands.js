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
  searchListings,
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

// Help Command - displays all available options for the CLI
class CustomCommand extends Command {
  helpInformation() {
    return `
        Function                  Alias        Description
        trademe-cli add            a            To add new listing in the database
        trademe-cli list           l            To check all the listings in the database
        trademe-cli update [_ID]   u            To update details for specific listing in the database
        trademe-cli remove [_ID]   r            To remove details for specific listing in the database
        trademe-cli find [TITLE]   f            To find a specific listing in the database
        trademe-cli search [query] s            To search for listings satisfying the query

`;
  }
}

const program = new CustomCommand();

program.version("1.0.0").description("Auction Listing Management System");

// Add Command - asks questions to the user to create the listing. Will not create if a field is missing or invalid
program
  .command("add")
  .alias("a")
  .description("Add a listing")
  .action(() => {
    inquirer.prompt(questions).then((answers) => {
      addListing(answers);
    });
  });

// Find Command - finds a listing based on the title
program
  .command("find <title>")
  .alias("f")
  .description("Find a listing")
  .action((title) => {
    findListing(title);
  });

// Update Command

// Previous Code - kept for reference - code goes through the whole updating process even if the object id given does not exist
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
    // Looks through the Database to see if the Object ID exists
    Auctions.findById(_id)
      .then((doc) => {
        if (!doc) {
          // Sends an error if the Object ID does not exist
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

// Remove Command - removes a listing based on the Object ID
program
  .command("remove <_id>")
  .alias("r")
  .description("Remove a listing")
  .action((_id) => {
    removeListing(_id);
  });

// List Command - lists all auction listings
program
  .command("list")
  .alias("l")
  .description("Lists all listings")
  .action(() => {
    listListings();
  });

// Search Command - makes an API call to search the database for similar items
program
  .command("search <query>")
  .alias("s")
  .description("Search auction listings using the API")
  .action(searchListings);

program.parse(process.argv);
