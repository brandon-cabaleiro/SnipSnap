const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk');
const fileUpload = require('express-fileupload')

// For Login/Registration

// routes
const api_routes = require('./routes/api');

// Create Express App
const app = express();

// TODO load mongodb info and PORT from DOTENV
const MONGO_CONFIG = {
  'URI': 'mongodb://127.0.0.1:27017/snip-snap',
  'PASS': ''
}

const PORT = 8090

// Connect to Database
mongoose.connect(MONGO_CONFIG.URI, {
  useNewUrlParser: true, useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.connection.once('open', () => console.log(`${chalk.blue(`🗲  Connected to MongoLab instance 🗲`)}`));
mongoose.connection.on('error', error => console.log(`${chalk.yellow(`⚠  Error connecting to MongoLab: ` + error + ` ⚠`)}`));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// Setup Routes
app.use('/api', api_routes)

app.get('/', (req, res) => res.send('Hello World test...'));


// listen to the server port
app.listen(PORT, () => {
  console.log (`${chalk.green(`✔  Server started on http://localhost:${PORT} ✔`)}`)
})
