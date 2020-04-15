import axios from 'axios'

let BASE_URL = 'http://localhost:8090'
let url = (link) => `${BASE_URL}${link}`

let ItemMenuAPI = {
  getMenus: (barber_id) => {
    return axios.get( url(`/api/barber/getMenus/${barber_id}`) )
  }
}

export default ItemMenuAPI
