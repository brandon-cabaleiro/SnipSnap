const chalk = require('chalk')
const express = require('express')
var router = express.Router()

// Schemas
const ObjectID = require('mongoose').Types.ObjectId
const User = require('../models/UserSchema')
const Barber = require('../models/BarberSchema')

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
==========================API ROUTES==========================
See server/documentation.md for documentation.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

let __consoleSuccess = (__str__) => {
  console.log(`${chalk.green(`♦️ ${__str__}`)}`)
}

let __consoleError = (__str__) => {
  console.log(`${chalk.red(`❗️ ${__str__}`)}`)
}

/*
======================
=========GET==========
======================
*/

router.get('/getUser/:user_id', (req, res) => {
  console.log ('\n\n')
  // Retrieve the user_id information
  let user_id = 'user_id' in req.params ? req.params.user_id : null

  // no user_id provided...
  if (user_id == null){

    __consoleError (`Invalid Get Request Recieved: GetUser (null)`)
    console.log('\tNo user_id provided')
    res.json({
      success: false,
      user_id: user_id
    })
    return;
  }


  __consoleSuccess(`Get Request Recieved: GetUser (${user_id})`)

  // check if the user id is valid
  if (!ObjectID.isValid( user_id )) {
    console.log(`\t${chalk.red('Error: ')} user id (${user_id}) is not a valid object id`)
    res.json ({
      success: false,
      user_id: user_id
    })
    return;
  }

  // Query the database
  User.findOne({ _id: ObjectID(user_id) }, (err, user) => {

    // could not find user
    if (err || user == null) {

      __consoleError(`Invalid Get Request Recieved: GetUser (${user_id})`)
      console.log(`\t${chalk.red('Error: ')}: User could not be found`)

      res.json({
        success: false,
        user_id: user_id
      })
      return;
    }

    // user found. return correct json data
    else {

      __consoleSuccess(`User with id=${user_id} found. returning...`)
      res.json({
        first_name: user.first_name,
        last_name: user.last_name,
        user_id: user_id,
        username: user.username,
        success: true
      })
      return;
    }

  })

})


router.get('/getBarber/:barber_id', (req, res) => {
  console.log ("\n\n")

  let barber_id = 'barber_id' in req.params ? req.params.barber_id : null

  if (barber_id == null) {
    __consoleError("Invalid Get Request Recieved: getBarber (null)")
    res.json({
      success: false,
      barber_id: barber_id
    })
    return;
  }

  __consoleError(`Get Request Recieved: GetBarber(${barber_id})`)

  if (!ObjectID.isValid( barber_id )) {
    console.log(`\t${chalk.red('Error: ')} barber id (${barber_id}) is not a valid object id`)
    res.json ({
      success: false,
      barber_id: barber_id
    })
    return;
  }

  // Query the database
  Barber.findOne({ _id: ObjectID(barber_id) }, (err, barber) => {

    // could not find barber data
    if (err || barber == null) {

      __consoleError(`Invalid Get Request Recieved: GetBarber(${barber_id})`)
      console.log(`\t${chalk.red('Error: ')}: Barber could not be found`)
      console.log(`\t${err}`)

      res.json({
        success: false,
        barber_id: barber_id
      })

    }
    else {
      __consoleSuccess(`Barber with id=${barber_id} found. returning...`)
      res.json({
        shop_name: barber.shop_name,
        user_ref_id: barber.user_ref_id,
        success: true
      })

    }

  })

})

/*
======================
=========POST=========
======================
*/
router.post('/userLogin', (req, res) => {
  console.log('\n\n')

  let username = 'username' in req.body ? req.body.username : null
  let hashed_password = 'password' in req.body ? req.body.password : null

  if (username == null || hashed_password == null) {
    __consoleError(`Invalid Post Request Recieved: userLogin(${username}, ${hashed_password})`)
    res.json({
      success: false
    })
    return;
  }

  __consoleSuccess(`Post Request Recieved: userLogin(${username}, ${hashed_password})`)
  User.findOne({ username: username, password: hashed_password}, (err, user) => {

    if (err || user == null) {
      __consoleError(`Invalid Post Request Recieved: userLogin(${username}, ${hashed_password})`)
      console.log(`\t${err}`)

      res.json({
        success: false
      })
    }
    else {
      __consoleSuccess(`User with: username=${username} and password=${hashed_password} found. returning data...`)

      res.json({
        success: true,
        user_id: user._id
      })
    }

  })

})

