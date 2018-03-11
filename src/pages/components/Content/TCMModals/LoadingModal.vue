<template>
  <div class="modal fade" id="loadingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100; opacity:1.0" v-bind:style="{display: loading}">
  <!-- <div class="modal fade" id="loadingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100; opacity:1.0; display:block"> -->
    <div class="modal-dialog" role="document">      
        <div class="loading text-muted" style="text-align:center; margin-top:60%">
            <div class="spinner"></div>
            {{loadingText}}
        </div>     
    </div>
  </div>
</template>
<style>
  .spinner {
    width: 40px;
    height: 40px;
    margin: 10px auto;
    background-color: #333;
    border-radius: 100%;
    -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
    animation: sk-scaleout 1.0s infinite ease-in-out;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'LoadingModal',
    created () {
    },
    computed: {
      ...mapGetters({
        loading: 'getLoadingBar',
        loadingText: 'getLoadingBarText'
      })
    }
  }
</script>
