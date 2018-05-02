import axios from 'axios'
import apiHelper from './apiHelper'

const loginSuper = (serverMode) => {
  console.log('loginSuper')
  const credentials = {
    email: 'superuser@yoov.com',
    password: 'yoovyoov'
  }
  let url = apiHelper.getApiUrl(null, serverMode)
  console.log('loginSuper :: url = ' + url)
  return new Promise((resolve, reject) => {
    axios.post(url + '/auth', credentials).then((response) => {
      console.log('loginSuper :: axios.then')
      resolve(response)
    }).catch(() => {
      reject()
    })
  })
}

// const logout = (user) => {
//
// }
//
const functions = {
  loginSuper
}

export default functions
