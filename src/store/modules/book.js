import {sendGet, sendPut, sendPost, sendDelete} from '../../config/api'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import orderBy from 'lodash/orderBy'

const state = {
  books: {},
  chapters: {},
  pages: {},
  book: {
    id: 0,
    english_name: '',
    chinese_name: '',
    year: 2013,
    author: '',
    chinese_author: '',
    modified_by_name: '',
    modified_time: '',
    created_by_name: '',
    created_time: ''
  },
  chapter: {
    id: 0,
    book_id: 0,
    english_name: '',
    chinese_name: '',
    modified_by_name: '',
    modified_time: '',
    created_by_name: '',
    created_time: ''
  }
}

const actions = {
  createBook ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/books', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Book created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  createChapter ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/book-chapters', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Chapter created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  createPage ({commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      sendPost('/book-pages', payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Page created', alertClass: 'success'})
          resolve(response)
        })
      .catch((error) => {
        reject(error)
      })
    })
  },
  fetchBooks ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/books?expand=createdBy,modifiedBy&page=' + payload.page, null, null)
        .then((response) => {
          commit('FETCH_BOOKS', response)
          let items = clone(state.books)
          items['items'] = filter(orderBy(state.books.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchBookTotal ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/books?expand=createdBy,modifiedBy&per-page=0', null, null)
        .then((response) => {
          commit('FETCH_BOOKS', response)
          let items = clone(state.books)
          items['items'] = filter(orderBy(state.books.items, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchChapters ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/books/' + payload.id + '/chapters?expand=createdBy,modifiedBy', null, null)
        .then((response) => {
          commit('FETCH_CHAPTERS', response)
          let items = clone(state.chapters)
          items = filter(orderBy(state.chapters, null, ['desc', 'desc']), {'is_deleted': 0})
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchPage ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/books/' + payload.book_id + '/chapter/' + payload.id + '?expand=pages', null, null)
        .then((response) => {
          resolve(response[0].pages)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchBook ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/books/' + payload.id + '?expand=chapters', null, null)
        .then((response) => {
          commit('SET_BOOK_VALUE', response)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  fetchChapter ({commit}, payload) {
    return new Promise((resolve, reject) => {
      sendGet('/books/' + payload.book_id + '/chapter/' + payload.id, null, null)
        .then((response) => {
          commit('SET_CHAPTER_VALUE', response[0])
          resolve(response[0])
        })
        .catch((error) => {
          reject(error)
        })
    })
    // return new Promise((resolve, reject) => {
    //   let items = clone(state.chapters)
    //   items = filter(orderBy(state.chapters, null, ['desc', 'desc']), {'id': payload.id})
    //   if (items.length > 0) commit('SET_CHAPTER_VALUE', items[0])
    //   resolve(items[0])
    // })
  },
  setBookValue ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_BOOK_VALUE', payload)
    })
  },
  setChapterValue ({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_CHAPTER_VALUE', payload)
    })
  },
  updateBook ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/books/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Book is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  updateChapter ({commit, dispatch, getters}, payload) {
    dispatch('loadingChangeStatus', true)
    return new Promise((resolve, reject) => {
      sendPut('/book-chapters/' + payload.id, payload)
        .then((response) => {
          dispatch('setAlertData', {showAlert: true, content: 'Chapter is updated!', alertClass: 'success'})
          dispatch('loadingChangeStatus', false)
          resolve(response)
        })
        .catch((error) => {
          dispatch('loadingChangeStatus', false)
          reject(error)
        })
    })
  },
  deleteBook ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/books/' + payload, null)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteChapter ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/book-chapters/' + payload, null)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deletePage ({commit, dispatch, getters}, payload) {
    return new Promise((resolve, reject) => {
      sendDelete('/book-pages/' + payload, null)
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
  getBooks: (state) => {
    let items = clone(state.books)
    items['items'] = filter(orderBy(state.books.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getBook: (state) => {
    return state.book
  },
  getChapters: (state) => {
    let items = clone(state.chapters)
    items['items'] = filter(orderBy(state.books.items, ['created_time', 'modified_time'], ['desc', 'desc']), {'is_deleted': 0})
    return items
  },
  getChapter: (state) => {
    return state.chapter
  },
  getPage: (state) => {
    return state.page
  }
}

const mutations = {
  FETCH_BOOKS (state, payload) {
    state.books = payload
  },
  FETCH_CHAPTERS (state, payload) {
    state.chapters = payload
  },
  FETCH_PAGES (state, payload) {
    state.pages = payload
  },
  SET_BOOK_VALUE (state, book) {
    if (book.hasOwnProperty('id')) {
      state.book.id = book.id
    }
    if (book.hasOwnProperty('english_name')) {
      state.book.english_name = book.english_name
    }
    if (book.hasOwnProperty('chinese_name')) {
      state.book.chinese_name = book.chinese_name
    }
    if (book.hasOwnProperty('year')) {
      state.book.year = book.year
    }
    if (book.hasOwnProperty('author')) {
      state.book.author = book.author
    }
    if (book.hasOwnProperty('chinese_author')) {
      state.book.chinese_author = book.chinese_author
    }
    if (book.hasOwnProperty('modified_time')) {
      state.book.modified_time = book.modified_time
    }
    if (book.hasOwnProperty('modified_by_name')) {
      state.book.modified_by_name = book.modified_by_name
    }
    if (book.hasOwnProperty('created_by_name')) {
      state.book.created_by_name = book.created_by_name
    }
    if (book.hasOwnProperty('created_time')) {
      state.book.created_time = book.created_time
    }
  },
  SET_CHAPTER_VALUE (state, chapter) {
    if (chapter.hasOwnProperty('id')) {
      state.chapter.id = chapter.id
    }
    if (chapter.hasOwnProperty('book_id')) {
      state.chapter.book_id = chapter.book_id
    }
    if (chapter.hasOwnProperty('english_name')) {
      state.chapter.english_name = chapter.english_name
    }
    if (chapter.hasOwnProperty('chinese_name')) {
      state.chapter.chinese_name = chapter.chinese_name
    }
    if (chapter.hasOwnProperty('modified_time')) {
      state.chapter.modified_time = chapter.modified_time
    }
    if (chapter.hasOwnProperty('modified_by_name')) {
      state.chapter.modified_by_name = chapter.modified_by_name
    }
    if (chapter.hasOwnProperty('created_by_name')) {
      state.chapter.created_by_name = chapter.created_by_name
    }
    if (chapter.hasOwnProperty('created_time')) {
      state.chapter.created_time = chapter.created_time
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
