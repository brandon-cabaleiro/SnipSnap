const chalk = require('chalk')
const express = require('express')
var router = express.Router()
var jwt = require(`jsonwebtoken`)

const ImageServiceAPI = require('../services/image_upload')
const ACCESS_TOKEN_SCRET = "klafkeagjkasfnlafjfk12-091ifkasdlfajkfjeiaflakefjl"

// Schemas
const ObjectID = require('mongoose').Types.ObjectId
const User = require('../models/UserSchema')
const Barber = require('../models/BarberSchema')
const ItemMenu = require('../models/ItemMenuSchema')
const Schedule = require('../models/ScheduleSchema')
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

router.get(`/getSchedule/:user_id`, (req, res) => {
  console.log(`getSchedule(${req.params.user_id})`)

  let user_id = req.params.user_id
  if (!ObjectID.isValid(user_id)) {
    console.log(`Invalid user id format`)
    res.json({
      success: false,
      error: "Invalid user id format"
    })
    return;
  }

  Schedule.find({scheduler: user_id}, (err, schedules) => {
    if (err || schedules == null) {
      console.log(`Problem finding schedules`)
      res.json({
        success: false,
        error: "Problem finding schedules"
      })
    }
    else {
      console.log(`Got all schedules!`)
      res.json({
        success: true,
        schedules: schedules
      })
    }
  })
})

router.get(`/getBarberScheduleForDay/:barber_id/:iso_date_string`, (req, res) => {
  let timestamp = Date.parse(req.params.iso_date_string)
  let barber_id = req.params.barber_id

  console.log(`GetBarberScheduleForDay`)
  if (isNaN(timestamp)) {
    console.log(`Invalid ISO Date String provided...`)
    res.json({
      success: false,
      error: "Invalid date provided"
    })
    return;
  }

  if (!ObjectID.isValid(barber_id)) {
    console.log(`Invalid ID Provided...`)
    res.json({
      success: false,
      error: "Invalid ID Provided"
    })
    return;
  }

  // create the date and search for barber's schedule...
  let date = new Date(req.params.iso_date_string)
  let end_date = new Date()
  end_date.setDate(date.getDate() + 1)

  Schedule.find({
    barber: barber_id,
    time: {
      '$gte': date, // greter than or equal to specified date
      '$lt':  end_date // less than the next day's date + 1
    }}, (err, schedules) => {
    if (err || schedules == null) {
      console.log(`Problem finding schedules`)
      res.json({
        success: false,
        error: "Problem finding schedules"
      })
    }
    else {
      console.log(`Successfully found schedules`)
      res.json({
        success: true,
        schedules: schedules
      })
    }

  })

})

router.get(`/getBarberAvailability/:barber_id`, (req, res) => {
  let barber_id = req.params.barber_id
  console.log(`getBarberAvailability()`)

  if (!ObjectID.isValid(barber_id)) {
    console.log(`Invalid id provided`)
    res.json({
      success: false,
      error: "Invalid id provided"
    })
    return;
  }

  Barber.findOne({_id: barber_id}, (err, barber_) => {
    if (err || barber_ == null) {
      console.log(`Problem finding barber`)
      res.json({
        success: false,
        error: 'Problem finding barber'
      })
    }
    else {
      console.log(`Found barber`)
      res.json({
        success: true,
        availability: barber_.availability
      })
    }
  })
})

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
        saved: user.saved,
        success: true
      })
      return;
    }

  })

})

router.get(`/getSaved/:userId`, (req, res) => {

  let user_id = req.params.userId
  console.log(`Getting Saved: ${user_id}`)
  if (!ObjectID.isValid(user_id)) {
    console.log(`Invalid user id`)
    res.json({
      success: false,
      error: "Invalid user id"
    })
    return;
  }

  User.findOne({_id: user_id}, (err, user) => {
    if (err || user == null) {
      console.log(`Problem finding user`)
      res.json({
        success: false,
        error: "Problem finding user"
      })
    }
    else {
      // find the barbers they saved
      let saved = user.saved

      let saved_results = []
      saved.forEach(barber_id => {
        saved_results.push(new Promise(function(resolve, reject) {
          Barber.findOne({_id: barber_id}, (err, barber_doc) => {
            if (err || barber_doc == null) {
              console.log(`Problem finding barber...`)
              resolve(null)
            }
            else {
              console.log(`Found one barber`)
              resolve(barber_doc)
            }
          })
        }));
      })

      // wait for all the data to return
      Promise.all(saved_results).then(saved_barbers => {
        let true_saved_barbers = saved_barbers.filter(_barber_ => _barber_ != null)

        res.json({
          saved: true_saved_barbers,
          success: true
        })
      })
    }
  })

})

