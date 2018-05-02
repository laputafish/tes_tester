import * as types from '../mutation-types'
import pushHelper from '../helpers/pushHelper'
import apiHelper from '../helpers/apiHelper'
import authService from '../helpers/authService'

import data from './data.json'
import axios from 'axios'
import firebase from 'firebase'
import {firebaseAction, firebaseMutations} from 'vuexfire'
import constants from './constants.json'

const state = {
  ...data,
  adminToken: '',
  activeMenu: '',
  serverMode: 'Local', // Local or Online
  showingMessageDialog: false,
  modalComponent: null,
  message: '',
  loadingUser: false,
  fbUsers: [],
  pushes: {
    member: null,
    driver: null
  }
}

// Firebase initialization
let config = {
  apiKey: 'AIzaSyB1Wo22RZQa2znkct9izAfGphbfROZ1WoE',
  authDomain: 'testester-39ed4.firebaseapp.com',
  databaseURL: 'https://testester-39ed4.firebaseio.com',
  projectId: 'testester-39ed4',
  storageBucket: '',
  messagingSenderId: '625932982944'
}

let db = firebase.initializeApp(config).database()
let fbUsersRef = db.ref('users')

// let fbUsers = fbUsersRef

const getters = {
  fbUsers: (state) => {
    return state.fbUsers
  },
  users: (state) => {
    return state.users
  },
  products: (state) => {
    return state.products
  },
  categoryTree: (state) => {
    return {
      id: 0,
      name: 'root',
      children: state.categories
    }
  },
  serverMode: (state) => {
    return state.serverMode
  },
  message: (state) => {
    return state.message
  },
  showingMessageDialog: (state) => {
    return state.showingMessageDialog
  }
}

function getInitFbUser (user) {
  return {
    id: user.id,
    center: {
      lat: constants.hkLatLng.lat,
      lng: constants.hkLatLng.lng
    },
    zoom: 13,
    passengerCount: 0,
    cardId: 0
  }
}

function containsChild (parent, category) {
  let result = false
  for (var i = 0; i < parent.children.length; i++) {
    if (parent.children[i].id === category.id) {
      result = true
      break
    }
  }
  return result
}

function getCategoryParent (category, categories) {
  if (typeof categories === 'undefined') {
    categories = state.categories
  }
  let result = null
  for (var i = 0; i < categories.length; i++) {
    if (containsChild(categories[i], category)) {
      result = categories[i]
      break
    }
  }
  return result
}

function getCategory (categoryId, categories) {
  if (typeof categories === 'undefined') {
    categories = state.categories
  }
  let result = null
  for (var i = 0; i < categories.length; i++) {
    console.log('#' + i + ': ' + categories[i].name)
    if (categories[i].id === categoryId) {
      result = categories[i]
    } else {
      if (categories[i].children && categories[i].children.length > 0) {
        result = getCategory(categoryId, categories[i].children)
      }
    }
    if (result) {
      break
    }
  }
  return result
}

function moveCategory (category, afterParent, beforeParent) {
  // remove child from before parent
  for (var i = 0; i < beforeParent.children.length; i++) {
    if (beforeParent.children[i].id === category.id) {
      beforeParent.children.splice(i, 1)
      break
    }
  }
  // add child to after parent
  afterParent.children.push(category)
}

// function xgetApiUrl (user) {
//   let url = ''
//   if (user.type === 'driver') {
//     url = state.serverMode === 'Local'
//       ? constants.localUrl.driver
//       : constants.onlineUrl.driver
//   } else {
//     url = state.serverMode === 'Local'
//       ? constants.localUrl.member
//       : constants.onlineUrl.member
//   }
//   return url
// }

function showMessage (message) {
  switch (message) {
    case 'member_not_verified':
      message = 'Member not verified!'
      break
  }
  state.message = message
  state.showingMessageDialog = true
}

function findUserSlot (users, slotNo) {
  console.log('findUserSlot for slot no = ' + slotNo)
  let result = null
  for (var i = 0; i < users.length; i++) {
    if (users[i].slot_no === slotNo) {
      result = users[i]
      break
    }
  }
  console.log('findUserSlot result: ', result)
  return result
}

function getFbUser (user) {
  let result = null
  let filteredFbUsers = state.fbUsers.filter(function (item) {
    return item.id === user.id
  })
  result = filteredFbUsers.length > 0 ? filteredFbUsers[0] : null
  return result
}

function getConfig (user) {
  let config = {
    headers: {
      'Authorization': 'Bearer ' + user.token
    }
  }
  return config
}

