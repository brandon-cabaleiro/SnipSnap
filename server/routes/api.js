const chalk = require('chalk')
const express = require('express')
var router = express.Router()

// Schemas
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

  // Query the database
  User.findOne({ user_id: user_id }, (err, user) => {

    // could not find user
    if (err || user == null) {

      __consoleError(`Invalid Get Request Recieved: GetUser (${user_id})`)

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
      barber_id: null
    })
    return;
  }

  __consoleError(`Get Request Recieved: GetBarber(${barber_id})`)

  // Query the database
  Barber.findOne({ barber_id: barber_id }, (err, barber) => {

    // could not find barber data
    if (err || barber == null) {

      __consoleError(`Invalid Get Request Recieved: GetBarber(${barber_id})`)
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
      valid: false
    })
    return;
  }

  //__consoleSuccess(`Post Request Recieved: userLogin(${}, ${})`)
  User.findOne({ username: username, password: hashed_password}, (err, user) => {

    if (err || user == null) {
      __consoleError(`Invalid Post Request Recieved: userLogin(${username}, ${hashed_password})`)
      console.log(`\t${err}`)

      res.json({
        valid: false
      })
    }
    else {
      __consoleSuccess(`User with: username=${username} and password=${hashed_password} found. returning data...`)

      res.json({
        valid: true
      })
    }

  })

})

router.post('/createUser', (req, res) => {
  console.log('\n\n')

  res.json({
    error: 'Not implemented',
    success: false
  })

})

module.exports = router
