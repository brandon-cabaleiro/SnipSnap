# Database Logistics
-----

**Note:** Any API calls referenced here is fully documented in `documentation.md`. Reference it if needed.

-----

## Users and Barbers

Our application consists of *users* and *barbers*.
 A *barber* provides service to the *users* off the application. A barber is a *user*, themselves.

#### User Model
A user is defined by **username**, **password**, **email**, **first name**, **last_name** and **_id** but is uniquely identified by **username** and **_id**.

To acquire this information, use the api call `/api/getUser/{user_id}`

#### Barber Model
A barber is defined by **shop name**, **_id**, **itemization_menues** and **user reference id**, but is uniquely identified
only by **_id**.

To acquire this information, use the api call `/api/getBarber/{barber_id}`

A barber can be a user, so a barber object has **user reference id** so it can point to the user **_id**
that is the barber.
###### Example
```
Barber:
* shop_name: 'David Mata's Clean Cutz'
* user_ref_id: 1004
* id: 3001

User:
* username: davidmata_thebarber
* id: 1004
* first_name: David
* last_name: Mata
```

In the Barber database, the entry has an **id** of `3001` and a **user_ref_id** of `1004`. This
means the barber shop named 'David Mata's Clean Cutz' is owned by the user `davidmata_thebarber`.

#### Itemization Menu Model
An itemization menu describes the services that a barber provides to its clients. A barber shop can
consist of multiple types of services. For example, cutting services can be within one menu, and
braiding or washing services can be another itemized menu within the shop.

An itemized menu is defined by **_id**, **menu_name** and **menu_options**. **menu_options** is
an array of dictionary objects that describe an option in the itemized menu.

Structure of **menu_options**:
```
{
  option_name: String,
  price_min: Number,
  price_max: Number,
  image_url: String,
  description: String
}
```
If a menu option has a fixed price, then `price_min` and `price_max` will have the same value.

To acquire all of the menus of a specific barber shop, use the api call `/api/barber/getMenus/{barber_id}`
