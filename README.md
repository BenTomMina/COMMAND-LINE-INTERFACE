# Welcome to **Mission 5 - Phase 1** 🚀

## Overview

A Node JS CLI which will allows a user to interact with a MongoDB database.

Functions allowed
- Add document
- List all documents
- Update documents
- Remove documents
- Find documents based on title
- Search documents based on title and description (done via API call)

Also includes a server which holds the API endpoint to do the search function and seed data for a quick set-up of the documents.

#### Tech Stack

- Node JS
- MongoDB
- express
- Google Gemini AI
- chalk
- commander
- dotenv for environment config
- inquirer
- mongoose

#### Setup Instruction:

**Clone the repository**

```bash
git clone <repo-url>
cd Mission_5_Phase_1
```

**Install dependencies**

```bash
npm install
```

**Configure environment variables**

1. Copy the example file (.env.example)
2. Edit .env and set your Gemini API key, MongoDB URI path, and PORT number

**Getting started**

```
npm start (Starts the beckend server)
node seed.js (Seeds the data to the database. Also creates database if not yet created)
trademe-cli --help (lists all the CLI options available to use)
```

---