const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const chalk = require('chalk')

// Create Express App
const app = express ()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

// TODO load mongodb info and PORT from DOTENV
const MONGO_CONFIG = {
  'uri': '',
  'pass': ''
}

const PORT = 8004

// Connect to Database
mongoose.connect(MONGO_URI);
mongoose.connection.once('open', () => console.log(`${chalk.blue(`🗲  Connected to MongoLab instance 🗲`)}`));
mongoose.connection.on('error', error => console.log(`${chalk.yellow(`⚠  Error connecting to MongoLab: ` + error + ` ⚠`)}`));

app.use(cors())

// listen to the server port
app.listen(PORT, () => {
  console.log (`${chalk.green(`✔  Server started on http://localhost:${PORT} ✔`)}`)
})
