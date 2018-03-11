import {
  getObjectValueByPath
} from '../../utils/helpers'

export default {
  methods: {
    isSelected (item) {
      return this.selected[item[this.itemKey]]
    },
    isExpanded (item) {
      return this.expanded[item[this.itemKey]]
    }
  },
  data () {
    return {
      all: false,
      searchLength: 0,
      defaultPagination: {
        descending: true,
        page: 1,
        rowPerPage: 5,
        sortBy: null,
        totalItems: 0
      },
      expanded: {}
    }
  },
  computed: {
    itemsLength () {
      if (this.search) return this.searchLength
      return this.totalItems || this.items.length
    },
    someItems () {
      return this.filteredItems.some(i => this.isSelected(i))
    },
    computedPagination () {
      return this.hasPagination
        ? this.pagination
        : this.defaultPagination
    },
    hasPagination () {
      const pagination = this.pagination || {}

      return Object.keys(pagination).length > 0
    },
    filteredItems () {
      if (this.totalItems) return this.items

      let items = this.items.slice()
      const hasSearch = typeof this.search !== 'undefined' &&
        this.search !== null

      if (hasSearch) {
        items = this.customFilter(items, this.search, this.filter)
        this.searchLength = items.length
      }

      items = this.customSort(
        items,
        this.computedPagination.sortBy,
        this.computedPagination.descending
      )

      return this.hideActions &&
      !this.hasPagination
        ? items
        : items.slice(this.pageStart, this.pageStop)
    }
  },
  props: {
    expand: {
      type: Boolean
    },
    headers: {
      type: Array,
      default: () => []
    },
    headerText: {
      type: String,
      default: 'text'
    },
    hideActions: Boolean,
    hideHeaders: Boolean,
    mustSort: Boolean,
    noResultsText: {
      type: String,
      default: 'No matching records found'
    },
    rowsPerPageItems: {
      type: Array,
      default () {
        return [
          5,
          10,
          25,
          {text: 'All', value: 0}
        ]
      }
    },
    rowsPerPageText: {
      type: String,
      default: 'Rows per page:'
    },
    selectAll: [Boolean, String],
    search: {
      required: false
    },
    filter: {
      type: Function,
      default: (val, search) => {
        return val !== null &&
          ['undefined', 'boolean'].indexOf(typeof val) === -1 &&
          val.toString().toLowerCase().indexOf(search) !== -1
      }
    },
    customFilter: {
      type: Function,
      default: (items, search, filter) => {
        search = search.toString().toLowerCase()
        return items.filter(i => (
          Object.keys(i).some(j => filter(i[j], search))
        ))
      }
    },
    customSort: {
      type: Function,
      default: (items, index, isDescending) => {
        if (index === null) return items

        return items.sort((a, b) => {
          let sortA = getObjectValueByPath(a, index)
          let sortB = getObjectValueByPath(b, index)

          if (isDescending) {
            [sortA, sortB] = [sortB, sortA]
          }

          if (!isNaN(sortA) && !isNaN(sortB)) {
            return sortA - sortB
          }

          if (sortA === null && sortB === null) {
            return 0
          }

          [sortA, sortB] = [sortA, sortB]
            .map(s => (
              (s || '').toString().toLocaleLowerCase()
            ))

          if (sortA > sortB) return 1
          if (sortA < sortB) return -1

          return 0
        })
      }
    },
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    totalItems: {
      type: Number,
      default: null
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    pagination: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    indeterminate (val) {
      if (val) this.all = true
    },
    someItems (val) {
      if (!val) this.all = false
    },
    search () {
      this.updatePagination({page: 1, totalItems: this.itemsLength})
    },
    everyItem (val) {
      if (val) this.all = true
    }
  }
}
