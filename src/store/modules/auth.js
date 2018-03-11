import { sendPost } from '../../config/api'

const state = {
  isLoggedIn: localStorage.hasOwnProperty('access_token') || sessionStorage.hasOwnProperty('access_token'),
  authUser: {
    access_token: '' || localStorage.getItem('access_token') || sessionStorage.getItem('access_token'),
    user_id: null || localStorage.getItem('user_id') || sessionStorage.getItem('user_id'),
    email: '' || localStorage.getItem('email') || sessionStorage.getItem('email'),
    firstname: '' || localStorage.getItem('firstname') || sessionStorage.getItem('firstname'),
    lastname: '' || localStorage.getItem('lastname') || sessionStorage.getItem('lastname'),
    role: '' || localStorage.getItem('role') || sessionStorage.getItem('role'),
    status: '' || localStorage.getItem('status') || sessionStorage.getItem('status')
  }
}

const getters = {
  getIsLoggedIn: state => state.isLoggedIn,
  getUserAccessToken: state => state.authUser.access_token,
  getUserID: state => state.authUser.user_id,
  getUserEmail: state => state.authUser.email,
  getUserFirstName: state => state.authUser.firstname,
  getUserLastName: state => state.authUser.lastname,
  getUserRole: state => state.authUser.role,
  getUserStatus: state => state.authUser.status,
  getUserFullName: (state) => {
    return state.authUser.firstname + ' ' + state.authUser.lastname
  }
}

const actions = {
  signIn ({commit, dispatch}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPost('/users/login', payload)
        .then((response) => {
          dispatch('loadingChangeStatus', false)
          commit('LOGGING_IN', {response: response, remember_me: payload.remember_me})
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          dispatch('setAlertData', {showAlert: true, content: error.message, alertClass: 'warning'})
          reject(error)
        })
    })
  },
  signOut ({commit, getters, dispatch}) {
    return new Promise((resolve, reject) => {
      sendPost('/users/logout?access_token=' + getters.getUserAccessToken)
        .then((response) => {
          commit('LOG_OUT')
          resolve(response)
        })
        .catch((error) => {
          dispatch('setAlertData', {showAlert: true, content: error.message, alertClass: 'warning'})
          reject(error)
        })
    })
  }
}

const mutations = {
  LOG_OUT (state) {
    state.isLoggedIn = false
    localStorage.clear()
    sessionStorage.clear()
  },
  CHANGE_LOGGED_USER_DATA_AFTER_UPDATE (state, payload) {
    if (payload.hasOwnProperty('firstname')) {
      state.authUser.firstname = payload.firstname
      if (window.localStorage.length > 0) {
        window.localStorage.setItem('firstname', payload.firstname)
      } else {
        window.sessionStorage.setItem('firstname', payload.firstname)
      }
    }

    if (payload.hasOwnProperty('lastname')) {
      state.authUser.lastname = payload.lastname
      if (window.localStorage.length > 0) {
        window.localStorage.setItem('lastname', payload.lastname)
      } else {
        window.sessionStorage.setItem('lastname', payload.lastname)
      }
    }

    if (payload.hasOwnProperty('email')) {
      state.authUser.email = payload.email
      if (window.localStorage.length > 0) {
        window.localStorage.setItem('email', payload.email)
      } else {
        window.sessionStorage.setItem('email', payload.email)
      }
    }

    if (payload.hasOwnProperty('role')) {
      state.authUser.role = payload.role
      if (window.localStorage.length > 0) {
        window.localStorage.setItem('role', payload.role)
      } else {
        window.sessionStorage.setItem('role', payload.role)
      }
    }

    if (payload.hasOwnProperty('status')) {
      state.authUser.status = payload.status
      if (window.localStorage.length > 0) {
        window.localStorage.setItem('status', payload.status)
      } else {
        window.sessionStorage.setItem('status', payload.status)
      }
    }
  },
  LOGGING_IN (state, payload) {
    if (payload.response.hasOwnProperty('access_token')) {
      state.authUser.access_token = payload.response.access_token
      if (payload.remember_me === true) {
        window.localStorage.setItem('access_token', payload.response.access_token)
      } else {
        window.sessionStorage.setItem('access_token', payload.response.access_token)
      }
      state.isLoggedIn = true
    }
    if (payload.response.hasOwnProperty('user_id')) {
      state.authUser.user_id = payload.response.user_id
      if (payload.remember_me === true) {
        window.localStorage.setItem('user_id', payload.response.user_id)
      } else {
        window.sessionStorage.setItem('user_id', payload.response.user_id)
      }
    }

    if (payload.response.hasOwnProperty('firstname')) {
      state.authUser.firstname = payload.response.firstname
      if (payload.remember_me === true) {
        window.localStorage.setItem('firstname', payload.response.firstname)
      } else {
        window.sessionStorage.setItem('firstname', payload.response.firstname)
      }
    }

    if (payload.response.hasOwnProperty('lastname')) {
      state.authUser.lastname = payload.response.lastname
      if (payload.remember_me === true) {
        window.localStorage.setItem('lastname', payload.response.lastname)
      } else {
        window.sessionStorage.setItem('lastname', payload.response.lastname)
      }
    }

    if (payload.response.hasOwnProperty('email')) {
      state.authUser.email = payload.response.email
      if (payload.remember_me === true) {
        window.localStorage.setItem('email', payload.response.email)
      } else {
        window.sessionStorage.setItem('email', payload.response.email)
      }
    }

    if (payload.response.hasOwnProperty('role')) {
      state.authUser.role = payload.response.role
      if (payload.remember_me === true) {
        window.localStorage.setItem('role', payload.response.role)
      } else {
        window.sessionStorage.setItem('role', payload.response.role)
      }
    }

    if (payload.response.hasOwnProperty('status')) {
      state.authUser.status = payload.response.status
      if (payload.remember_me === true) {
        window.localStorage.setItem('status', payload.response.status)
      } else {
        window.sessionStorage.setItem('status', payload.response.status)
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