router.post('/createUser', (req, res) => {
  console.log('\n\n')



  // check if the required body fields are filled out
  if (!('username' in req.body) || !('password' in req.body) || !('first_name' in req.body)
  || !('last_name' in req.body) || !('email' in req.body)) {
    __consoleError(`Invalid Post Request Recieved: createUser()`);
    console.log(`\t${chalk.red(`Error`)}: One or more missing fields...`)
    console.log(`\t\t${chalk.yellow(`username`)}: ${ req.body.username }`)
    console.log(`\t\t${chalk.yellow(`password`)}: ${ req.body.password }`)
    console.log(`\t\t${chalk.yellow(`first_name`)}: ${ req.body.first_name }`)
    console.log(`\t\t${chalk.yellow(`last_name`)}: ${ req.body.last_name }`)
    console.log(`\t\t${chalk.yellow(`email`)}: ${ req.body.email }`)

    // return error...
    res.json({
      success: false,
      error : 'Insufficient information'
    })
    return;
  }


  // Valid information provided
  __consoleSuccess(`Post Request Recieved: createUser()`);
  console.log(`\t${chalk.blue(`username`)}: ${ req.body.username }`)
  console.log(`\t${chalk.blue(`password`)}: ${ req.body.password }`)
  console.log(`\t${chalk.blue(`first_name`)}: ${ req.body.first_name }`)
  console.log(`\t${chalk.blue(`last_name`)}: ${ req.body.last_name }`)
  console.log(`\t${chalk.blue(`email`)}: ${ req.body.email }`)
  console.log(`\n`)

  // check if the user exists already
  User.findOne({ username: req.body.username }, (err, doc) => {

    if (err || doc == null) {
      // create user!
      // create the user in the database

      let new_user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name
      })

      new_user.save((err, doc) => {
        if (err) {
          __consoleError(`Error saving the new user...`)
          console.log(`\t${chalk.red('Error')}: ${err}`)

          res.json({
            success: false,
            error: err
          })
        }

        else {
          __consoleSuccess(`Successfully created new user!`)
          res.json({
            success: true,
            user_id: doc._id
          })
        }
      })
    }
    else {

      console.log(`\t${chalk.red('Error:')} User already exists`)

      res.json({
        success: false,
        error: 'User already exists'
      })
    }

  })

})

router.post('/createBarberShop', (req, res) => {

  if (!('shop_name' in req.body) || !('user_id' in req.body)) {
    __consoleError(`Invalid Post Request Recieved: createBarberShop()`)
    console.log (`${chalk.yellow('shop_name')}: ${req.body.shop_name}`)
    console.log (`${chalk.yellow('user_id')}: ${req.body.user_id}`)

    res.json({
      success: false,
      error: 'Insufficient'
    })
    return;
  }

  // sufficient information provided
  __consoleSuccess(`Post Request Recieved: createBarberShop()`)
  console.log (`${chalk.blue('shop_name')}: ${req.body.shop_name}`)
  console.log (`${chalk.blue('user_id')}: ${req.body.user_id}`)

  // check if the user id provided is valid
  if (!ObjectID.isValid(req.body.user_id)) {
    console.log (`\t${chalk.red('Error')}: User ID provided is not a valid ObjectID`)
    res.json({
      success: false,
      error: 'Invalid user id provided'
    })
    return;
  }

  // check if the user already owns a barber shop
  Barber.findOne({ user_ref_id: req.body.user_id }, (err, barber) => {

    if (err || barber == null) {
      // Check if the user exists

      User.findOne({ _id: req.body.user_id }, (err, user) => {

        // User that is opening the barber shop doesn't even exist :(
        if (err || user == null) {
          console.log (`\t${chalk.red('Error')}: User that is opening the barber shop does not exist`)
          res.json({
            success: false,
            error: 'User does not exist'
          })
        }

        // Can successfulyl create new barber shop
        else {
          console.log (`\tOpening a barber shop for user ${req.body.user_id}`)

          // create the new barber shop
          new_barber_shop = new Barber({
            shop_name: req.body.shop_name,
            user_ref_id: req.body.user_id
          })

          new_barber_shop.save((err, shop_) => {

            // error saving the shop information
            if (err || shop_ == null) {
              console.log (`\t${chalk.red('Error')}: could not save the new barber shop.`)
              res.json ({
                success: false,
                error: 'Error saving shop info.'
              })
            }

            // successfully created new shop!
            else {
              console.log (`${chalk.blue('Successfully saved shop info!')}`)
              res.json({
                success: true,
                shop_id: shop_._id
              })
            }
          });

        }

      })

    }
    else {
      console.log (`\t${chalk.red('Error')}: user already owns a barber shop`)

      res.json({
        success: false,
        error: 'User is already a barber'
      })
    }

  });

})

module.exports = router
