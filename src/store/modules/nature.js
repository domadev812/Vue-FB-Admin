import {sendGet, sendPut, sendPost, sendDelete} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  natures: {},
  all_natures: {}
}

const actions = {
  createNature ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/natures', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Nature created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchNatures ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/natures/search?type=' + payload.type + '&expand=createdBy,modifiedBy', null, null)
        .then((response) => {
          commit('FETCH_NATURES', response)
          let items = clone(state.natures)
          items['items'] = filter(orderBy(state.natures.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchAllNatures ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/natures?expand=createdBy,modifiedBy&type=formula&per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          commit('FETCH_ALL_NATURES', response.items)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateNature ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/natures/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Nature is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteNature ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/natures/' + payload, null)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

const getters = {
  getNatures: (state) => {
    let items = clone(state.natures)
    items['items'] = filter(orderBy(state.natures.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getAllNatures: (state) => {
    let items = clone(state.all_natures)
    items['items'] = filter(orderBy(state.all_natures.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  }
}

const mutations = {
  FETCH_NATURES (state, payload) {
    state.natures = payload
  },
  FETCH_ALL_NATURES (state, payload) {
    state.all_natures = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
