const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk');

// For Login/Registration

// routes
const api_routes = require('./routes/api'); 

// Create Express App
const app = express(); 

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// TODO load mongodb info and PORT from DOTENV
const MONGO_CONFIG = {
  'URI': 'mongodb://127.0.0.1:27017',
  'PASS': ''
}

const PORT = 8090

// Connect to Database
mongoose.connect(MONGO_CONFIG.URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => console.log(`${chalk.blue(`🗲  Connected to MongoLab instance 🗲`)}`));
mongoose.connection.on('error', error => console.log(`${chalk.yellow(`⚠  Error connecting to MongoLab: ` + error + ` ⚠`)}`));

app.use(cors()); 
app.use(bodyParser.json()); 

// Setup Routes
//app.use('/api', api_routes)

app.get('/', (req, res) => res.send('Hello World test...'));


// Login
app.post('/login', (request, response) => {

  console.log(request); 

  var username = request.body.username; 
  var password = request.body.password; 

  console.log("SERVER: Received login request from user " + username);


})





// listen to the server port
app.listen(PORT, () => {
  console.log (`${chalk.green(`✔  Server started on http://localhost:${PORT} ✔`)}`)
})
