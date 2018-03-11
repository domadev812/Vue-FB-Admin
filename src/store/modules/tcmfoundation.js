import {sendGet, sendPut, sendPost, sendDelete} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  categories: {}
}

const actions = {
  createCategory ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/categories', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Category created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchCategories ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/categories/search?type=' + payload.type + '&expand=createdBy,modifiedBy', null, null)
        .then((response) => {
          commit('FETCH_CATEGORIES', response)
          let items = clone(state.categories)
          items['items'] = filter(orderBy(state.categories.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateCategory ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/categories/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Category is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteCategory ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/categories/' + payload, null)
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
  getCategories: (state) => {
    let items = clone(state.categories)
    items['items'] = filter(orderBy(state.categories.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  }
}

const mutations = {
  FETCH_CATEGORIES (state, payload) {
    state.categories = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
