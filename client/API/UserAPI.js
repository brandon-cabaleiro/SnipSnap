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
  getUser: (user_id) => {
    return axios.get( url(`/api/getUser/${user_id}`))
  },
  getSchedule: (user_id) => {
    return axios.get( url(`/api/getSchedule/${user_id}`) )
  },
  getBarberAvailability: (barber_id) => {
    return axios.get( url(`/api/getBarberAvailability/${barber_id}`) )
  },
  getBarberScheduleForDay: (barber_id, date) => {
    return axios.get( url(`/api/getBarberScheduleForDay/${barber_id}/${date.toISOString()}`) )
  },
  makeAppointment: ( user_id, barber_id, date ) => {
    return axios.post( url(`/api/makeAppointment`), {
      user_id: user_id,
      barber_id: barber_id,
      schedule_date: date
    } )
  },
  saveBarber: (user_id, barber_id) => {
    return axios.post( url('/api/saveBarber'), {
      user_id: user_id,
      barber_id: barber_id
    } )
  },
  unsaveBarber: (user_id, barber_id) => {
    return axios.post( url('/api/unsaveBarber'), {
      user_id: user_id,
      barber_id: barber_id
    } )
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
