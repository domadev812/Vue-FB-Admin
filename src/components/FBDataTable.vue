<template>
    <table :class="['table', css.tableClass]">
      <thead>
      <tr>
        <template v-for="field in tableFields">
          <template v-if="field.visible">
            <template v-if="isSpecialField(field.name)">
              <th v-if="extractName(field.name) == '__checkbox'"
                  :class="['fbdatatable-th-checkbox-'+trackBy, field.titleClass]">
                <input type="checkbox" @change="toggleAllCheckboxes(field.name, $event)"
                       :checked="checkCheckboxesState(field.name)">
              </th>
              <th v-if="extractName(field.name) == '__component'"
                  @click="orderBy(field, $event)"
                  :class="['fbdatatable-th-component-'+trackBy, field.titleClass, {'sortable': isSortable(field)}]"
                  v-html="renderTitle(field)"
              ></th>
              <th v-if="extractName(field.name) == '__slot'"
                  @click="orderBy(field, $event)"
                  :class="['fbdatatable-th-slot-'+extractArgs(field.name), field.titleClass, {'sortable': isSortable(field)}]"
                  v-html="renderTitle(field)"
              ></th>
              <th v-if="extractName(field.name) == '__sequence'"
                  :class="['fbdatatable-th-sequence', field.titleClass || '']" v-html="renderTitle(field)">
              </th>
              <th v-if="notIn(extractName(field.name), ['__sequence', '__checkbox', '__component', '__slot'])"
                  :class="['fbdatatable-th-'+field.name, field.titleClass || '']" v-html="renderTitle(field)">
              </th>
            </template>
            <template v-else>
              <th @click="orderBy(field, $event)"
                  :id="'_' + field.name"
                  :class="['fbdatatable-th-'+field.name, field.titleClass,  {'sortable': isSortable(field)}]"
                  v-html="renderTitle(field)"
              ></th>
            </template>
          </template>
        </template>
      </tr>
      </thead>
      <tbody class="fbdatatable-body">
      <template v-for="(item, index) in tableData">
        <tr @dblclick="onRowDoubleClicked(item, $event)" :item-index="index" @click="onRowClicked(item, $event)"
            :render="onRowChanged(item)" :class="onRowClass(item, index)">
          <template v-for="field in tableFields">
            <template v-if="field.visible">
              <template v-if="isSpecialField(field.name)">
                <td v-if="extractName(field.name) == '__sequence'" :class="['fbdatatable-sequence', field.dataClass]"
                    v-html="renderSequence(index)">
                </td>
                <td v-if="extractName(field.name) == '__handle'" :class="['fbdatatable-handle', field.dataClass]"
                    v-html="renderIconTag(['handle-icon', css.handleIcon])"
                ></td>
                <td v-if="extractName(field.name) == '__checkbox'" :class="['fbdatatable-checkboxes', field.dataClass]">
                  <input type="checkbox"
                         @change="toggleCheckbox(item, field.name, $event)"
                         :checked="rowSelected(item, field.name)">
                </td>
                <td v-if="extractName(field.name) === '__component'"
                    :class="['fbdatatable-component', field.dataClass]">
                  <component :is="extractArgs(field.name)"
                             :row-data="item" :row-index="index" :row-field="field.sortField"
                  ></component>
                </td>
                <td v-if="extractName(field.name) === '__slot'" :class="['fbdatatable-slot', field.dataClass]">
                  <slot :name="extractArgs(field.name)"
                        :row-data="item" :row-index="index" :row-field="field.sortField"
                  ></slot>
                </td>
              </template>
              <template v-else>
                <td v-if="hasCallback(field)" :class="field.dataClass"
                    @click="onCellClicked(item, field, $event)"
                    @dblclick="onCellDoubleClicked(item, field, $event)"
                    v-html="callCallback(field, item)"
                >
                </td>
                <td v-else :class="field.dataClass"
                    @click="onCellClicked(item, field, $event)"
                    @dblclick="onCellDoubleClicked(item, field, $event)"
                    v-html="getObjectValue(item, field.name, '')"
                >
                </td>
              </template>
            </template>
          </template>
        </tr>
        <template v-if="useDetailRow">
          <tr v-if="isVisibleDetailRow(item[trackBy])"
              @click="onDetailRowClick(item, $event)"
              :class="[css.detailRowClass]"
          >
            <transition :name="detailRowTransition">
              <td :colspan="countVisibleFields">
                <component :is="detailRowComponent" :row-data="item" :row-index="index"></component>
              </td>
            </transition>
          </tr>
        </template>
      </template>
      <template v-if="displayEmptyDataRow">
        <tr>
          <td :colspan="countVisibleFields" class="fbdatatable-empty-result">{{noDataTemplate}}</td>
        </tr>
      </template>
      <template v-if="lessThanMinRows">
        <tr v-for="i in blankRows" class="blank-row">
          <template v-for="field in tableFields">
            <td v-if="field.visible">&nbsp;</td>
          </template>
        </tr>
      </template>
      </tbody>
    </table>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'FBDataTable',
    props: {
      methodName: {
        type: String,
        required: true
      },
      query: {
        type: String,
        default: '',
        required: false
      },
      refreshTable: {
        type: Boolean,
        default: false,
        required: false
      },
      tcmType: {
        type: String,
        default: '',
        require: false
      },
      methodParams: {
        type: String,
        required: false
      },
      fields: {
        type: Array,
        required: true
      },
      loadOnStart: {
        type: Boolean,
        default: true
      },
      apiUrl: {
        type: String,
        default: ''
      },
      httpMethod: {
        type: String,
        default: 'get',
        validator: (value) => {
          return ['get', 'post'].indexOf(value) > -1
        }
      },
      reactiveApiUrl: {
        type: Boolean,
        default: true
      },
      apiMode: {
        type: Boolean,
        default: true
      },
      data: {
        type: [Array, Object],
        default () {
          return null
        }
      },
      dataTotal: {
        type: Number,
        default: 0
      },
      dataManager: {
        type: Function,
        default () {
          return null
        }
      },
      dataPath: {
        type: String,
        default: 'data'
      },
      paginationPath: {
        type: [String],
        default: 'pagination'
      },
      queryParams: {
        type: Object,
        default () {
          return {
            sort: 'sort',
            page: 'page',
            perPage: 'per-page'
          }
        }
      },
      appendParams: {
        type: Object,
        default () {
          return {}
        }
      },
      httpOptions: {
        type: Object,
        default () {
          return {}
        }
      },
      perPage: {
        type: Number,
        default () {
          return 10
        }
      },
      sortOrder: {
        type: Array,
        default () {
          return []
        }
      },
      multiSort: {
        type: Boolean,
        default () {
          return false
        }
      },
      multiSortKey: {
        type: String,
        default: 'alt'
      },
      rowClassCallback: {
        type: [String, Function],
        default: ''
      },
      rowClass: {
        type: [String, Function],
        default: ''
      },
      detailRowComponent: {
        type: String,
        default: ''
      },
      detailRowTransition: {
        type: String,
        default: ''
      },
      trackBy: {
        type: String,
        default: 'id'
      },
      css: {
        type: Object,
        default () {
          return {
            tableClass: 'ui blue selectable celled stackable attached table',
            loadingClass: 'loading',
            ascendingIcon: 'blue chevron up icon',
            descendingIcon: 'blue chevron down icon',
            detailRowClass: 'fbdatatable-detail-row',
            handleIcon: 'grey sidebar icon'
          }
        }
      },
      minRows: {
        type: Number,
        default: 0
      },
      silent: {
        type: Boolean,
        default: false
      },
      noDataTemplate: {
        type: String,
        default () {
          return 'No Data Available'
        }
      }
    },
    data () {
      return {
        eventPrefix: 'fbdatatable:',
        tableFields: [],
        tableData: null,
        tablePagination: null,
        currentPage: 1,
        selectedTo: [],
        visibleDetailRows: [],
      }
    },
    mounted () {
      this.normalizeFields()
      this.normalizeSortOrder()
      this.$nextTick(function () {
        this.fireEvent('initialized', this.tableFields)
      })
      if (this.loadOnStart) {
        this.loadData()
      }
    },
    computed: {
      ...mapGetters({
        activeTab: 'getActiveTab'
      }),
      useDetailRow () {
        if (this.tableData && this.tableData[0] && this.detailRowComponent !== '' && typeof this.tableData[0][this.trackBy] === 'undefined') {
          this.warn('You need to define unique row identifier in order for detail-row feature to work. Use `track-by` prop to define one!')
          return false
        }
        return this.detailRowComponent !== ''
      },
      countVisibleFields () {
        return this.tableFields.filter(function (field) {
          return field.visible
        }).length
      },
      countTableData () {
        if (this.tableData === null) {
          return 0
        }
        return this.tableData.length
      },
      displayEmptyDataRow () {
        return this.countTableData === 0 && this.noDataTemplate.length > 0
      },
      lessThanMinRows () {
        if (this.tableData === null || this.tableData.length === 0) {
          return true
        }
        return this.tableData.length < this.minRows
      },
      blankRows () {
        if (this.tableData === null || this.tableData.length === 0) {
          return this.minRows
        }
        if (this.tableData.length >= this.minRows) {
          return 0
        }
        return this.minRows - this.tableData.length
      },
      isApiMode () {
        return this.apiMode
      },
      isDataMode () {
        return !this.apiMode
      }
    },
    methods: {
      normalizeFields () {
        if (typeof(this.fields) === 'undefined') {
          this.warn('You need to provide "fields" prop.')
          return
        }
        this.tableFields = []
        let self = this
        let obj
        this.fields.forEach(function (field, i) {
          if (typeof (field) === 'string') {
            obj = {
              name: field,
              title: self.setTitle(field),
              titleClass: '',
              dataClass: '',
              callback: null,
              visible: true,
            }
          } else {
            obj = {
              name: field.name,
              title: (field.title === undefined) ? self.setTitle(field.name) : field.title,
              sortField: field.sortField,
              titleClass: (field.titleClass === undefined) ? '' : field.titleClass,
              dataClass: (field.dataClass === undefined) ? '' : field.dataClass,
              callback: (field.callback === undefined) ? '' : field.callback,
              visible: (field.visible === undefined) ? true : field.visible,
            }
          }
          self.tableFields.push(obj)
        })
      },
      setData (data) {
        this.apiMode = false
        if (Array.isArray(data)) {
          this.tableData = data
          return
        }
        this.fireEvent('loading')
        this.tableData = this.getObjectValue(data, this.dataPath, null)
        this.tablePagination = this.getObjectValue(data, this.paginationPath, null)
        this.$nextTick(function () {
          this.fireEvent('pagination-data', this.tablePagination)
          this.fireEvent('loaded')
        })
      },
      setTitle (str) {
        if (this.isSpecialField(str)) {
          return ''
        }
        return this.titleCase(str)
      },
      renderTitle (field) {
        let title = (typeof field.title === 'undefined') ? field.name.replace('.', ' ') : field.title
        if (title.length > 0 && this.isInCurrentSortGroup(field)) {
          let style = `opacity:${this.sortIconOpacity(field)};position:relative;float:right`
          return title + ' ' + this.renderIconTag(['sort-icon', this.sortIcon(field)], `style="${style}"`)
        }
        return title
      },
      renderSequence (index) {
        return this.tablePagination
          ? this.tablePagination.from + index
          : index
      },
      isSpecialField (fieldName) {
        return fieldName.slice(0, 2) === '__'
      },
      titleCase (str) {
        return str.replace(/\w+/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        })
      },
      camelCase (str, delimiter = '_') {
        let self = this
        return str.split(delimiter).map(function (item) {
          return self.titleCase(item)
        }).join('')
      },
      notIn (str, arr) {
        return arr.indexOf(str) === -1
      },
      loadData (success = this.loadSuccess, failed = this.loadFailed) {
        if (this.isDataMode) {
          this.callDataManager()
          return
        }
        this.fireEvent('loading')
        this.httpOptions['params'] = this.getAllQueryParams()
        let items = []
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch(this.methodName, {
          id: this.methodParams,
          page: this.getAllQueryParams().page,
          query: this.query,
          type: this.activeTab,
          'per-page': this.getAllQueryParams()['per-page']
        })
          .then((response) => {
            if (this.getAllQueryParams()['sort'] !== '') {
              let items = this.$lodash.cloneDeep(response)
              let filter = this.getAllQueryParams()['sort'].split('|')
              items['items'] = this.$lodash.orderBy(items['items'], [filter[0]], [filter[1]])
              this.loadSuccess(items)
            } else {
              this.loadSuccess(response)
            }
          })
          .catch((error) => {
            this.loadFailed(error)
          })
      },
      loadSuccess (response) {
        this.$store.dispatch('setLoadingBar', 'none')
        this.fireEvent('load-success', response)
        let body = this.transform(response)
        this.tableData = this.getObjectValue(body, this.dataPath, null)
        this.tablePagination = this.getObjectValue(body, this.paginationPath, null)
        if (this.tablePagination === null) {
          this.warn('fbdatatable: pagination-path "' + this.paginationPath + '" not found. '
            + 'It looks like the data returned from the sever does not have pagination information '
            + 'or you may have set it incorrectly.\n'
            + 'You can explicitly suppress this warning by setting pagination-path="".'
          )
        }
        this.$nextTick(function () {
          this.fireEvent('pagination-data', this.tablePagination)
          this.fireEvent('loaded')
        })
      },
      loadFailed (response) {
        console.error('load-error', response)
        this.$store.dispatch('setLoadingBar', 'none')
        this.fireEvent('load-error', response)
        this.fireEvent('loaded')
      },
      transform (data) {
        let func = 'transform'
        if (this.parentFunctionExists(func)) {
          return this.$parent[func].call(this.$parent, data)
        }
        return data
      },
      parentFunctionExists (func) {
        return (func !== '' && typeof this.$parent[func] === 'function')
      },
      callParentFunction (func, args, defaultValue = null) {
        if (this.parentFunctionExists(func)) {
          return this.$parent[func].call(this.$parent, args)
        }
        return defaultValue
      },
      fireEvent (eventName, args) {
        this.$emit(this.eventPrefix + eventName, args)
      },
      warn (msg) {
        if (!this.silent) {
          console.warn(msg)
        }
      },
      getAllQueryParams () {
        let params = {}
        params[this.queryParams.sort] = this.getSortParam()
        params[this.queryParams.page] = this.currentPage
        params[this.queryParams.perPage] = this.perPage
        for (let x in this.appendParams) {
          params[x] = this.appendParams[x]
        }
        return params
      },
      getSortParam () {
        if (!this.sortOrder || this.sortOrder.field == '') {
          return ''
        }
        if (typeof this.$parent['getSortParam'] == 'function') {
          return this.$parent['getSortParam'].call(this.$parent, this.sortOrder)
        }
        return this.getDefaultSortParam()
      },
      getDefaultSortParam () {
        let result = ''
        for (let i = 0; i < this.sortOrder.length; i++) {
          let fieldName = (typeof this.sortOrder[i].sortField === 'undefined')
            ? this.sortOrder[i].field
            : this.sortOrder[i].sortField
          result += fieldName + '|' + this.sortOrder[i].direction + ((i + 1) < this.sortOrder.length ? ',' : '')
        }
        return result
      },
      extractName (string) {
        return string.split(':')[0].trim()
      },
      extractArgs (string) {
        return string.split(':')[1]
      },
      isSortable (field) {
        return !(typeof field.sortField === 'undefined')
      },
      isInCurrentSortGroup (field) {
        return this.currentSortOrderPosition(field) !== false
      },
      currentSortOrderPosition (field) {
        if (!this.isSortable(field)) {
          return false
        }
        for (let i = 0; i < this.sortOrder.length; i++) {
          if (this.fieldIsInSortOrderPosition(field, i)) {
            return i
          }
        }
        return false
      },
      fieldIsInSortOrderPosition (field, i) {
        return this.sortOrder[i].field === field.name && this.sortOrder[i].sortField === field.sortField
      },
      orderBy (field, event) {
        if (!this.isSortable(field)) return
        let key = this.multiSortKey.toLowerCase() + 'Key'
        if (this.multiSort && event[key]) {
          this.multiColumnSort(field)
        } else {
          this.singleColumnSort(field)
        }
        this.currentPage = 1
        this.loadData()
      },
      multiColumnSort (field) {
        let i = this.currentSortOrderPosition(field)
        if (i === false) {
          this.sortOrder.push({
            field: field.name,
            sortField: field.sortField,
            direction: 'asc'
          })
        } else {
          if (this.sortOrder[i].direction === 'asc') {
            this.sortOrder[i].direction = 'desc'
          } else {
            this.sortOrder.splice(i, 1)
          }
        }
      },
      singleColumnSort (field) {
        if (this.sortOrder.length === 0) {
          this.clearSortOrder()
        }
        this.sortOrder.splice(1)
        if (this.fieldIsInSortOrderPosition(field, 0)) {
          this.sortOrder[0].direction = this.sortOrder[0].direction === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortOrder[0].direction = 'asc'
        }
        this.sortOrder[0].field = field.name
        this.sortOrder[0].sortField = field.sortField
      },
      clearSortOrder () {
        this.sortOrder.push({
          field: '',
          sortField: '',
          direction: 'asc'
        })
      },
      sortIcon (field) {
        let cls = ''
        let i = this.currentSortOrderPosition(field)
        if (i !== false) {
          cls = (this.sortOrder[i].direction == 'asc') ? this.css.ascendingIcon : this.css.descendingIcon
        }
        return cls
      },
      sortIconOpacity (field) {
        let max = 1.0,
          min = 0.3,
          step = 0.3
        let count = this.sortOrder.length
        let current = this.currentSortOrderPosition(field)
        if (max - count * step < min) {
          step = (max - min) / (count - 1)
        }
        let opacity = max - current * step
        return opacity
      },
      hasCallback (item) {
        return item.callback ? true : false
      },
      callCallback (field, item) {
        if (!this.hasCallback(field)) return
        if (typeof(field.callback) == 'function') {
          return field.callback(this.getObjectValue(item, field.name))
        }
        let args = field.callback.split('|')
        let func = args.shift()
        if (typeof this.$parent[func] === 'function') {
          let value = this.getObjectValue(item, field.name)
          return (args.length > 0)
            ? this.$parent[func].apply(this.$parent, [value].concat(args))
            : this.$parent[func].call(this.$parent, value)
        }
        return null
      },
      getObjectValue (object, path, defaultValue) {
        defaultValue = (typeof defaultValue === 'undefined') ? null : defaultValue
        let obj = object
        if ((path.trim() != '') && (path.split('|').length <= 1)) {
          let keys = path.split('.')
          keys.forEach(function (key) {
            if (obj !== null && typeof obj[key] !== 'undefined' && obj[key] !== null) {
              obj = obj[key]
            } else {
              obj = defaultValue
              return
            }
          })
        }
        return obj
      },
      toggleCheckbox (dataItem, fieldName, event) {
        let isChecked = event.target.checked
        let idColumn = this.trackBy
        if (dataItem[idColumn] === undefined) {
          this.warn('__checkbox field: The "' + this.trackBy + '" field does not exist! Make sure the field you specify in "track-by" prop does exist.')
          return
        }
        let key = dataItem[idColumn]
        if (isChecked) {
          this.selectId(key)
        } else {
          this.unselectId(key)
        }
        this.$emit('fbdatatable:checkbox-toggled', isChecked, dataItem)
      },
      selectId (key) {
        if (!this.isSelectedRow(key)) {
          this.selectedTo.push(key)
        }
      },
      unselectId (key) {
        this.selectedTo = this.selectedTo.filter(function (item) {
          return item !== key
        })
      },
      isSelectedRow (key) {
        return this.selectedTo.indexOf(key) >= 0
      },
      rowSelected (dataItem, fieldName) {
        let idColumn = this.trackBy
        let key = dataItem[idColumn]
        return this.isSelectedRow(key)
      },
      checkCheckboxesState (fieldName) {
        if (!this.tableData) return
        let self = this
        let idColumn = this.trackBy
        let selector = 'th.fbdatatable-th-checkbox-' + idColumn + ' input[type=checkbox]'
        let els = document.querySelectorAll(selector)
        if (els.forEach === undefined)
          els.forEach = function (cb) {
            [].forEach.call(els, cb)
          }
        let selected = this.tableData.filter(function (item) {
          return self.selectedTo.indexOf(item[idColumn]) >= 0
        })
        if (selected.length <= 0) {
          els.forEach(function (el) {
            el.indeterminate = false
          })
          return false
        }
        else if (selected.length < this.perPage) {
          els.forEach(function (el) {
            el.indeterminate = true
          })
          return true
        }
        else {
          els.forEach(function (el) {
            el.indeterminate = false
          })
          return true
        }
      },
      toggleAllCheckboxes (fieldName, event) {
        let self = this
        let isChecked = event.target.checked
        let idColumn = this.trackBy
        if (isChecked) {
          this.tableData.forEach(function (dataItem) {
            self.selectId(dataItem[idColumn])
          })
        } else {
          this.tableData.forEach(function (dataItem) {
            self.unselectId(dataItem[idColumn])
          })
        }
        this.$emit('fbdatatable:checkbox-toggled-all', isChecked)
      },
      gotoPreviousPage () {
        if (this.currentPage > 1) {
          this.currentPage--
          this.loadData()
        }
      },
      gotoNextPage () {
        if (this.currentPage < this.tablePagination.last_page) {
          this.currentPage++
          this.loadData()
        }
      },
      gotoPage (page) {
        if ((page != this.currentPage) && (page > 0 && page <= this.tablePagination.last_page)) {
          this.currentPage = page
          this.loadData()
        }
      },
      isVisibleDetailRow (rowId) {
        return this.visibleDetailRows.indexOf(rowId) >= 0
      },
      showDetailRow (rowId) {
        if (!this.isVisibleDetailRow(rowId)) {
          this.visibleDetailRows.push(rowId)
        }
      },
      hideDetailRow (rowId) {
        if (this.isVisibleDetailRow(rowId)) {
          this.visibleDetailRows.splice(
            this.visibleDetailRows.indexOf(rowId),
            1
          )
        }
      },
      toggleDetailRow (rowId) {
        if (this.isVisibleDetailRow(rowId)) {
          this.hideDetailRow(rowId)
        } else {
          this.showDetailRow(rowId)
        }
      },
      showField (index) {
        if (index < 0 || index > this.tableFields.length) return
        this.tableFields[index].visible = true
      },
      hideField (index) {
        if (index < 0 || index > this.tableFields.length) return
        this.tableFields[index].visible = false
      },
      toggleField (index) {
        if (index < 0 || index > this.tableFields.length) return
        this.tableFields[index].visible = !this.tableFields[index].visible
      },
      renderIconTag (classes, options = '') {
        return typeof(this.css.renderIcon) === 'undefined'
          ? `<i class="${classes.join(' ')}" ${options}></i>`
          : this.css.renderIcon(classes, options)
      },
      makePagination (total = null, perPage = null, currentPage = null) {
        total = total === null ? this.dataTotal : total
        perPage = perPage === null ? this.perPage : perPage
        currentPage = currentPage === null ? this.currentPage : currentPage
        return {
          'total': total,
          'per_page': perPage,
          'current_page': currentPage,
          'last_page': Math.ceil(total / perPage) || 0,
          'next_page_url': '',
          'prev_page_url': '',
          'from': (currentPage - 1) * perPage + 1,
          'to': Math.min(currentPage * perPage, total)
        }
      },
      normalizeSortOrder () {
        this.sortOrder.forEach(function (item) {
          item.sortField = item.sortField || item.field
        })
      },
      callDataManager () {
        if (this.dataManager === null && this.data === null) return
        if (Array.isArray(this.data)) {
          console.log('data mode: array')
          this.setData(this.data)
        } else {
          this.normalizeSortOrder()
          this.setData(this.dataManager(this.sortOrder, this.makePagination()))
        }
      },
      onRowClass (dataItem, index) {
        if (this.rowClassCallback !== '') {
          this.warn('"row-class-callback" prop is deprecated, please use "row-class" prop instead.')
          return
        }
        if (typeof (this.rowClass) === 'function') {
          return this.rowClass(dataItem, index)
        }
        return this.rowClass
      },
      onRowChanged (dataItem) {
        this.fireEvent('row-changed', dataItem)
        return true
      },
      onRowClicked (dataItem, event) {
        this.$emit(this.eventPrefix + 'row-clicked', dataItem, event)
        return true
      },
      onRowDoubleClicked (dataItem, event) {
        this.$emit(this.eventPrefix + 'row-dblclicked', dataItem, event)
      },
      onDetailRowClick (dataItem, event) {
        this.$emit(this.eventPrefix + 'detail-row-clicked', dataItem, event)
      },
      onCellClicked (dataItem, field, event) {
        this.$emit(this.eventPrefix + 'cell-clicked', dataItem, field, event)
      },
      onCellDoubleClicked (dataItem, field, event) {
        this.$emit(this.eventPrefix + 'cell-dblclicked', dataItem, field, event)
      },
      changePage (page) {
        if (page === 'prev') {
          this.gotoPreviousPage()
        } else if (page === 'next') {
          this.gotoNextPage()
        } else {
          this.gotoPage(page)
        }
      },
      reload () {
        this.loadData()
      },
      refresh () {
        this.currentPage = 1
        this.loadData()
      },
      resetData () {
        this.tableData = null
        this.tablePagination = null
        this.fireEvent('data-reset')
      }
    },
    watch: {
      'multiSort' (newVal, oldVal) {
        if (newVal === false && this.sortOrder.length > 1) {
          this.sortOrder.splice(1)
          this.loadData()
        }
      },
      'apiUrl' (newVal, oldVal) {
        if (this.reactiveApiUrl && newVal !== oldVal) this.refresh()
      },
      'query' (newVal, oldVal) {
        this.loadData()
      },
      'refreshTable' (newVal, oldVal) {
        if(newVal === true) this.loadData()
      }      
    }
  }
</script>
