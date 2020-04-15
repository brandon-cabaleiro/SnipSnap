import axios from 'axios'

let BASE_URL = 'http://localhost:8090'
let url = (link) => `${BASE_URL}${link}`

let UserAPI = {
  login: (username, password) => {
    return axios.post( url('/api/userLogin'), {
      username: username,
      password: password
    })
  },
  createUser: (username, password, email, first_name, last_name) => {
    return axios.post( url('/api/createUser'), {
      username: username,
      password: password,
      first_name: first_name,
      last_name: last_name,
      email: email
    })
  },
  validate: (token) => {
    return axios.post( url('/api/validate'), {
      token: token
    })
  },
  loggedIn: async () => {
    let token = localStorage.getItem('token')
    console.log(`TOKEN: ${token}`)

    return new Promise(function(resolve, reject) {
      if (token) {
        console.log(`Validating token: ${token}`)
        axios.post( url('/api/validate'), {token: token})
        .then(res => {
          if (res.data.success) {
            resolve(true)
          }
          reject("Token is not valid")
        })
      }
      else {
        reject("No token provided")
      }
    });
  }
}

export default UserAPI
