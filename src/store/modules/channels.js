import {sendGet, sendPut, sendPost, sendDelete} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  channels: {},
  all_channels: {},
  channel: {
    id: '',
    english_name: '',
    chinese_name: '',
    modified_by_name: '',
    modified_time: '',
    created_by_name: '',
    created_time: ''
  }
}

const actions = {
  createChannel ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/channels', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Channel created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchChannels ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/channels?expand=createdBy,modifiedBy&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_CHANNELS', response)
          let items = clone(state.channels)
          items['items'] = filter(orderBy(state.channels.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchAllChannels ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/channels?expand=createdBy,modifiedBy&per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          let items = response
          items['items'] = filter(orderBy(items.items, null, ['desc', 'desc']), {'is_deleted': 0})
          commit('FETCH_ALL_CHANNELS', items.items)
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateChannel ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/channels/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Channel is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteChannel ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/channels/' + payload.id, null)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  setChannelValue ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_CHANNEL_VALUE', payload)
    })
  }
}

const getters = {
  getChannels: (state) => {
    let items = clone(state.channels)
    items['items'] = filter(orderBy(state.channels.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getChannel: (state) => {
    return state.channel
  }
}

const mutations = {
  FETCH_CHANNELS (state, payload) {
    state.channels = payload
  },
  FETCH_ALL_CHANNELS (state, payload) {
    state.all_channels = payload
  },
  SET_CHANNEL_VALUE (state, payload) {
    if (payload.hasOwnProperty('id')) {
      state.channel.id = payload.id
    }
    if (payload.hasOwnProperty('english_name')) {
      state.channel.english_name = payload.english_name
    }
    if (payload.hasOwnProperty('chinese_name')) {
      state.channel.chinese_name = payload.chinese_name
    }
    if (payload.hasOwnProperty('modified_time')) {
      state.channel.modified_time = payload.modified_time
    }
    if (payload.hasOwnProperty('modified_by_name')) {
      state.channel.modified_by_name = payload.modified_by_name
    }
    if (payload.hasOwnProperty('created_by_name')) {
      state.channel.created_by_name = payload.created_by_name
    }
    if (payload.hasOwnProperty('created_time')) {
      state.channel.created_time = payload.created_time
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
