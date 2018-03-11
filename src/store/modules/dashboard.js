import { sendGet } from '../../config/api'
import clone from 'lodash/clone'
import orderBy from 'lodash/orderBy'

const actions = {
  fetchAllActivity ({commit}) {
    return new Promise((resolve, reject) => {
      sendGet('/activities?expand=user', null)
        .then((response) => {
          commit('FETCH_ALL_ACTIVITY', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
const getters = {
  getAllActivity: (state) => {
    let items = clone(state.activity)
    items['items'] = orderBy(state.activity.items, ['created_time'], 'desc')
    return items
  }
}
const mutations = {
  FETCH_ALL_ACTIVITY (state, payload) {
    state.activity = payload
  }
}
const state = {
  activity: {}
}

export default {
  actions,
  getters,
  mutations,
  state
}
