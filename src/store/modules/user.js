import { sendGet, sendPut, sendPost, sendDelete } from '../../config/api'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
import clone from 'lodash/clone'
import each from 'lodash/each'
import isObject from 'lodash/isObject'

const state = {
  activity: {},
  profile: {},
  loginHistory: {},
  devices: {},
  users: {}
}

const actions = {
  fetchUserActivity ({commit, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/users/' + (payload.id ? payload.id : getters.getUserID) + '/activity?expand=user&page=' + payload['page'] + '&per-page=' + payload['per-page'], null, null)
        .then((response) => {
          commit('FETCH_ACTIVITY', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchUserLoginHistory ({commit, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/users/' + (payload.id ? payload.id : getters.getUserID) + '/login-history?page=' + payload['page'] + '&per-page=' + payload['per-page'], null)
        .then((response) => {
          commit('FETCH_USER_LOGIN_HISTORY', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchUserDevices ({commit, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/users/' + (payload.id ? payload.id : getters.getUserID) + '/devices?page=' + payload['page'] + '&per-page=' + payload['per-page'], null)
        .then((response) => {
          commit('FETCH_USER_DEVICES', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchUserProfile ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/users/' + payload + '?expand=createdBy,modifiedBy', null)
        .then((response) => {
          commit('FETCH_PROFILE', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  fetchSearchUsers ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/users/search?query=' + payload.query + '&page=' + payload.page, null)
        .then((response) => {
          commit('FETCH_USERS', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchAllUsers ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/users?expand=lastLogin&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_USERS', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateUserPassword ({dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/users/changepassword?access_token=' + getters.getUserAccessToken, payload)
        .then((response) => {
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          dispatch('setAlertData', {showAlert: true, content: error.message, alertClass: 'warning'})
          reject(error)
        })
    })
  },
  createUserProfile ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPost('/users', payload)
        .then((response) => {
          dispatch('loadingChangeStatus', false)
          dispatch('fetchAllUsers', getters.getUserAccessToken)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          dispatch('setAlertData', {showAlert: true, content: error.message, alertClass: 'warning'})
          reject(error)
        })
    })
  },
  updateUserProfile ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/users/' + payload.id + '?access_token=' + getters.getUserAccessToken, payload.data)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Profile updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          dispatch('fetchUserProfile', response.id)
          if (getters.getUserID === payload.id) {
            commit('CHANGE_LOGGED_USER_DATA_AFTER_UPDATE', response)
          }
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteUser ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      if (!isObject(payload)) {
        sendDelete('/users/' + payload, null)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        each(payload.users, (user) => {
          sendDelete('/users/' + user, null)
            .then((response) => {
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        })
      }
    })
  },
  deleteUserData ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      if (!isObject(payload)) {
        sendDelete('/users/' + payload + '/data', null)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        each(payload.users, (user) => {
          sendDelete('/users/' + user + '/data', null)
            .then((response) => {
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        })
      }
    })
  }
}

const getters = {
  getUserActivity: (state) => {
    let items = clone(state.activity)
    items['items'] = filter(orderBy(state.activity.items, ['created_time']), {'type': 'action'})
    return items
  },
  getUsers: (state) => {
    let items = clone(state.users)
    items['items'] = filter(orderBy(state.users.items, ['created_time'], ['desc']))
    return items
  },
  getUserProfile: state => state.profile,
  getUserLoginHistory: (state) => {
    let items = clone(state.loginHistory)
    items['items'] = filter(orderBy(state.loginHistory.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getUserDevices: (state) => {
    let items = clone(state.devices)
    items['items'] = filter(orderBy(state.devices.items, ['created_time'], ['desc']), {'is_deleted': 0})
    return items
  }
}

const mutations = {
  FETCH_ACTIVITY (state, payload) {
    state.activity = payload
  },
  FETCH_USERS (state, payload) {
    state.users = payload
  },
  FETCH_CREATED_BY (state, payload) {
    state.created_by = payload
  },
  FETCH_MODIFIED_BY (state, payload) {
    state.modified_by = payload
  },
  FETCH_USER_LOGIN_HISTORY (state, payload) {
    state.loginHistory = payload
  },
  FETCH_USER_DEVICES (state, payload) {
    state.devices = payload
  },
  FETCH_PROFILE (state, payload) {
    state.profile = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
