import constants from '../modules/constants'

const getApiUrl = (user, serverMode) => {
  let url = ''
  if (user !== null) {
    if (user.type === 'driver') {
      url = serverMode === 'Local'
        ? constants.localUrl.driver
        : constants.onlineUrl.driver
    } else {
      url = serverMode === 'Local'
        ? constants.localUrl.member
        : constants.onlineUrl.member
    }
  } else {
    url = serverMode === 'Local'
      ? constants.localUrl.admin
      : constants.onlineUrl.admin
  }

  return url
}

export default {
  getApiUrl
}