function updateFbUserInfo (user, key, value) {
  console.log('updateFbUserInfo :: ' + key + ' => ' + value)
  let fbUser = getFbUser(user)
  db.ref().child('/users/' + fbUser['.key'] + '/' + key).set(value)
}

const mutations = {
  ...firebaseMutations,
  showModal (state, componentName) {
    state.showingMessageDialog = true
    state.modalComponent = componentName
  },
  hideModal (state) {
    state.showingMessageDialog = false
  },
  [types.SET_ACTIVE_MENU] (state, data) {
    state.activeMenu = data
  },
  [types.REPOSITION_CATEGORY] (state, payload) {
    let afterParent = getCategory(payload.afterParent.id)
    let beforeParent = getCategory(payload.beforeParent.id)
    let item = getCategory(payload.data.id)

    let currentParent = getCategoryParent(item)

    if (currentParent.id !== afterParent.id) {
      moveCategory(item, afterParent, beforeParent)
    }
  },
  // login (state, payload) {
  //   console.log('LOGIN :: payload: ', payload)
  //   let user = findUserSlot(state.users, payload.slot_no)
  //   console.log('LOGIN :: user: ', user)
  //   let url = getApiUrl(user) + '/auth'
  //   let data = {
  //     email: user.email,
  //     password: user.password
  //   }
  //   axios.post(url, data).then( function(response) {
  //     console.log('login :: response: ', response)
  //     if (response.data) {
  //       if (response.data.status) {
  //         user.token = response.data.token
  //         user.loggedIn = true
  //       } else {
  //         showMessage(response.data.message)
  //       }
  //     }
  //     console.log('login : response: ', response)
  //   })
  //
  //   user.loggedIn = true
  //   user.online = false
  // },
  [types.LOGOUT] (state, payload) {
    let user = findUserSlot(state.users, payload.slot_no)
    state.pushers[user.type].unsubscribe(user.pushChannel)
    user.loggedIn = false
  },
  [types.TOGGLE_ONLINE] (state, payload) {
    let user = findUserSlot(state.users, payload.slot_no)
    user.online = !user.online
  },
  [types.SET_SERVER_MODE] (state, payload) {
    state.serverMode = payload
    console.log('SET_SERVER_MODE :: constants: ', constants)
  },
  [types.CLOSE_MESSAGE_DIALOG] (state, payload) {
    state.showingMessageDialog = false
    state.message = ''
  },
  [types.UPDATE_PUSHERS] (state, payload) {
    state.pushers = {
      member: payload.memberPusher,
      driver: payload.driverPusher
    }
  },
  [types.UPDATE_MAP_ZOOM] (state, payload) {
    updateFbUserInfo(payload.user, 'zoom', payload.zoom)
  }
}

// function unSubscribeAll (user) {
//   user.pushChannel.unsubscribe('member_' + user.id)
//   user.pushChannel = null
// }

function setUser (user, data) {
  user.photo_id = data.photo_id
  user.cards = data.cards
  user.id = data.id
  user.is_active = data.is_active
  user.last_login = data.last_login
  user.name = data.name
  user.tel_no = data.tel_no

  // console.log('system :: filter users :: fbUsers: ', fbUsers)
  // console.log('system :: fbUsers.length = ' + fbUsers.length)

  let filteredFbUsers = state.fbUsers.filter(function (item) {
    return item.id === user.id
  })
  console.log('filteredFbUsers: ', filteredFbUsers)
  let fbUser = null
  if (filteredFbUsers) {
    fbUser = filteredFbUsers[0]
  }
  // console.log('system :: login :: fbUser: ', fbUser)
  if (typeof fbUser === 'undefined') {
    // console.log('system :: !fbUser = ' + (!fbUser ? 'yes' : 'no'))
    fbUser = getInitFbUser(user)
    // console.log('setting up fbUser: ', fbUser)
    fbUsersRef.push(fbUser)
  }
  user.extra = fbUser
  // console.log('login > get user > fbUser: ', fbUser)
  // console.log('login > get user > user: ', user)
}

function logoutUser (user) {
  // console.log('LOGIN :: user: ', user)
  let url = apiHelper.getApiUrl(user, state.serverMode) + '/auth/logout'
  state.loadingUser = true
  axios.post(url, {}, getConfig(user)).then(function (response) {
    // console.log('login :: response: ', response)
    user.token = ''
    user.loggedIn = false
    user.online = false
    if (response.data) {
      if (response.data.status) {
        if (response.data.message) {
          showMessage(response.data.message)
        }
      } else {
        if (response.data.message) {
          showMessage(response.data.message)
        } else if (response.data.error) {
          showMessage(response.data.error)
        }
      }
    }
    // console.log('login : response: ', response)
  }, function (response) {
    user.token = ''
    user.loggedIn = false
    user.online = false
    state.loadingUser = false
    showMessage(response.data.error)
  })
  console.log('login :: finished')
}

