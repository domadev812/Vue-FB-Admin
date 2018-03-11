import axios from 'axios'
import toNumber from 'lodash/toNumber'

let baseUrl = 'https://dev-fbs.protcmclinic.com/v1/'
let convertObjectToFormData = (items) => {
  const formData = new FormData()
  for (let key in items) {
    formData.append(key, items[key])
  }
  return formData
}

let convertObjectToUrlData = (items) => {
  const params = new URLSearchParams()
  for (let key in items) {
    if (items[key]) {
      params.append(key, items[key])
    }
  }
  return params
}

let config = {
  protocol: 'https',
  address: 'dev-fbs.protcmclinic.com',
  port: '80',
  basePath: '/v1',
  axiosConfig: {
    baseURL: baseUrl,
    headers: {},
    withCredentials: true
  },
  getEndpointUrl () {
    return this.protocol + '://' + this.address /* + (this.port ? (':' + this.port) : '') */ + (this.basePath ? this.basePath : '')
  }
}
if (localStorage.getItem('access_token') || sessionStorage.getItem('access_token')) {
  config.axiosConfig.headers['authorization'] = 'Bearer ' + (localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))
}

let $http = axios.create(config.axiosConfig)

if (localStorage.getItem('access_token') || sessionStorage.getItem('access_token')) {
  $http.defaults.headers.common['authorization'] = 'Bearer ' + (localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))
}

let sendPost = (url, payload, headers = null) => {
  return new Promise((resolve, reject) => {
    $http.post(url, convertObjectToFormData(payload))
      .then((handleSuccess) => {
        if (handleSuccess.data.code === 200 || handleSuccess.data.hasOwnProperty('code')) {
          reject({message: handleSuccess.data.message, code: handleSuccess.data.code})
        } else {
          resolve(handleSuccess.data)
        }
      })
      .catch((handleError) => {
        reject(handleError)
      })
  })
}

let sendPostJSON = (url, payload, headers = null) => {
  return new Promise((resolve, reject) => {
    $http.post(url, payload)
      .then((handleSuccess) => {
        if (handleSuccess.data.code === 200 || handleSuccess.data.hasOwnProperty('code')) {
          reject({message: handleSuccess.data.message, code: handleSuccess.data.code})
        } else {
          resolve(handleSuccess.data)
        }
      })
      .catch((handleError) => {
        reject(handleError)
      })
  })
}

let sendPut = (url, payload, headers = null) => {
  return new Promise((resolve, reject) => {
    $http.put(url, convertObjectToUrlData(payload), headers)
      .then((handleSuccess) => {
        if (handleSuccess.data.code === 200 || handleSuccess.data.hasOwnProperty('code')) {
          reject({message: handleSuccess.data.message, code: handleSuccess.data.code})
        } else {
          resolve(handleSuccess.data)
        }
      })
      .catch((handleError) => {
        reject(handleError)
      })
  })
}

let sendPutJSON = (url, payload, headers = null) => {
  return new Promise((resolve, reject) => {
    $http.put(url, payload, headers)
      .then((handleSuccess) => {
        if (handleSuccess.data.code === 200 || handleSuccess.data.hasOwnProperty('code')) {
          reject({message: handleSuccess.data.message, code: handleSuccess.data.code})
        } else {
          resolve(handleSuccess.data)
        }
      })
      .catch((handleError) => {
        reject(handleError)
      })
  })
}

let sendGet = (url, payload, headers = null, sort = null) => {
  let pageCount = null
  if (sort !== null) {
    console.log(sort)
  }
  return new Promise((resolve, reject) => {
    $http.get(url, headers)
      .then((handleSuccess) => {
        let responseURL = handleSuccess.request.responseURL
        let url = new URL(responseURL)
        let urlString = (url.origin + url.pathname)
        if (handleSuccess.data.code === 200 || handleSuccess.data.hasOwnProperty('code')) {
          reject({message: handleSuccess.data.message, code: handleSuccess.data.code})
        } else {
          let items = {}
          items['pagination'] = {}
          if (handleSuccess.headers.hasOwnProperty('x-pagination-total-count')) {
            items['total'] = toNumber(handleSuccess.headers['x-pagination-total-count'])
            items['pagination']['total'] = toNumber(handleSuccess.headers['x-pagination-total-count'])
          }
          if (handleSuccess.headers.hasOwnProperty('x-pagination-per-page')) {
            items['perPage'] = toNumber(handleSuccess.headers['x-pagination-per-page'])
            items['pagination']['per_page'] = toNumber(handleSuccess.headers['x-pagination-per-page'])
            items['pagination']['first_page_url'] = urlString + url.search + '&page=1'
          }
          if (handleSuccess.headers.hasOwnProperty('x-pagination-page-count')) {
            pageCount = toNumber(handleSuccess.headers['x-pagination-page-count'])
            items['pageCount'] = pageCount
            items['pagination']['last_page'] = pageCount
            items['pagination']['last_page_url'] = urlString + url.search + '&page=' + pageCount
          }
          if (handleSuccess.headers.hasOwnProperty('x-pagination-current-page')) {
            let currentPage = toNumber(handleSuccess.headers['x-pagination-current-page'])
            items['currentPage'] = currentPage
            items['pagination']['current_page'] = currentPage
            if ((currentPage < pageCount) && (currentPage <= 1) && (pageCount > 1)) {
              items['pagination']['next_page_url'] = (urlString + url.search) + ('&page=' + (++currentPage))
              items['pagination']['prev_page_url'] = null
            }
            if ((currentPage > 1) && (currentPage <= pageCount) && (pageCount > 1)) {
              items['pagination']['prev_page_url'] = (urlString + url.search) + ('&page=' + (--currentPage))
            }
            items['items'] = handleSuccess.data
            resolve(items)
          } else {
            resolve(handleSuccess.data)
          }
        }
      })
      .catch((handleError) => {
        reject(handleError)
      })
  })
}

let sendDelete = (url, headers = null) => {
  return new Promise((resolve, reject) => {
    $http.delete(url, headers)
      .then((handleSuccess) => {
        if (handleSuccess.data.code === 200 || handleSuccess.data.hasOwnProperty('code')) {
          reject({message: handleSuccess.data.message, code: handleSuccess.data.code})
        } else {
          resolve(handleSuccess.data)
        }
      })
      .catch((handleError) => {
        reject(handleError)
      })
  })
}

export default config

export { config }

export { sendPost }

export { sendPostJSON }

export { sendGet }

export { sendPut }

export { sendPutJSON }

export { sendDelete }
