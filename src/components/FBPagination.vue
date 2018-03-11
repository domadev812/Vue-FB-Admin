<template>
  <ul v-show="tablePagination && tablePagination.last_page > 1" :class="css.wrapperClass">
    <li>
      <a @click="loadPage(1)"
         :class="['btn-nav', css.linkClass, isOnFirstPage ? css.disabledClass : '']">
        <i v-if="css.icons.first != ''" :class="[css.icons.first]"></i>
        <span v-else>&laquo;</span>
      </a>
    </li>
    <li>
      <a @click="loadPage('prev')"
         :class="['btn-nav', css.linkClass, isOnFirstPage ? css.disabledClass : '']">
        <i v-if="css.icons.next != ''" :class="[css.icons.prev]"></i>
        <span v-else>&nbsp;&lsaquo;</span>
      </a>
    </li>
    <template v-if="notEnoughPages">
      <template v-for="n in totalPage">
        <li>
          <a @click="loadPage(n)"
             :class="[css.pageClass, isCurrentPage(n) ? css.activeClass : '']"
             v-html="n">
          </a>
        </li>
      </template>
    </template>
    <template v-else>
      <template v-for="n in windowSize">
        <li>
          <a @click="loadPage(windowStart+n-1)"
             :class="[css.pageClass, isCurrentPage(windowStart+n-1) ? css.activeClass : '']"
             v-html="windowStart+n-1">
          </a>
        </li>
      </template>
    </template>
    <li>
      <a @click="loadPage('next')"
         :class="['btn-nav', css.linkClass, isOnLastPage ? css.disabledClass : '']">
        <i v-if="css.icons.next != ''" :class="[css.icons.next]"></i>
        <span v-else>&rsaquo;&nbsp;</span>
      </a>
    </li>
    <li>
      <a @click="loadPage(totalPage)"
         :class="['btn-nav', css.linkClass, isOnLastPage ? css.disabledClass : '']">
        <i v-if="css.icons.last != ''" :class="[css.icons.last]"></i>
        <span v-else>&raquo;</span>
      </a>
    </li>
  </ul>
</template>

<script>
  import PaginationMixin from '../mixins/FBTablePaginationMixins'

  export default {
    name: 'FBPagination',
    mixins: [PaginationMixin]
  }
</script>
