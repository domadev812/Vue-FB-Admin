import {sendGet, sendPut, sendPost, sendDelete} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  sources: {},
  all_sources: {}
}

const actions = {
  createSource ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/sources', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Source created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchSources ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/sources?type=formula&expand=createdBy,modifiedBy', null, null)
        .then((response) => {
          commit('FETCH_SOURCES', response)
          let items = clone(state.sources)
          items['items'] = filter(orderBy(state.sources.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchAllSources ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/sources?per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          commit('FETCH_ALL_SOURCES', response.items)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateSource ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/sources/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Source is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteSource ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/sources/' + payload, null)
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
  getSources: (state) => {
    let items = clone(state.sources)
    items['items'] = filter(orderBy(state.sources.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getAllSources: (state) => {
    let items = clone(state.all_sources)
    items['items'] = filter(orderBy(state.all_sources.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  }
}

const mutations = {
  FETCH_SOURCES (state, payload) {
    state.sources = payload
  },
  FETCH_ALL_SOURCES (state, payload) {
    state.all_sources = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
