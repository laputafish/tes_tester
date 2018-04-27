import * as types from '../mutation-types'
import data from './data.json'
import axios from 'axios'
import constants from './constants.json'
const state = {
  ...data,
  activeMenu: '',
  serverMode: 'Local', // Local or Online
  showingMessageDialog: false,
  modalComponent: null,
  message: '',
  loadingUser: false
}

const getters = {
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

function getApiUrl (user) {
  let url = ''
  if (user.type === 'driver') {
    url = state.serverMode === 'Local'
      ? constants.localUrl.driver
      : constants.onlineUrl.driver
  } else {
    url = state.serverMode === 'Local'
      ? constants.localUrl.member
      : constants.onlineUrl.member
  }
  return url
}

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
  console.log('findUserSlot')
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

function getConfig (user) {
  let config = {
    headers: {
      'Authorization': 'Bearer ' + user.token
    }
  }
  return config
}

const mutations = {
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
  }
}

const actions = {
  async login ({commit, state}, payload) {
    console.log('async login :: payload: ', payload)
    let user = findUserSlot(state.users, payload.slotNo)
    console.log('LOGIN :: user: ', user)
    let rootUrl = getApiUrl(user)
    let data = {
      email: user.email,
      password: user.password
    }
    await axios.post(rootUrl + '/auth', data).then(function (response) {
      console.log('login :: response: ', response)
      if (response.data) {
        if (response.data.status) {
          user.token = response.data.token
          user.loggedIn = true
          axios.get(rootUrl + '/auth/user', {params: {token: user.token}}).then(function (response) {
            if (typeof payload.callback === 'function') {
              payload.callback()
            }
            user.photo_id = response.data.photo_id
            user.cards = response.data.cards
            user.id = response.data.id
            user.is_active = response.data.is_active
            user.last_login = response.data.last_login
            user.name = response.data.name
            user.tel_no = response.data.tel_no

            console.log('login get user info: ', response.data)
          })
        } else {
          if (typeof payload.callback === 'function') {
            payload.callback()
          }
          if (response.data.message) {
            showMessage(response.data.message)
          } else if (response.data.error) {
            showMessage(response.data.error)
          }
        }
      }
      console.log('login : response: ', response)
    }, function (response) {
      if (typeof payload.callback === 'function') {
        payload.callback()
      }
      showMessage(response.error)
    })
    console.log('login :: finished')
  },
  async logout ({commit, state}, payload) {
    let user = findUserSlot(state.users, payload.slotNo)
    console.log('LOGIN :: user: ', user)
    let url = getApiUrl(user) + '/auth/logout'
    state.loadingUser = true
    await axios.post(url, {}, getConfig(user)).then(function (response) {
      console.log('login :: response: ', response)
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
      console.log('login : response: ', response)
    }, function (response) {
      user.token = ''
      user.loggedIn = false
      user.online = false
      state.loadingUser = false
      showMessage(response.data.error)
    })
    console.log('login :: finished')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
