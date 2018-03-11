import { sendGet } from '../config/api'

let loadingChangeStatus = ({commit}, payload) => {
  commit('LOADING_CHANGE', payload)
}

let setAlertData = ({commit}, payload) => {
  commit('ALERT_CHANGE', payload)
  setTimeout(() => {
    commit('ALERT_HIDE')
  }, 2000)
}

let fetchCountries = ({commit}) => {
  return new Promise((resolve, reject) => {
    sendGet('/countries?per-page=0', null, null)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let fetchLanguages = ({commit}) => {
  return new Promise((resolve, reject) => {
    sendGet('/languages?per-page=0', null)
      .then((response) => {
        commit('FETCH_LANGUAGE', response)
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let fetchRoles = ({commit}) => {
  return new Promise((resolve, reject) => {
    sendGet('/roles', null, null)
      .then((response) => {
        commit('FETCH_ROLES', response)
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

let setCategoryValue = ({commit}, category) => {
  commit('SET_CATEGORY_VALUE', category)
}

let switchTab = ({commit}, tab) => {
  commit('SWITCH_TAB', tab)
}

let setTabName = ({commit}, tabName) => {
  commit('SET_TAB_NAME', tabName)
}

let setTcmTabType = ({commit}, tcmTabTypee) => {
  commit('SET_TCM_TAB_TYPE', tcmTabTypee)
}

let chooseTcmFilter = ({commit}, listItem) => {
  commit('CHOOSE_TCM_FILTER', listItem)
}

let setModalType = ({commit}, type) => {
  commit('SET_MODAL_TYPE', type)
}

let setLoadingBar = ({commit}, payload) => {
  commit('SET_LOADING_BAR', payload)
}

let setLoadingBarText = ({commit}, payload) => {
  commit('SET_LOADING_BAR_TEXT', payload)
}

let setFilterFlag = ({commit}, payload) => {
  commit('SET_FILTER_FLAG', payload)
}

let setFormulaFilterQuery = ({commit}, payload) => {
  commit('SET_FORMULA_FILTER_QUERY', payload)
}

let setHerbFilterQuery = ({commit}, payload) => {
  commit('SET_HERB_FILTER_QUERY', payload)
}

export { loadingChangeStatus }
export { setAlertData }
export { fetchCountries }
export { fetchLanguages }
export { fetchRoles }
export { switchTab }
export { setTabName }
export { setTcmTabType }
export { chooseTcmFilter }
export { setModalType }
export { setCategoryValue }
export { setLoadingBar }
export { setLoadingBarText }
export { setFilterFlag }
export { setFormulaFilterQuery }
export { setHerbFilterQuery }