const actions = {
  async init ({commit, state, dispatch}, payload) {
    authService.loginSuper(payload.serverMode).then((response) => {
      // console.log('authService.loginSuper().then :: response: ', response)
      state.adminToken = response.data.token
      pushHelper.initPushers(payload.serverMode, state.adminToken).then((pushers) => {
        // console.log('initPushers => promise pushes: ', pushers)
        commit(types.UPDATE_PUSHERS, pushers)
      })
    })
  },

  setFbUsersRef: firebaseAction(({
    bindFirebaseRef
  }) => {
    bindFirebaseRef('fbUsers', fbUsersRef)
  }),
  async updateMapCenter ({commit, state}, payload) {
    // console.log('payload: ', payload)
    let user = findUserSlot(state.users, payload.user.slot_no)
    let fbUser = getFbUser(user)
    if (typeof fbUser === 'undefined') {
      fbUser = getInitFbUser(user)
    }
    let query = db.ref('users/' + fbUser['.key'] + '/center')
    let data = {
      lat: payload.center.lat,
      lng: payload.center.lng
    }
    // console.log('updateMapCenter :: fbUserref of ref: users/' + fbUser['.key'] + '/center')
    // console.log('updateMapCenter :: data:', data)
    query.update(data)
    if (typeof payload.callback === 'function') {
      payload.callback()
    }
  },
  async login ({commit, state}, payload) {
    console.log('async login :: payload: ', payload)
    let user = findUserSlot(state.users, payload.slotNo)
    console.log('LOGIN :: user: ', user)
    console.log('LOGIN :: serverMode = ' + state.serverMode)
    let rootUrl = apiHelper.getApiUrl(user, state.serverMode)
    let data = {
      email: user.email,
      password: user.password
    }
    await axios.post(rootUrl + '/auth', data).then(function (response) {
      // console.log('login :: response: ', response)
      if (response.data) {
        user.token = response.data.token
        user.loggedIn = true
        let promises = [
          axios.get(rootUrl + '/auth/user', {params: {token: user.token}}),
          axios.get(rootUrl + '/pusher/0', {params: {token: user.token}})
        ]
        Promise.all(promises).then(function (responses) {
          setUser(user, responses[0].data)
          let callbacks = user === 'member'
            // Member
            ? {
              documents_approved: (data) => {
                alert('pusher: documents_approved:\n #' + data.driving_licence_no + '\n' +
                  'Type: ' + data.document_type)
              },
              documents_rejected: (data) => {
                alert('pusher: documents_rejected:\n #' + data.driving_licence_no + '\n' +
                  'Type: ' + data.document_type)
              },
              documents_expired: (data) => {
                alert('pusher: documents_expired:\n #' + data.driving_licence_no + '\n' +
                  'Type: ' + data.document_type)
              },
              documents_expiring_soon: (data) => {
                alert('pusher: documents_expiring_soon:\n #' + data.driving_licence_no + '\n' +
                  'Type: ' + data.document_type)
              },
              new_order: (data) => {
                state.driverNewOrders.push({
                  order: data,
                  driver_id: user.id
                })
              },
              confirmation_timeout: (data) => {
                let orderId = data['order_id']
                user.orders.filter((order) => {
                  return order.id !== orderId
                })
                state.driverTimeoutOrders.push({
                  order: data,
                  driver_id: user.id
                })
              },
              order_cancelled: (data) => {
                let orderId = data['order_id']
                user.orders.filter((order) => {
                  return order.id !== orderId
                })
                state.driverCancelledOrders.push({
                  order: data,
                  driver_id: user.id
                })
              },
              order_assigned: (data) => {
                state.driverAssignedOrders.push({
                  order: data,
                  driver_id: user.id
                })
              },
              reminder: (data) => {
                state.driverReminderOrders.push({
                  order: data,
                  driver_id: user.id
                })
              }
            }
            // Driver
            : {
              logoutUser: logoutUser
            }
          pushHelper.setUserPusher(
            state.pushers,
            user,
            callbacks
          )

          if (typeof payload.callback === 'function') {
            payload.callback(user.extra)
          }
        })
      }
      // console.log('login : response: ', response)
    }, function (response) {
      if (typeof payload.callback === 'function') {
        payload.callback()
      }
      showMessage(response.error)
    })
    // console.log('login :: finished')
  },
  async logout ({commit, state}, payload) {
    let user = findUserSlot(state.users, payload.slotNo)
    await logoutUser(user)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
