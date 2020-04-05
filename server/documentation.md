# API Documentation
------
## GET

#### Get User

`/api/getUser/{user_id}`

**Description:** Retrieve user data associated with the user id specified.

Parameters
* **user_id** : the id associated with the user.

Response
```
{
  first_name: FirstName,
  last_name: LastName,
  username: sample_username,
  user_id: 91049014598198398341,
  success: true
}
```
```
{
  success: false,
  user_id: 91049014598198398341
}
```

#### Get Barber
`/api/getBarber/{barber_id}`

**Description:** Retrieves barber account data associated with the barber id

Parameters
* **barber_id:** the id associated with the barber

Response
```
{
  shop_name: David's Barbershop,
  user_ref_id: 9104901459890905905289,
  success: true,
  itemized_menus: [{ ... }]
}
```
```
{
  barber_id: 910190290408945839,
  success: false
}
```

#### Get Barber Menus
`/api/barber/getMenus/{barber_id}`

**Description:** Retrieve the itemized menus for a given barber shop (specified by `barber_id`).

Parameters
* **barber_id:** the id associated with the barber

Response
```
{
  success: true,
  itemized_menus: [{...}] // an array of all the itemized menus
}
```
```
{
  success: false,
  error: <error msg>
}
```

------
## POST

#### User Login
`/api/userLogin`

**Description:** Confirm if the `username` and `password` given is associated with an existing
user.

Body Fields:
* **username:** the username of the user
* **password:** the hashed password associated with the username

Response

```
{
  success: true,
  user_id: 1920391203910
}
```
```
{
  success: false
}
```

#### Create User
`/api/createUser/`

**Description:** Create a new user with the information provided.

Body Fields:
* **username:** The username of the new user
* **password:** The hashed password of the new user
* **first_name:** The first name of the new user
* **last_name:** The last name of the new user
* **email:** The email of the new user

Response
```
{
  user_id: 9019023903902901,
  success: true
}
```
```
{
  error: 'User exists',
  success: false
}
```


#### Create Barber Shop
`/api/createBarberShop/`

**Description:** Create a barber shop. Converts the user into a barber. A user can only have
**1** barber shop open.

Body Fields:
* **shop_name:** The name of the shop
* **user_id:** The user id of the user opening the shop

Response
```
{
  success: true,
  shop_id: 91209301093109309109310
}
```
```
{
  sucess: false,
  error: User is already a barber
}
```

#### Create Itemization Menu
`/api/barber/createMenu`

**Description:** Create a new itemization menu for a barber shop. A shop can have multiple
itemization menus.

Body Fields:
* **barber_id:** The id of the barber creating the menu
* **menu_name:** The name of the menu
* **menu_options:** An array of the menu options that will be available

Each menu option is an object that has the following format:
```
{
  option_name: String,
  price_min: Number,
  price_max: Number,
  image_url (optional): String,
  description: String
}
```
Response
```
{
  // A sucessful response returns the data stored in the database
  // along with success == true

  success: true,

  barber_id: 10940909kjkjf118981,
  menu_name: "Sample Menu Name",
  menu_options: [{

    option_name: 'Sample Option',
    price_min: 10.0,
    price_max: 10.0,
    imag_url: http://www.sample_image.com/test.png,
    description: "This is a sample option"

  }]
}
```
```
{
  success: false,
  error: <error message>
}
```

#### Update Itemization Menu
`/api/barber/updateMenu`

**Description:** Update an existing itemization menu for a barber shop.

Body Fields:
* **barber_id:** The id of the barber's menu being updated
* **menu_id:** The id of the menu being updated
* **upated_menu_name (optional):** The updated menu name
* **updated_options (optional):** A dictionary of the options to update

`updated_options` example:
```
// Sample Options:
menu_options = [{

    option_name: 'Sample Option',
    price_min: 10.0,
    price_max: 10.0,
    imag_url: http://www.sample_image.com/test.png,
    description: "This is a sample option"

  }]

//-------------------------[ ... ]------------------------------------

// If I wanted to update the menu_options above, I would
// find the index of the option I want to update and pass the update
// parameters
// e.g

updated_options = {
  0: // <--- key 0 matches index 0 of menu_options
  {
    updated_option_name: 'Updated Option Name',
    updated_description: 'This is the updated option description'
  }
}


/*
 *  The updated_options here will change the option_name and
 *  option_description to the updated_option_name and
 *  updated_description values respectively.

 *  Prefix the field name being updated with updated_
 *  (option_name -> updated_option_name)
 *  (price_max -> updated_price_max)
 *  (price_min -> updated_price_min)
*/
```
Response
```
{
  // A sucessful response returns the data updated in the database
  // along with success == true

  success: true,

  barber_id: 10940909kjkjf118981,
  menu_name: "Updated Menu Name",
  menu_options: [{

    option_name: 'Updated Option Name',
    price_min: 10.0,
    price_max: 10.0,
    imag_url: http://www.sample_image.com/test.png,
    description: "This is the updated option description"

  }]
}
```
```
{
  success: false,
  error: <error message>
}
```
