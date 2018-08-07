<template>
  <div id="app">
<v-app>
  <Toolbars/>
  <router-view/>
  <AppFooter/>
</v-app> 
  </div>
</template>
<style lang="stylus">
  $color-pack = false
  @import '~vuetify/src/stylus/main'
</style>

<script>
import { mapState,mapMutations } from 'vuex'
import { store } from './vuex/store/store'
import Toolbars from '@/components/Toolbars'
import AppFooter from '@/components/AppFooter'
export default {
  store,
  name: 'App',
  data(){
    return{}
  },
  computed:{
    ...mapState([
      'authKey'
    ])
  }
  ,
  methods:{
    ...mapMutations([
      'SET_AUTHKEY'

    ])
  },
  components:{
    Toolbars,
    AppFooter
  },
  beforeMount(){
      if(this.$localStorage.get('authKey')!=''){
          this.SET_AUTHKEY(this.$localStorage.get('authKey'))
      }
  }
}
</script>
<style>
#app {
  font-family: 'Kanit', sans-serif;
}
</style>
