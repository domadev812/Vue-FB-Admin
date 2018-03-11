import { sendGet, sendPost, sendPostJSON, sendPut, sendDelete } from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'
import reduce from 'lodash/reduce'

const state = {
  herbs: {},
  totalHerbs: {},
  herb: {},
  selectedHerb: {
    id: '',
    pinyin: '',
    english_name: '',
    latin_name: '',
    traditional_chinese: '',
    simplified_chinese: '',
    pinyin_ton: '',
    modified_by_name: '',
    modified_time: '',
    created_by_name: '',
    created_time: ''
  },
  herbActivity: {},
  herbsCategories: {},
  herbCategories: [],
  herbFlavours: [],
  herbNatures: [],
  herbChannels: [],
  herbFormulas: [],
  herbTexts: [],
  herbPreps: [],
  herbSpecies: [],
  herbCultivations: [],
  herbCautions: []
}

const actions = {
  fetchHerbs ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/herbs?expand=categories,createdBy&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_HERBS', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  searchHerbs ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/herbs/search?' + payload.query + '&expand=categories,natures,flavours,channels,formulas,createdBy,modifiedBy&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_HERBS', response)
          resolve(response)
        })
        .catch((error) => {
          console.log('error')
          reject(error)
        })
    })
  },
  fetchHerbTotal ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/herbs/search?' + payload.query + '&expand=categories,natures,flavours,channels,formulas,createdBy,modifiedBy&per-page=0', null, null)
        .then((response) => {
          commit('FETCH_TOTAL_HERBS', response)
          resolve(response)
        })
        .catch((error) => {
          console.log('error')
          reject(error)
        })
    })
  },
  createHerb ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/herbs', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Herb created', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchHerb ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/herbs/' + payload.id + '?expand=categories,natures,flavours,channels,formulas,createdBy,modifiedBy', null, null)
        .then((response) => {
          commit('FETCH_HERB', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateHerb ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendPut('/herbs/' + payload.id, payload.model)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Herb updated', alertClass: 'success'})
          commit('FETCH_HERB', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteHerb ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/herbs/' + payload.id)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Herb deleted', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchHerbActivity ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/herbs/' + payload.id + '/activities?expand=user', null, null)
        .then((response) => {
          commit('FETCH_HERB_ACTIVITY', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchHerbsCategories ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/categories/search?type=herb&per-page=0&query=' + payload.query, null, null)
        .then((response) => {
          commit('FETCH_HERBS_CATEGORIES', response.items)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  createHerbCategory ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/herb-categories', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Herb categories updated', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateHerbCategory ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPostJSON('/herbs/' + payload.herb_id + '/categories', payload.categories)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Herb categories updated', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteHerbCategory ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/herb-categories/' + payload.id)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Herb categories updated', alertClass: 'success'})
          resolve(response)
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  setHerbValue ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_VALUE', payload)
    })
  },
  setHerbCategories ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_CATEGORIES', payload)
    })
  },
  setHerbFlavours ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_FLAVOURS', payload)
    })
  },
  setHerbNatures ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_NATURES', payload)
    })
  },
  setHerbChannels ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_CHANNELS', payload)
    })
  },
  setHerbFormulas ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_FORMULAS', payload)
    })
  },
  setHerbTexts ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_TEXTS', payload)
    })
  },
  setHerbPreps ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_PREPS', payload)
    })
  },
  setHerbSpecies ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_SPECIES', payload)
    })
  },
  setHerbCultivations ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_CULTIVATIONS', payload)
    })
  },
  setHerbCautions ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_HERB_CAUTIONS', payload)
    })
  }
}

