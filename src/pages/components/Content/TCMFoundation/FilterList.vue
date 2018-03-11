<template>
    <div class="col-md-3">
        <div class="box box-solid">    
            <div class="box-body no-padding">    
                <ul class="nav nav-pills nav-stacked nav-tabs">
                    <li class = "active"><a @click="chooseTcmFilter('herbology')" data-toggle="tab">Herbology</a></li>
                    <li><a @click="chooseTcmFilter('general')" data-toggle="tab">General TCM</a></li>
                    <li><a @click="chooseTcmFilter('diagnosis')" data-toggle="tab" >Diagnosis</a></li>
                    <li><a @click="chooseTcmFilter('categories')" data-toggle="tab">Categories</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'FilterList',
    data () {
      return {
      }
    },
    components: {
    },
    methods: {
      chooseTcmFilter (listItem) {
        this.$store.dispatch('chooseTcmFilter', listItem)
        if (listItem === 'herbology') {
          this.$store.dispatch('switchTab', 'flavours')
          this.$store.dispatch('setTabName', 'Flavour')
        } else if (listItem === 'general') {
          this.$store.dispatch('switchTab', 'channels')
          this.$store.dispatch('setTabName', 'Channels')
        } else if (listItem === 'diagnosis') {
          this.$store.dispatch('switchTab', 'element')
          this.$store.dispatch('setTabName', '5 Element 五行')
        } else if (listItem === 'categories') {
          this.$store.dispatch('switchTab', 'formula')
          this.$store.dispatch('setTabName', 'Formulas')
        }
        this.$store.dispatch('setTcmTabType', 0)
      }
    }
  }
</script>