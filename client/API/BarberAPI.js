import axios from 'axios'

let BASE_URL = 'http://localhost:8090'
let url = (link) => `${BASE_URL}${link}`

let BarberAPI = {
  getBarbers: (limit, skip) => {
    return axios.get( url(`/api/getBarbers/${skip}/${limit}`) )
  }
}

export default BarberAPI
