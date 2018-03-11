import {sendGet, sendPut, sendPost, sendDelete} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  herbologies: {},
  herbology: {
    id: '',
    name: '',
    type: '',
    modified_by_name: '',
    modified_time: '',
    created_by_name: '',
    created_time: ''
  }
}

const actions = {
  createHerbology ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/' + payload.type, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Herbology created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchHerbologies ({commit}, payload) {
    if (payload.type === 'prep') payload.type = 'flavours'
    return new Promise((resolve, reject) => {
      sendGet('/' + payload.type + '?expand=createdBy,modifiedBy&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_HERBOLOGIES', response)
          let items = clone(state.herbologies)
          items['items'] = filter(orderBy(state.herbologies.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateHerbology ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/' + payload.type + '/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Herbology is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteHerbology ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/' + payload.type + '/' + payload.id, null)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  setHerbologyValue ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERBOLOGY_VALUE', payload)
    })
  }
}

const getters = {
  getHerbologies: (state) => {
    let items = clone(state.herbologies)
    items['items'] = filter(orderBy(state.herbologies.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getHerbology: (state) => {
    return state.herbology
  }
}

const mutations = {
  FETCH_HERBOLOGIES (state, payload) {
    state.herbologies = payload
  },
  SET_HERBOLOGY_VALUE (state, payload) {
    if (payload.hasOwnProperty('id')) {
      state.herbology.id = payload.id
    }
    if (payload.hasOwnProperty('name')) {
      state.herbology.name = payload.name
    }
    if (payload.hasOwnProperty('type')) {
      state.herbology.type = payload.type
    }
    if (payload.hasOwnProperty('modified_time')) {
      state.herbology.modified_time = payload.modified_time
    }
    if (payload.hasOwnProperty('modified_by_name')) {
      state.herbology.modified_by_name = payload.modified_by_name
    }
    if (payload.hasOwnProperty('created_by_name')) {
      state.herbology.created_by_name = payload.created_by_name
    }
    if (payload.hasOwnProperty('created_time')) {
      state.herbology.created_time = payload.created_time
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
