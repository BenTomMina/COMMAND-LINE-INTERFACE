import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Import Model
import Auctions from "./models/auctions.js";

// Add Listing
const addListing = (listing) => {
  Auctions.create(listing)
    .then((listing) => {
      console.info(chalk.green("New Listing Added"));
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error(chalk.red("Error adding listing:", err.message));
      mongoose.connection.close();
    });
};

// Find Listing
const findListing = (title) => {
  // Make case insensitive
  const search = new RegExp(title, "i");
  Auctions.find({ title: search }).then((listing) => {
    console.info(listing);
    console.info(chalk.yellow(`${listing.length} matches`));
    mongoose.connection.close();
  });
};

// Update Listing - doesn't do validation for the update - i.e. can skip required fields
// const updateListing = (_id, listing) => {
//   Auctions.findByIdAndUpdate({ _id }, listing)
//     .then((listing) => {
//       console.info(chalk.green("Listing Updated"));
//       mongoose.connection.close();
//     })
//     .catch((err) => {
//       console.error(chalk.red("Error updating listing:", err.message));
//       mongoose.connection.close();
//     });
// };

// Update Listing - error handling for non-existent Object ID handled by command.js
const updateListing = (_id, listing) => {
  Auctions.findById(_id)
    .then((doc) => {
      Object.assign(doc, listing); //Update properties
      return doc.save(); //Triggers validation
    })
    .then(() => {
      console.info(chalk.green("Listing updated"));
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error(chalk.red("Error updating listing:", err.message));
      mongoose.connection.close();
    });
};

// Remove Listing - doesn't throw an error to indicate that no listing was found
// const removeListing = (_id) => {
//   Auctions.deleteOne({ _id })
//     .then((listing) => {
//       console.info(chalk.red("Listing Removed"));
//       mongoose.connection.close();
//     })
//     .catch((err) => {
//       console.error(chalk.red("Error removing listing:", err.message));
//       mongoose.connection.close();
//     });
// };

// Remove Listing
const removeListing = (_id) => {
  Auctions.findById(_id)
    .then((doc) => {
      if (!doc) {
        // Throws error if Object ID not found on database
        throw new Error(chalk.red("Listing not found"));
      }
      return Auctions.deleteOne({ _id });
    })
    .then((result) => {
      console.info(chalk.green("Listing Removed"));
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error(chalk.red("Error removing listing:", err.message));
      mongoose.connection.close();
    });
};

// List Listings
const listListings = () => {
  Auctions.find().then((listings) => {
    console.info(listings);
    console.info(chalk.yellow(`${listings.length} listings found`));
    mongoose.connection.close();
  });
};

// Search Listings - makes an API call to the server to run a MongoDB query
const searchListings = async (query) => {
  try {
    const res = await fetch(
      `http://localhost:${process.env.PORT}/search?q=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();
    console.log("Results:", data.results);
    mongoose.connection.close();
  } catch (err) {
    console.error(chalk.red("API error:", err.message));
    mongoose.connection.close();
  }
};

// Export All Methods
export {
  addListing,
  findListing,
  updateListing,
  removeListing,
  listListings,
  searchListings,
};
