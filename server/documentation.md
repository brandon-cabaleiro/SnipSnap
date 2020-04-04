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
  success: true
}
```
```
{
  barber_id: 910190290408945839,
  success: false
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