router.get('/getBarbers/:skip/:limit', (req, res) => {
  console.log(`\n\n`)
  console.log(`getBarbers(${req.params.skip}, ${req.params.limit})`)

  let skip_ = parseInt(req.params.skip)
  let limit_ = parseInt(req.params.limit)

  if (skip_ == NaN || limit_ == NaN) {
    console.log (`Invalid params provided`)
    res.json({
      success: false,
      error: "Invalid params provided"
    })
    return;
  }

  Barber.find({}, null, { skip: skip_, limit: limit_}, (err, docs) => {
    if (err || docs == null) {
      console.log(`Error retriving barbers...`)
      res.json({
        success: false,
        error: "Problem retrieving barber"
      })
    }
    else {
      console.log(`Successfully retrieved barbers`)
      res.json({
        success: true,
        barbers: docs
      })
    }
  })
})

router.get('/getBarberFromUser/:user_id', (req, res) => {
  console.log ("\n\n")

  let user_id = 'user_id' in req.params ? req.params.user_id : null

  if (user_id == null) {
    __consoleError("Invalid Get Request Recieved: getBarber (null)")
    res.json({
      success: false,
      user_id: user_id
    })
    return;
  }

  __consoleSuccess(`Get Request Recieved: GetBarberFromUser(${user_id})`)

  if (!ObjectID.isValid( user_id )) {
    console.log(`\t${chalk.red('Error: ')} barber id (${user_id}) is not a valid object id`)
    res.json ({
      success: false,
      user_id: user_id
    })
    return;
  }

  // Query the database
  Barber.findOne({ user_ref_id: ObjectID(user_id) }, async (err, barber) => {

    // could not find barber data
    if (err || barber == null) {

      __consoleError(`Invalid Get Request Recieved: GetBarber(${user_id})`)
      console.log(`\t${chalk.red('Error: ')}: Barber could not be found`)
      console.log(`\t${err}`)

      res.json({
        success: false,
        user_id: user_id
      })

    }
    else {
      // attempt to acquire all of the item menus
      let unpacked_repsonses = []

      let responses = []

      for (let i in barber.item_menus) {
        responses.push( new Promise((resolve, reject) => {

          // get the menu id and query it in the database
          let item_menu_id = barber.item_menus[i]

          // check if the menu id is a valid object id
          if (!ObjectID.isValid(item_menu_id)) {
            resolve(null) // responses[i] will have the value of null
                          // that we can later filter out
          }
          else {
            // search for the itemized menu
            return ItemMenu.findOne({ _id: ObjectID(item_menu_id) }, async (err, item_doc) => {
              if (err || item_doc == null) resolve(null)
              else {
                resolve({
                  menu_name: item_doc.menu_name,
                  menu_options: item_doc.menu_options
                })
              }
            })
          }

        }) )

      }

      // await all of the promises...
      unpacked_repsonses = new Array(responses.length);

      let fulfilled = false
      await Promise.all(responses).then((response_arr) => {
        unpacked_repsonses = response_arr
        fulfilled = true
      })

      // block while all promises are still pending
      while (!fulfilled);

      // remove the responses that are null
      unpacked_repsonses = unpacked_repsonses.filter(_response_ => _response_ != null)

      __consoleSuccess(`Barber with user id=${user_id} found. returning...`)
      res.json({
        itemized_menus: unpacked_repsonses,
        location: barber.location,
        shop_name: barber.shop_name,
        user_ref_id: barber.user_ref_id,
        success: true,
        recent_story: barber.recent_story,
      })

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

  __consoleSuccess(`Get Request Recieved: GetBarber(${barber_id})`)

  if (!ObjectID.isValid( barber_id )) {
    console.log(`\t${chalk.red('Error: ')} barber id (${barber_id}) is not a valid object id`)
    res.json ({
      success: false,
      barber_id: barber_id
    })
    return;
  }

  // Query the database
  Barber.findOne({ _id: ObjectID(barber_id) }, async (err, barber) => {

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
      // attempt to acquire all of the item menus
      let unpacked_repsonses = []

      let responses = []

      for (let i in barber.item_menus) {
        responses.push( new Promise((resolve, reject) => {

          // get the menu id and query it in the database
          let item_menu_id = barber.item_menus[i]

          // check if the menu id is a valid object id
          if (!ObjectID.isValid(item_menu_id)) {
            resolve(null) // responses[i] will have the value of null
                          // that we can later filter out
          }
          else {
            // search for the itemized menu
            return ItemMenu.findOne({ _id: ObjectID(item_menu_id) }, async (err, item_doc) => {
              if (err || item_doc == null) resolve(null)
              else {
                resolve({
                  menu_name: item_doc.menu_name,
                  menu_options: item_doc.menu_options
                })
              }
            })
          }

        }) )

      }

      // await all of the promises...
      unpacked_repsonses = new Array(responses.length);

      let fulfilled = false
      await Promise.all(responses).then((response_arr) => {
        unpacked_repsonses = response_arr
        fulfilled = true
      })

      // block while all promises are still pending
      while (!fulfilled);

      // remove the responses that are null
      unpacked_repsonses = unpacked_repsonses.filter(_response_ => _response_ != null)

      __consoleSuccess(`Barber with id=${barber_id} found. returning...`)
      res.json({
        barber_id: barber_id,
        itemized_menus: unpacked_repsonses,
        location: barber.location,
        shop_name: barber.shop_name,
        user_ref_id: barber.user_ref_id,
        success: true,
        recent_story: barber.recent_story,
      })

    }

  })

})

router.get('/barber/getMenus/:barber_id', (req, res) => {

  if (!('barber_id') in req.params) {
    __consoleError(`Invalid Get Request Recieved: getMenus(null)`)
  }
  __consoleSuccess(`Get Request Recieved: getMenus(${req.params.barber_id})`)

  // Check if the barber_id is a valid object id
  if (!ObjectID.isValid(req.params.barber_id)) {
    console.log(`\t${chalk.red('Error')}: Barber id is not a valid ObjectID`)
    res.json({
      success: false,
      error: 'Invalid barber id'
    });
    return;
  }

  // !!!
  let barber_id = req.params.barber_id
  Barber.findOne({ _id: ObjectID(barber_id) }, async (err, barber) => {

    // could not find barber data
    if (err || barber == null) {

      __consoleError(`Invalid Get Request Recieved: Barber:getMenus(${barber_id})`)
      console.log(`\t${chalk.red('Error: ')}: Barber could not be found`)
      console.log(`\t${err}`)

      res.json({
        success: false,
        error: 'Barber does not exist.'
      })

    }
    else {
      // attempt to acquire all of the item menus
      let unpacked_repsonses = []

      let responses = []

      for (let i in barber.item_menus) {
        responses.push( new Promise((resolve, reject) => {

          // get the menu id and query it in the database
          let item_menu_id = barber.item_menus[i]

          // check if the menu id is a valid object id
          if (!ObjectID.isValid(item_menu_id)) {
            resolve(null) // responses[i] will have the value of null
                          // that we can later filter out
          }
          else {
            // search for the itemized menu
            return ItemMenu.findOne({ _id: ObjectID(item_menu_id) }, async (err, item_doc) => {
              if (err || item_doc == null) resolve(null)
              else {
                resolve({
                  menu_name: item_doc.menu_name,
                  menu_options: item_doc.menu_options
                })
              }
            })
          }

        }) )

      }

      // await all of the promises...
      unpacked_repsonses = new Array(responses.length);

      let fulfilled = false
      await Promise.all(responses).then((response_arr) => {
        unpacked_repsonses = response_arr
        fulfilled = true
      })

      // block while all promises are still pending
      while (!fulfilled);

      // remove the responses that are null
      unpacked_repsonses = unpacked_repsonses.filter(_response_ => _response_ != null)

      __consoleSuccess(`Barber with id=${barber_id} found. returning...`)
      res.json({
        itemized_menus: unpacked_repsonses,
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

      const access_token = jwt.sign({
        username: user.username,
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      },
      ACCESS_TOKEN_SCRET)

      res.json({
        success: true,
        access_token: access_token,
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

          const access_token = jwt.sign({
            username: doc.username,
            id: doc._id,
            email: doc.email,
            first_name: doc.first_name,
            last_name: doc.last_name
          },
          ACCESS_TOKEN_SCRET)

          res.json({
            access_token: access_token,
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
            user_ref_id: req.body.user_id,
            menu_options: [],
            location: [0, 0]
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


router.post('/barber/createMenu', (req, res) => {

  // insufficient fields provided
  if (!('barber_id' in req.body) || !('menu_name' in req.body)
  || !('menu_options' in req.body)) {

    __consoleError("Invalid Post Request Recieved: createMenu()")
    console.log(`\t${chalk.yellow('barber_id:')} ${req.body.barber_id}`)
    console.log(`\t${chalk.yellow('menu_name:')} ${req.body.menu_name}`)
    console.log(`\t${chalk.yellow('menu_options:')} ${req.body.menu_options}`)

    res.json({
      success: false,
      error: 'Insufficient data provided'
    })
    return;
  }

  __consoleSuccess("Post Request Recieved: createMenu()")
  console.log(`\t${chalk.blue('barber_id:')} ${req.body.barber_id}`)
  console.log(`\t${chalk.blue('menu_name:')} ${req.body.menu_name}`)
  console.log(`\t${chalk.blue(`menu_options(${typeof req.body.menu_options}):`)} ${req.body.menu_options}`)

  // check if the barber id is valid
  if (!ObjectID.isValid(req.body.barber_id)) {
    console.log(`\n\t${chalk.red('Error:')} barber_id is not a valid ObjectID`)

    res.json({
      success: false,
      error: 'barber_id is not a valid ObjectID'
    })
    return;
  }

  // check if there is at least 1 option in the menu
  if (typeof req.body.menu_options != typeof [] || req.body.menu_options.length == 0) {
    console.log(`\n\t${chalk.red('Error:')} No menu options provided`)

    res.json({
      success: false,
      error: 'No menu options provided'
    })
    return;
  }

  // make sure the menu options provided have the necessary information
  let menu_options = req.body.menu_options
  for (i in menu_options) {
    let menu_option = menu_options[i]

    // if price_max is empty, price_max == price_min
    if (typeof menu_option != typeof {}
    || !('option_name') in menu_option
    || !('price_min') in menu_option
    || !('description') in menu_option)
    {
      console.log(`\n\t${chalk.red('Error:')} Menu options are missing required fields.`)

      res.json({
        success: false,
        error: 'Menu options are missing required fields'
      })
      return;
    }

    // transform the menu_options to include filler data
    if (!('price_max' in menu_option)) {
      menu_options[i]['price_max'] = menu_option['price_min']
    }

    if (typeof menu_options[i]['price_max'] != typeof 1
    || typeof menu_options[i]['price_max'] != typeof 1.1
    || typeof menu_options[i]['price_min'] != typeof 1
    || typeof menu_options[i]['price_min'] != typeof 1.1) {
      console.log(`\t${chalk.red('Error:')} Price min/max are not of type ${typeof 1}`)
      res.json({
        success: false,
        error: 'Fields are inconsistent'
      })
      return;
    }

    if (menu_options[i]['price_max'] < menu_options[i]['price_min']) {
      console.log(`\t${chalk.red('Error:')} Price min is greater than price max.`)

      res.json({
        success: false,
        error: 'Fields are inconsistent'
      })
      return;
    }

    if (!('image_url') in menu_option) {
      menu_options[i]['image_url'] = "<default_image>"
    }
  }

  Barber.findOne({ _id: ObjectID(req.body.barber_id)}, (err, barber_doc) => {

    // barber does not exist
    if (err || barber_doc == null) {
      console.log(`\n\t${chalk.red('Error:')} Could not find barber with id ${req.body.barber_doc}`)
      res.json({
        success: false,
        error: 'Could not find barber'
      })
    }
    else {
      // update the barber item_menu array
      let updated_barber_menu = barber_doc.item_menus

      // create the new menu object
      let new_item_menu = new ItemMenu({
        menu_name: req.body.menu_name,
        menu_options: menu_options
      })

      // save the item
      new_item_menu.save((err, menu_doc) => {

        // did not save ...
        if (err || menu_doc == null) {
          console.log(`\n\t${chalk.red('Error:')} Could not save the item data`)

          res.json({
            success: false,
            error: 'Problem saving item menu'
          })
        }

        // successfully saved
        else {

          console.log(`\t${chalk.green('(1/2) Complete:')} Successfully saved the new item menu`)
          console.log(`${chalk.gray('\t...Attempting to update barber data...')}`)

          if (!updated_barber_menu.includes( menu_doc._id )) {
            // add it to the updated list
            updated_barber_menu.push( menu_doc._id )
          }

          // Now update the barber doc !
          Barber.findOneAndUpdate({ _id: ObjectID(req.body.barber_id) },
            { $set: {item_menus: updated_barber_menu} },
            {upsert: false},
            (err, updated_doc) => {

              if (err || updated_doc == null) {
                console.log(`\n\t${chalk.red('Error:')} Could not update barber doc...`)
                console.log(`${chalk.gray('\tAborting...')}`)

                // delete the menu item from the database ...
                ItemMenu.deleteOne({ _id: menu_doc._id }, (err) => {

                  if (err) {
                    console.log(`\t${chalk.red('Error:')} Problem deleting item menu`)
                    console.log(`${chalk.gray('\tCould not abort. abandoning')}`)
                  }

                  // return json
                  res.json({
                    success: false,
                    error: "Problem updating barber data."
                  })

                })

              }
              else {
                console.log(`\t${chalk.green('(2/2) Complete:')} Successfully updated the barber document`)

                res.json({
                  success: true,
                  barber_id: updated_doc._id,
                  menu_name: req.body.menu_name,
                  menu_options: updated_barber_menu
                })

              }

          })

        }
      }) // end of ItemMenu.save()

    }

  }); // end of Barber.findOne ()

  // end
})

router.post('/barber/updateMenu', (req, res) => {

  // Update Itemization Menu
  res.json({

  })

})

router.post('/uploadImage', (req, res) => {

  // Update Itemization Menu
  let img = req.files.image;

  ImageServiceAPI.upload ( img.data )
  .then (result => {

    console.log ("Resolved...")
    // console.log (result)
    res.json({
      success: true
    })
  })
  .catch (err => {

    // console.log (err)
    res.json({
      success: false,
      error: err
    })

  })


})

router.post('/validate', (req, res) => {
  console.log("\nValidate ()")
  if (!('token' in req.body)) {
    console.log(`\tError: No token provided`)
    res.json({
      success: false,
      error: "No token provided"
    })
    return;
  }

  // verify token
  let token = req.body.token
  jwt.verify(token, ACCESS_TOKEN_SCRET, (err, data) => {
    if (err) {
      res.json({
        success: false,
        error: "Invalid token"
      })
    }
    else {
      res.json({
        success: true
      })
    }
  })
})

router.post(`/saveBarber/`, (req, res) => {

  let user_id = 'user_id' in req.body ? req.body.user_id : null
  let barber_id = `barber_id` in req.body ? req.body.barber_id : null
  console.log(`SaveBarber(user_id: ${user_id}, barber_id: ${barber_id})`)

  if (user_id == null || barber_id == null) {
    console.log(`Invalid user id or barber id probided`)
    res.json({
      success: false,
      error: "Inalid id provided"
    })
    return;
  }

  if (!ObjectID.isValid(user_id) || !ObjectID.isValid(barber_id)) {
    console.log(`Invalid user id or barber id format`)
    res.json({
      success: false,
      error: "Inalid id format"
    })
    return;
  }

  User.findOne({_id: user_id}, (err, user_) => {
    if (err || user_ == null) {
      console.log(`Problem finding user...`)
      res.json({
        success: false,
        error: "Problem finding user"
      })
    }
    else {
      // update the user's saved
      let new_saved = [...user_.saved]
      if (!new_saved.includes(barber_id)) {

        new_saved.push(ObjectID(barber_id))
        user_.updateOne({saved: new_saved}, (err) => {
          if (err) {
            console.log(`Error updating...`)
            res.json({
              success: false,
              error: "Problem updating"
            })
          }
          else {
            console.log(`Successfully saved barber`)
            res.json({
              success: true,
              saved: new_saved
            })
          }
        })

      }
      else {
        // if the barber is already saved, just return the saved and success = true
        res.json({
          success: true,
          saved: new_saved
        })
      }

    }
  })
})

router.post(`/unsaveBarber/`, (req, res) => {

  let user_id = 'user_id' in req.body ? req.body.user_id : null
  let barber_id = `barber_id` in req.body ? req.body.barber_id : null
  console.log(`SaveBarber(user_id: ${user_id}, barber_id: ${barber_id})`)

  if (user_id == null || barber_id == null) {
    console.log(`Invalid user id or barber id probided`)
    res.json({
      success: false,
      error: "Inalid id provided"
    })
    return;
  }

  if (!ObjectID.isValid(user_id) || !ObjectID.isValid(barber_id)) {
    console.log(`Invalid user id or barber id format`)
    res.json({
      success: false,
      error: "Inalid id format"
    })
    return;
  }

  User.findOne({_id: user_id}, (err, user_) => {
    if (err || user_ == null) {
      console.log(`Problem finding user...`)
      res.json({
        success: false,
        error: "Problem finding user"
      })
    }
    else {
      // update the user's saved
      let new_saved = [...user_.saved]
      let string_saved = new_saved.map(_id => _id.toString())

      if (!string_saved.includes(barber_id)) {

        console.log(`user did not save the barber.`)
        // if the barber is already saved, just return the saved and success = true
        res.json({
          success: true,
          saved: new_saved
        })

      }
      else {

        // remove the barber id
        new_saved.splice(string_saved.indexOf(barber_id), 1)
        // update the user now
        user_.updateOne({saved: new_saved}, (err) => {
          if (err) {
            console.log(`Problem updating the user's saved...`)
            res.json({
              success: false,
              error: "Problem saving user saved"
            })
          }
          else {
            console.log(`Successfully removed barber from user's saved`)
            res.json({
              success: true,
              saved: new_saved
            })
          }
        })

      }

    }
  })
})

router.post(`/makeAppointment/`, (req, res) => {
  console.log(`makeAppointment()`)

  let user_id = req.body.user_id
  let barber_id = req.body.barber_id
  let schedule_date = req.body.schedule_date

  if (!ObjectID.isValid(user_id) || !ObjectID.isValid(barber_id)) {
    console.log(`invalid user id or barber id provided`)
    res.json({
      success: false,
      error: "Invalid id provided"
    })
    return;
  }

  console.log(schedule_date)

  let new_schedule = Schedule({
    scheduler: ObjectID(user_id),
    barber: ObjectID(barber_id),
    time: schedule_date
  })

  new_schedule.save((err) => {
    if (err) {
      console.log(`Could not save new schedule`)
      res.json({
        success: false,
        error: 'Could not save schedule'
      })
    }
    else {
      console.log(`Schedule saved successfully`)
      res.json({
        success: true
      })
    }
  })
})

router.post(`/cancelAppointment/`, (req, res) => {
  console.log(`cancelAppointment()`)

  let schedule_id = req.body.schedule_id

  if (!ObjectID.isValid(schedule_id) ) {
    console.log(`invalid schedule id provided`)
    res.json({
      success: false,
      error: "Invalid id provided"
    })
    return;
  }

  Schedule.deleteOne({
    _id: schedule_id
  }, (err, result) => {
    if (err) {
      console.log(`Problem deleting schedule...`)
      res.json({
        success: false,
        error: err
      })
    }
    else {
      console.log(`Successfully deleted schedule.`)
      res.json({
        success: true
      })
    }
  })
})

module.exports = router
