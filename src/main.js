// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VuetifyConfirm from 'vuetify-confirm'
Vue.use(Vuetify)

Vue.use(VuetifyConfirm, {
    buttonTrueText: 'ตกลง',
    buttonFalseText: 'ยกเลิก',
    color: 'warning',
    icon: 'warning',
    title: 'คำเตือน',
    width: 300,
    property: '$confirm'
  })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})