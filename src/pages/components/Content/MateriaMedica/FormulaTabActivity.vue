<template>
  <div class="tab-pane" id="activity">
    <!-- Activity -->
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
        <tr>
          <th width="30"></th>
          <th>Action</th>
          <th>Author</th>
          <th>Date</th>
        </tr>
        </thead>
        <tbody v-if="activity && activity.length > 0">
        <tr v-for="(item,key) in activity" :key="key">
          <td>
            <i class="fa text-muted" :class="{
                'fa-pencil': (item.action === 'edit' || item.action === 'update'),
                'fa-plus-circle': item.action === 'create',
                'fa-trash': item.action === 'delete'
            }"></i>
          </td>
          <td>
            Formula updated
          </td>
          <td>
            <router-link v-if="item.username" :to="{ name: 'User', params: { id: item.created_by }}">{{item.username}}</router-link>
          </td>
          <td>
            <div class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">
              {{item.relative_time}}
            </div>
          </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
          <td></td>
          <td colspan="3">
            No activity
          </td>
        </tr>
        </tbody>
      </table>
      <div class="box-footer clearfix" v-if="activity.pageCount > 1">
        <ul class="pagination pagination-sm no-margin pull-right">
          <li><a href="#">«</a></li>
          <li><a href="#">1</a></li>
          <li><a href="#">2</a></li>
          <li><a href="#">3</a></li>
          <li><a href="#">»</a></li>
        </ul>
      </div>
    </div>
    <!-- /.table-responsive -->
    <!-- /.post -->
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'FormulaTabActivity',
    created () {
      this.$store.dispatch('fetchFormulaActivity', { id: this.$route.params.id })
    },
    computed: {
      ...mapGetters({
        formula: 'getFormula',
        activity: 'getFormulaActivity'
      })
    }
  }
</script>