const getters = {
  getHerbs: (state) => {
    let items = clone(state.herbs)
    items['items'] = filter(orderBy(state.herbs.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getTotalHerbs: (state) => {
    let items = clone(state.totalHerbs)
    items['items'] = filter(orderBy(state.totalHerbs.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getHerb: (state) => {
    return state.herb
  },
  getSelectedHerb: (state) => {
    return state.selectedHerb
  },
  getHerbFormulas: (state) => {
    return state.herbFormulas
  },
  getHerbFormulaIds: (state) => {
    let herbFormulas = clone(state.herbFormulas)
    return reduce(herbFormulas, function (ids, formula) {
      ids.push(formula.id)
      return ids
    }, [])
  },
  getHerbCategories: (state) => {
    return state.herbCategories
  },
  getHerbCategoryIds: (state) => {
    let herbCategories = clone(state.herbCategories)
    return reduce(herbCategories, function (ids, category) {
      ids.push(category.id)
      return ids
    }, [])
  },
  getHerbFlavours: (state) => {
    return state.herbFlavours
  },
  getHerbFlavourIds: (state) => {
    let herbFlavours = clone(state.herbFlavours)
    return reduce(herbFlavours, function (ids, flavour) {
      ids.push(flavour.id)
      return ids
    }, [])
  },
  getHerbNatures: (state) => {
    return state.herbNatures
  },
  getHerbNatureIds: (state) => {
    let herbNatures = clone(state.herbNatures)
    return reduce(herbNatures, function (ids, nature) {
      ids.push(nature.id)
      return ids
    }, [])
  },
  getHerbChannels: (state) => {
    return state.herbChannels
  },
  getHerbChannelIds: (state) => {
    let herbChannels = clone(state.herbChannels)
    return reduce(herbChannels, function (ids, channel) {
      ids.push(channel.id)
      return ids
    }, [])
  },
  getHerbActivity: (state) => {
    let items = clone(state.herbActivity)
    items['items'] = filter(orderBy(state.herbActivity.items, ['created_time'], ['desc']), {'is_deleted': 0})
    return items
  },
  getHerbsCategories: (state) => {
    let items = clone(state.herbsCategories)
    items['items'] = filter(orderBy(state.herbsCategories, ['name'], ['asc']), {'is_deleted': 0})
    return items['items']
  },
  getHerbTexts: (state) => {
    return state.herbTexts
  },
  getHerbTextIds: (state) => {
    let herbTexts = clone(state.herbTexts)
    return reduce(herbTexts, function (ids, text) {
      ids.push(text.id)
      return ids
    }, [])
  },
  getHerbPreps: (state) => {
    return state.herbPreps
  },
  getHerbPrepIds: (state) => {
    let herbPreps = clone(state.herbPreps)
    return reduce(herbPreps, function (ids, prep) {
      ids.push(prep.id)
      return ids
    }, [])
  },
  getHerbSpecies: (state) => {
    return state.herbSpecies
  },
  getHerbSpecyIds: (state) => {
    let herbSpecies = clone(state.herbSpecies)
    return reduce(herbSpecies, function (ids, specy) {
      ids.push(specy.id)
      return ids
    }, [])
  },
  getHerbCultivations: (state) => {
    return state.herbCultivations
  },
  getHerbCultivationIds: (state) => {
    let herbCultivations = clone(state.herbCultivations)
    return reduce(herbCultivations, function (ids, cultivation) {
      ids.push(cultivation.id)
      return ids
    }, [])
  },
  getHerbCautions: (state) => {
    return state.herbCautions
  },
  getHerbCautionIds: (state) => {
    let herbCautions = clone(state.herbCautions)
    return reduce(herbCautions, function (ids, caution) {
      ids.push(caution.id)
      return ids
    }, [])
  }
}

const mutations = {
  FETCH_HERBS (state, payload) {
    state.herbs = payload
  },
  FETCH_TOTAL_HERBS (state, payload) {
    state.totalHerbs = payload
  },
  FETCH_HERB (state, payload) {
    state.herb = payload
    state.herbCategories = payload.categories
    state.herbFlavours = payload.flavours
    state.herbNatures = payload.natures
    state.herbChannels = payload.channels
    state.herbFormulas = payload.formulas
    state.herbTexts = payload.sources
    state.herbPreps = []
    state.herbSpecies = []
    state.herbCultivations = []
    state.herbCautions = []
  },
  SET_HERB_VALUE (state, payload) {
    if (payload.hasOwnProperty('id')) {
      state.selectedHerb.id = payload.id
    }
    if (payload.hasOwnProperty('pinyin')) {
      state.selectedHerb.pinyin = payload.pinyin
    }
    if (payload.hasOwnProperty('english_name')) {
      state.selectedHerb.english_name = payload.english_name
    }
    if (payload.hasOwnProperty('latin_name')) {
      state.selectedHerb.latin_name = payload.latin_name
    }
    if (payload.hasOwnProperty('traditional_chinese')) {
      state.selectedHerb.traditional_chinese = payload.traditional_chinese
    }
    if (payload.hasOwnProperty('simplified_chinese')) {
      state.selectedHerb.simplified_chinese = payload.simplified_chinese
    }
    if (payload.hasOwnProperty('pinyin_ton')) {
      state.selectedHerb.pinyin_ton = payload.pinyin_ton
    }
    if (payload.hasOwnProperty('modified_time')) {
      state.selectedHerb.modified_time = payload.modified_time
    }
    if (payload.hasOwnProperty('modified_by_name')) {
      state.selectedHerb.modified_by_name = payload.modified_by_name
    }
    if (payload.hasOwnProperty('created_by_name')) {
      state.selectedHerb.created_by_name = payload.created_by_name
    }
    if (payload.hasOwnProperty('created_time')) {
      state.selectedHerb.created_time = payload.created_time
    }
  },
  FETCH_HERB_ACTIVITY (state, payload) {
    state.herbActivity = payload
  },
  FETCH_HERBS_CATEGORIES (state, payload) {
    state.herbsCategories = payload
  },
  SET_HERB_CATEGORIES (state, payload) {
    state.herbCategories = payload
  },
  SET_HERB_FLAVOURS (state, payload) {
    state.herbFlavours = payload
  },
  SET_HERB_NATURES (state, payload) {
    state.herbNatures = payload
  },
  SET_HERB_CHANNELS (state, payload) {
    state.herbChannels = payload
  },
  SET_HERB_FORMULAS (state, payload) {
    state.herbFormulas = payload
  },
  SET_HERB_TEXTS (state, payload) {
    state.herbTexts = payload
  },
  SET_HERB_PREPS (state, payload) {
    state.herbPreps = payload
  },
  SET_HERB_SPECIES (state, payload) {
    state.herbSpecies = payload
  },
  SET_HERB_CULTIVATIONS (state, payload) {
    state.herbCultivations = payload
  },
  SET_HERB_CAUTIONS (state, payload) {
    state.herbCautions = payload
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
