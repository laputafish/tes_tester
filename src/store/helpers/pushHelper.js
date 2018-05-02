import Pusher from 'pusher-js'
import axios from 'axios'
import apiHelper from './apiHelper'

const updateMemberOrders = (user) => {

}

// const updateDriverOrders = (user) => {
// }

// const unbindChannel = (pusher, user) => {
//   let channelName = user.type === 'member'
//     ? 'member_' + user.id
//     : 'driver_' + user.id
//   pusher.unsubscribe(channelName)
// }

const checkCallback = (callbacks, callbackName) => {
  let result = true
  if (typeof callbacks === 'undefined') {
    alert('callbacks undefined!')
    result = false
  } else if (typeof callbacks[callbackName] === 'undefined') {
    alert('callbacks.' + callbackName + ' undefined!')
    result = false
  }
  return result
}
const setDriverPusher = (user, pusher, callbacks) => {
  user.pushChannel.bind('login', (data) => {
    let token = data['token']
    if (user.token !== token) {
      pusher.unsubscribe('driver_' + user.id)
      if (checkCallback(callbacks, 'logoutUser')) {
        callbacks.logoutUser(user)
      }
    }
  })

  // *********************
  // Push: new_order
  // *********************
  console.log('user "' + user.name + '" bind channel: new_orer')
  user.pushChannel.bind('new_order', (data) => {
    if (checkCallback(callbacks, 'new_order')) {
      callbacks.new_order(data)
    }
  })

  console.log('user "' + user.name + '" bind channel: confirmation_timeout')
  user.pushChannel.bind('confirmation_timeout', (data) => {
    if (checkCallback(callbacks, 'confirmation_timeout')) {
      callbacks.confirmation_timeout(data)
    }
  })

  console.log('user "' + user.name + '" bind channel: order_cancelled')
  user.pushChannel.bind('order_cancelled', (data) => {
    if (checkCallback(callbacks, 'order_cancelled')) {
      callbacks.order_cancelled(data)
    }
  })

  console.log('user "' + user.name + '" bind channel: order_updated')
  user.pushChannel.bind('order_updated', (data) => {
    if (checkCallback(callbacks, 'refresh_orders')) {
      callbacks.refresh_orders(data)
    }
  })

  console.log('user "' + user.name + '" bind channel: reminder')
  user.pushChannel.bind('reminder', (data) => {
    if (checkCallback(callbacks, 'reminder')) {
      callbacks.reminder(data)
    }
  })

  console.log('user "' + user.name + '" bind channel: documents_rejected')
  user.pushChannel.bind('documents_rejected', (data) => {
    if (checkCallback(callbacks, 'documents_rejected')) {
      callbacks.documents_rejected(data)
    }
  })

  console.log('user "' + user.name + '" bind channel: documents_approved')
  user.pushChannel.bind('documents_approved', (data) => {
    if (checkCallback(callbacks, 'documents_approved')) {
      callbacks.documents_approved(data)
    }
  })

  console.log('user "' + user.name + '" bind channel: documents_expired')
  user.pushChannel.bind('documents_expired', (data) => {
    if (checkCallback(callbacks, 'documents_expired')) {
      callbacks.documents_approved(data)
    }
  })

  console.log('user "' + user.name + '" bind channel: order_assigned')
  user.pushChannel.bind('order_assigned', (data) => {
    if (checkCallback(callbacks, 'documents_expired')) {
      callbacks.order_assigned(data)
    }
  })
}

const setMemberPusher = (user, pusher, callbacks) => {
  // *********************
  // Push: login
  // *********************
  console.log('user "' + user.name + '" bind channel: login')
  user.pushChannel.bind('login', (data) => {
    let token = data['token']
    if (user.token !== token) {
      if (checkCallback(callbacks, 'logoutUser')) {
        pusher.unsubscribe('member_' + user.id)
        if (typeof callbacks.logoutUser === 'function') {
          callbacks.logoutUser(user)
        }
      }
    }
  })

  // *********************
  // Push: new_order
  // *********************
  console.log('user "' + user.name + '" bind channel: new_orer')
  user.pushChannel.bind('new_order', (data) => {
    let orderId = data.ORDER_ID
    let status = data.status
    switch (status) {
      case 'confirmed':
        // goto outstanding page
        break
      case 'cancelled':
        alert('Order #' + orderId + 'is cancelled.')
        break
    }
    updateMemberOrders(user)
  })

  // *********************
  // Push: order_updated
  // *********************
  console.log('user "' + user.name + '" bind channel: order_updated')
  user.pushChannel.bind('order_updated', (data) => {
    updateMemberOrders(user)
  })

  // *********************
  // Push: active_order
  // *********************
  console.log('user "' + user.name + '" bind channel: active_order')
  user.pushChannel.bind('active_order', (data) => {
    alert('active order updated')
  })
}

var functions = {
  setUserPusher (pushers, user, callbacks) {
    user.pushChannel = pushers[user.type].subscribe(user.type + '_' + user.id)
    if (user.type === 'member') {
      setMemberPusher(user, callbacks)
    } else {
      setDriverPusher(user, callbacks)
    }
  },

  initPushers (serverMode, adminToken) {
    console.log('initPusher :: serverMode = ' + serverMode)
    console.log('initPusher :: adminToken = ' + adminToken)
    var url = apiHelper.getApiUrl(null, serverMode)
    console.log('initPusher :: url = ' + url)
    return new Promise((resolve, reject) => {
      axios.get(url + '/push_setup/0', {
        params: {
          token: adminToken
        }
      }).then((response) => {
        let memberPusher = new Pusher(response.data.result.pusher_member_auth_key, {
          wsHost: 'ws.pusherapp.com',
          httpHost: 'sockjs.pusher.com',
          encrypted: true
        })
        console.log('initPushers :: memberPusher: ', memberPusher)
        let driverPusher = new Pusher(response.data.result.pusher_driver_auth_key, {
          wsHost: 'ws.pusherapp.com',
          httpHost: 'sockjs.pusher.com',
          encrypted: true
        })
        console.log('initPushers :; driverPusher: ', driverPusher)
        resolve({
          memberPusher: memberPusher,
          driverPusher: driverPusher
        })
      }).catch((error) => {
        reject(error)
      })
    })
  },

  initDriverPusher () {
    console.log('initDriverPusher')
    return new Pusher('ebda001f1262fa2d5100', {
      wsHost: 'ws.pusherapp.com',
      httpHost: 'sockjs.pusher.com',
      encrypted: true
    })
  }
}

export default functions
