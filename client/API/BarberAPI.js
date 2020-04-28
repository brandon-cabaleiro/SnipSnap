import axios from 'axios'

let BASE_URL = 'http://localhost:8090'
let url = (link) => `${BASE_URL}${link}`

let BarberAPI = {
  getBarbers: (limit, skip) => {
    return axios.get( url(`/api/getBarbers/${skip}/${limit}`) )
  },
  getBarber: (barber_id) => {
    return axios.get( url(`/api/getBarber/${barber_id}`) )
  },
  makeShop: (user_id, shop_name) => {
    return axios.post( url(`/api/createBarberShop`), {
      user_id: user_id,
      shop_name: shop_name
    } )
  },
  getBarberFromUser: (user_id) => {
    return axios.get( url(`/api/getBarberFromUser/${user_id}`) )
  }
}

export default BarberAPI
