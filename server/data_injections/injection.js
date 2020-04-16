// Inject Mock Data into our Database
const mongoose = require('mongoose')
const chalk = require('chalk')
const random = require('random-name')

const DataSource = require('./mock_data_source.json')

const ObjectID = require('mongoose').Types.ObjectId
const User = require('../models/UserSchema')
const Barber = require('../models/BarberSchema')
const ItemMenu = require('../models/ItemMenuSchema')

const MONGO_CONFIG = {
  'URI': 'mongodb://127.0.0.1:27017/snip-snap',
  'PASS': ''
}

const choose = (_arr_) => {

  let prob = Math.random()
  let chance_cap = 0.0
  let choice = null
  for (let i = 0; choice == null && i < _arr_.length; ++i) {
    if (!('type' in _arr_[i]) || !('chance' in _arr_[i])
    || typeof _arr_[i]['chance'] != typeof 0.0
    || typeof _arr_[i]['type'] != typeof 'test') {
      console.log(`Error: No chance or type specified`)
    }
    else {
      chance_cap += _arr_[i]['chance']

      if (prob < chance_cap)
        choice = _arr_[i]['type']

    }
  }
  return choice
}

const injection = (__source__, variations) => {

  // random = Math.random
  let type_variations = [
     {
      type: "barberShop",
      chance: 0.75,
      preference_variations: [{
        type: "white",
        chance: 0.5
      },{
        type: "black",
        chance: 0.5
      }]
    },
    {
      type: "salon",
      chance: 0.25,
      preference_variations: [{
        type: "black",
        chance: 1
      }]
    }
  ]

  let type_distribution = {}
  let preference_distribution = {}
  for (let i = 0; i < variations; ++i) {

    let choice = choose( type_variations.map( _item_ => {
      return {type: _item_.type, chance: _item_.chance}
    }) )

    if (choice == null) {
      console.log(`\n${chalk.red('Error:')} No choice\n`)
    }
    else {
      console.log(`Choice: ${choice}`)
      if (choice in type_distribution) type_distribution[choice] += 1;
      else type_distribution[choice] = 1

      // pick the preference
      let type_index = null
      for (j=0; type_index == null && j < type_variations.length; ++j) {
        if ('type' in type_variations[j] && type_variations[j]['type'] == choice){
          type_index = j
        }
      }
      if (type_index == null) {
        console.log ('No type index found')
        return;
      }

      // choose preference
      let preference_choice = choose( type_variations[type_index]['preference_variations']
      .map( _pref_ => {
        return {type: _pref_.type, chance: _pref_.chance }
      }));

      console.log(`\tPref: ${preference_choice}`)

      // create the sample data based on the type choice and preference choice
      let data_selection = null
      for (type_i in DataSource.data) {
        if (DataSource.data[type_i].type == choice
          && DataSource.data[type_i].preference == preference_choice) {
          data_selection = DataSource.data[type_i]
        }
      }

      if (data_selection == null) {
        console.log(`Error: Data not selected...`)
      }
      else {
        // Print the data_selection
        console.log(`Data Selection:`)
        // console.log(data_selection)

        // create the mock data
        let data_input = data_selection.menu_variations.map(option => {

          let img_index = Math.floor(Math.random() * option.image_url.length)
          let data_ = {
            option_name: option.option_name,
            price_min: option.price_min,
            price_max: 'price_max' in option ? option.price_max : [option.price_min[1], option.price_min[1]],
            image_url: option.image_url[ img_index ],
            description: "Empty menu description."
          }

          // make sure price_max is greater than price_min
          data_["price_min"] = data_["price_min"] == 0 ? 10 : data_["price_min"]
          data_["price_max"] = [Math.max(data_["price_min"][1], data_["price_max"][0]), Math.max(data_["price_min"][1], data_["price_max"][1])]

          data_["price_max"] = randomBetween(data_["price_max"][0], data_["price_max"][1])
          data_["price_min"] = randomBetween(data_["price_min"][0], data_["price_min"][1])
          if (data_["price_min"] > data_["price_max"]) {
            let temp = data_["price_min"]
            data_["price_min"] = data_["price_max"]
            data_["price_max"] = temp
          }

          return data_
        })

        let new_item_menu = {
          menu_name: choice == 'barberShop' ? 'Haircuts' : 'Services',
          menu_options: data_input
        }

        console.log(new_item_menu)
        // make a new barber and add this as their menu information
        let shop_name = `${random.place()} ${choice == 'barberShop' ? shopPostfix(): 'Salon'}`
        let shop_location = [ Math.random() * 1000, Math.random() * 1000 ] // longitude and latitude b/w 0 and 1000
        console.log(`Shop Name: ${shop_name}`)

        // last step, create a user account for the barber shop
        let name = { first: random.first(), last: random.last() }
        let shop_user = {
          username: `${name.first}_${name.last}${Math.floor(Math.random() * 1000)}${ Math.random() > 0.5 ? '_' : '' }`,
          first_name: name.first,
          last_name: name.last,
          email: `${name.last}${Math.random() > 0.5 ? '.' : ''}${Math.random() > 0.5 ? name.first : name.first[0]}@${Math.random() > 0.5 ? 'gmail': 'outlook'}.com`,
          password: 'samplepassword'
        }

        console.log(shop_user)

        // create the user
        let new_barber_user = new User(shop_user)
        new_barber_user.save((err, new_user) => {
          if (err || new_user == null) {
            console.log(`Error saving user document;\n${err}`)
          }
          else {
            // user saved. Now create all item menu
            let _item_menu_ = new ItemMenu(new_item_menu)
            _item_menu_.save((err, new_menu_) => {
              if (err || new_menu_ == null) {
                conole.log(`Error saving item document;\n${err}`)
              }
              else {
                // create new barber shop
                let new_barber_shop = new Barber({
                  shop_name: shop_name,
                  user_ref_id: new_user._id,
                  item_menus: [ new_menu_._id ],
                  recent_story: chooseBetweenArray(
                    ["https://thenypost.files.wordpress.com/2020/03/closed-salons-barbers-07.jpg?quality=80&strip=all&w=1200",
                    "https://lh3.googleusercontent.com/proxy/oMPiT6ahpix2Ri2GVr7om97h9SswOzW10vZtJXHQnV0nrwDa-Vmxx2VSNlWeuLSDm0aDyQx4KjL-wzxzQAUnHG0CRMUEAaB1UJHiBF0o6oQ7RtCRdjaGnfEyzPifMspRvQ",
                    "https://www.mancaveformen.com/wp-content/uploads/Barber-Shop-Williston-North-Dakota-ManCave-For-Men.jpg",
                    "https://res.cloudinary.com/sagacity/image/upload/c_crop,h_2832,w_4256,x_0,y_0/c_limit,dpr_auto,f_auto,fl_lossy,q_80,w_1080/_DSC0597a_i6bo5s.jpg",
                    "https://cdn2.lamag.com/wp-content/uploads/sites/6/2019/02/Barber-007-1068x712.jpg"]
                  ),
                  location: shop_location
                })

                new_barber_shop.save((err, new_shop) => {
                  if (err) {
                    console.log(`Error saving barber info;\n${err}`)
                  }
                  else {
                    console.log(`${i+1}/${variations} Completed successfully`)
                  }
                })

              }
            })
          }
        })
      }
    }

  }
  console.log(`---------------------------------------`)
  console.log(`Type Distribution:`)
  console.log(type_distribution)
  console.log(`Preference Distribution:`)
  console.log(preference_distribution)



}

const randomBetween = (a, b) => {
  return a + Math.floor(Math.random() * b - a)
}

const chooseBetweenArray = (array) => {
  let chosen_index = Math.floor(Math.random() * array.length)
  return array[chosen_index]
}

const shopPostfix = () => {
  let choices = ['Barber Shop', 'Shop', 'Cutz', 'Blades']
  return choices[ Math.floor(Math.random() * choices.length) ]
}


const PORT = 8090

// Connect to Database
mongoose.connect(MONGO_CONFIG.URI, {
  useNewUrlParser: true, useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.connection.once('open', () => {
  console.log(`${chalk.blue(`🗲  Connected to MongoLab instance 🗲`)}`)

  // start the injection
  injection (DataSource, 30)
});
mongoose.connection.on('error', error => console.log(`${chalk.yellow(`⚠  Error connecting to MongoLab: ` + error + ` ⚠`)}`));
