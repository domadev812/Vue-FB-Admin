<template>
  <div>
    <section class="content-header">
      <h1>Formulas</h1>
    </section>
    <section class="view-content-wrapper">
      <div class="row">
        <div class="col-md-3">
          <div class="box box-widget widget-user-2">
            <div class="widget-user-header bg-blue">
              <h3>{{ formula.name }}</h3>
              <h4>{{ formula.latin_name }}</h4>
              <h5>{{ formula.traditional_chinese }}</h5>
              <h6>({{ formula.simplified_chinese }})</h6>
              <h4>{{ formula.pinyin_ton }}</h4>
            </div>
            <div class="box-body">
              <div class="description" v-if="formula.createdBy"><b>Created by</b> <a class="pull-right"><span class="badge bg-aqua">{{ formula.createdBy.firstname }} {{ formula.createdBy.lastname }}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{formula.created_time}}</p></div>
              <hr>
              <div class="description" v-if="formula.modifiedBy"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{ formula.modifiedBy.firstname }} {{ formula.modifiedBy.lastname }}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{formula.modified_time}}</p></div>
            </div>
            <!--div class="box-footer"><a href="#" class="text-muted"><i class="fa fa-edit"></i> Edit</a></div!-->
          </div>
        </div>
        <div class="col-md-9">
          <FormulaTabController></FormulaTabController>
        </div>
      </div>
    </section>    
  </div>
</template>
<style scoped>
  .view-content-wrapper {
    padding: 20px;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  const FormulaTabController = () => import(/* webpackChunkName: "Content" */ './FormulaTabController.vue')
  export default {
    name: 'FormulaView',
    created () {
      this.fetchFormula()
    },
    computed: {
      ...mapGetters({
        formula: 'getFormula',
        modalType: 'getModalType'
      })
    },
    watch: {
      modalType: {
        handler () {
          if (this.modalType === 4) {
            // this.fetchFormula()
          }
        }
      }
    },
    methods: {
      fetchFormula: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchFormula', { id: this.$route.params.id })
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$swal(
              'Error!',
              error.message,
              'error'
            ).then((result) => {
              this.$router.go(-1)
            })
          }
        )
      }
    },
    components: {
      FormulaTabController
    }
  }
</script>
