import axios from 'axios'

export default () => {
  const baseURL = process.env.NODE_ENV && process.env.NODE_ENV === 'production'
    ? 'http://nam-vm2.tu-ilmenau.de:3000/api'
    : 'http://localhost:3000/api'
  return axios.create({
    baseURL,
    withCredentials: true
  })
}
