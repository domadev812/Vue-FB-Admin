import {sendGet, sendPut, sendPost, sendDelete} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  species: {},
  all_species: {}
}

const actions = {
  createSpecy ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/species', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Specy created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchSpecies ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/species/search?type=' + payload.type + '&expand=createdBy,modifiedBy', null, null)
        .then((response) => {
          commit('FETCH_SPECIES', response)
          let items = clone(state.species)
          items['items'] = filter(orderBy(state.species.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchAllSpecies ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/species?type=formula&per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          commit('FETCH_ALL_SPECIES', response.items)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateSpecy ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/species/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Specy is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteSpecy ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/species/' + payload, null)
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
  getSpecies: (state) => {
    let items = clone(state.species)
    items['items'] = filter(orderBy(state.species.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getAllSpecies: (state) => {
    let items = clone(state.all_species)
    items['items'] = filter(orderBy(state.all_species.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  }
}

const mutations = {
  FETCH_SPECIES (state, payload) {
    state.species = payload
  },
  FETCH_ALL_SPECIES (state, payload) {
    state.all_species = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
