import {sendGet, sendPutJSON, sendDelete, sendPostJSON} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  generals: {},
  generalCategories: {},
  general: {
    id: '',
    name: '',
    type: '',
    traditional_chinese: '',
    simplified_chinese: '',
    category: 0,
    color: '#498a40',
    modified_by_name: '',
    modified_time: '',
    created_by_name: '',
    created_time: ''
  },
  empty_general: {
    currentPage: 1,
    items: [],
    perPage: 20,
    total: 0,
    pagination: {
      currentPage: 1,
      first_page_url: '',
      last_page: 0,
      last_page_url: '',
      per_page: 20,
      total: 0
    }
  }
}

const actions = {
  createGeneral ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/' + payload.type, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'General created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  createGeneralCategory ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/' + payload.type, payload)
        .then((response) => {
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  deleteGeneralCategory ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/' + payload.type + '/' + payload.category_id, null)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchGeneralCategory ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/' + payload.type + '/' + payload.id + '?expand=categories', null, null)
        .then((response) => {
          commit('FETCH_GENERAL_CATEGORY', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchGenerals ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/' + payload.type + '?expand=createdBy,modifiedBy,categories&page=' + payload.page, null, null)
        .then((response) => {
          if (payload.type !== 'channels') commit('FETCH_GENERALS', response)
          let items = clone(state.generals)
          items['items'] = filter(orderBy(state.generals.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateGeneral ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPutJSON('/' + payload.type + '/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'General is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteGeneral ({commit, dispatch, getters}, payload) {
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
  setGeneralValue ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_GENERAL_VALUE', payload)
    })
  }
}

const getters = {
  getGenerals: (state) => {
    let items = clone(state.generals)
    items['items'] = filter(orderBy(state.generals.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getGeneral: (state) => {
    return state.general
  },
  getGeneralCategories: (state) => {
    return state.generalCategories
  }
}

const mutations = {
  FETCH_GENERALS (state, payload) {
    state.generals = payload
  },
  FETCH_GENERAL_CATEGORY (state, payload) {
    state.generalCategories = payload
  },
  SET_GENERAL_VALUE (state, payload) {
    if (payload.hasOwnProperty('id')) {
      state.general.id = payload.id
    }
    if (payload.hasOwnProperty('name')) {
      state.general.name = payload.name
    }
    if (payload.hasOwnProperty('type')) {
      state.general.type = payload.type
    }
    if (payload.hasOwnProperty('traditional_chinese')) {
      state.general.traditional_chinese = payload.traditional_chinese
    }
    if (payload.hasOwnProperty('simplified_chinese')) {
      state.general.simplified_chinese = payload.simplified_chinese
    }
    if (payload.hasOwnProperty('category')) {
      state.general.category = payload.category
    }
    if (payload.hasOwnProperty('color')) {
      state.general.color = payload.color
    }
    if (payload.hasOwnProperty('modified_time')) {
      state.general.modified_time = payload.modified_time
    }
    if (payload.hasOwnProperty('modified_by_name')) {
      state.general.modified_by_name = payload.modified_by_name
    }
    if (payload.hasOwnProperty('created_by_name')) {
      state.general.created_by_name = payload.created_by_name
    }
    if (payload.hasOwnProperty('created_time')) {
      state.general.created_time = payload.created_time
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
