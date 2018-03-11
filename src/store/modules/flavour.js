import {sendGet, sendPut, sendPost, sendDelete} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  flavours: {},
  all_flavours: {}
}

const actions = {
  createFlavour ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/flavours', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Flavour created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchFlavours ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/flavours/search?type=' + payload.type + '&expand=createdBy,modifiedBy', null, null)
        .then((response) => {
          commit('FETCH_FLAVOURS', response)
          let items = clone(state.flavours)
          items['items'] = filter(orderBy(state.flavours.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchAllFlavours ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/flavours?expand=createdBy,modifiedBy&per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          let items = response
          items['items'] = filter(orderBy(items.items, null, ['desc', 'desc']), {'is_deleted': 0})
          commit('FETCH_ALL_FLAVOURS', items.items)
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateFlavour ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/flavours/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Flavour is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteFlavour ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/flavours/' + payload, null)
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
  getFlavours: (state) => {
    let items = clone(state.flavours)
    items['items'] = filter(orderBy(state.flavours.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getAllFlavours: (state) => {
    let items = clone(state.all_flavours)
    items['items'] = filter(orderBy(state.all_flavours.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  }
}

const mutations = {
  FETCH_FLAVOURS (state, payload) {
    state.flavours = payload
  },
  FETCH_ALL_FLAVOURS (state, payload) {
    state.all_flavours = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
