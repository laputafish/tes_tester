import Pusher from 'pusher-js'

const setDriverPusher = (user, pushSettings) => {

}

const updateMemberOrders = (user) => {

}

const updateDriverOrders = (user) => {
}

const setMemberPusher = (user, pushSettings) => {
  let pusher = new Pusher(pushSettings.key, {encrypted: true})
  pusher.unsubscribe()
  user.pushChannel = pusher.subscribe('member_' + user.id)
  // Push: login
  user.pushChannel.bind('login', (data) => {
    let token = data['token']
    if (user.token != token) {
      unSubscribeAll(user)
      logoutUser(user)
    }
  })

  // Push: new_order
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

  // Push: order_updated
  user.pushChannel.bind('order_updated', (data) => {
    updateMemberOrders(user)
  })

  // Push: active_order
  user.pushChannel.bind('active_order', (data) => {
    alert('active order updated')
  })
}

const setUserPusher = (user, pushSettings) => {
  if (user.type === 'member') {
    setMemberPusher(user, pushSettings)
  } else {
    setDriverPusher(user, pushsettings)
  }
}

const initMemberPusher = () => {
  return new Pusher('183187a39a6a467daf47', {
    wsHost: 'ws.pusherapp.com',
    httpHost: 'sockjs.pusher.com',
    encrypted: true
  })
}

const initDriverPusher = () => {
  return new Pusher('ebda001f1262fa2d5100', {
    wsHost: 'ws.pusherapp.com',
    httpHost: 'sockjs.pusher.com',
    encrypted: true
  })
}

export default {
  initMemberPusher,
  initDriverPusher,
  setDriverPusher,
  setMemberPusher,
  setUserPusher
}
