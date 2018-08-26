<template>
    <v-toolbar color="teal" dark fixed>
    <v-toolbar-title class="white--text">MiniPOS</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down" v-if="authKey=='' || authKey==null">
      <v-btn flat to="/login">{{ allMenu[0].loginMenu }}</v-btn>
    </v-toolbar-items>
    <v-toolbar-items class="hidden-sm-and-down" v-else>
      <v-btn flat to="/users">{{ allMenu[0].userManagerMenu }}</v-btn>
      <v-btn flat to="/companies">{{ allMenu[0].companyManagerMenu  }}</v-btn>
      <v-btn flat to="/addCategory">{{ allMenu[0].categoryManagerMenu  }}</v-btn>
      <v-btn flat to="/products">{{ allMenu[0].productManagerMenu  }}</v-btn>
      <v-btn flat>{{ allMenu[0].lowstockManagerMenu  }}</v-btn>
      <v-btn flat>{{ allMenu[0].invoiceManagerMenu  }}</v-btn>
      <v-btn flat>{{ allMenu[0].reportManagerMenu  }}</v-btn>
      <v-btn flat @click="logOut()">{{ allMenu[0].logoutMenu  }}</v-btn>
    </v-toolbar-items>
          <v-menu bottom left class="hidden-md-and-up">
            <v-btn
              slot="activator"
              dark
              icon
            >
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile>
                <router-link to="/users" class="toolbarsMobileLink">{{ allMenu[0].userManagerMenu }}</router-link>
              </v-list-tile>
              <v-list-tile>
                <router-link to="/companies" class="toolbarsMobileLink">{{ allMenu[0].companyManagerMenu}}</router-link>
              </v-list-tile>
              <v-list-tile>
                <router-link to="/addCategory" class="toolbarsMobileLink">{{ allMenu[0].categoryManagerMenu }}</router-link>
              </v-list-tile>
              <v-list-tile>
                <router-link  to="/products" class="toolbarsMobileLink">{{ allMenu[0].productManagerMenu }}</router-link>
              </v-list-tile>
              <v-list-tile>
                <router-link  to="/" class="toolbarsMobileLink">{{ allMenu[0].lowstockManagerMenu }}</router-link>
              </v-list-tile>
              <v-list-tile>
                <router-link  to="/" class="toolbarsMobileLink">{{ allMenu[0].invoiceManagerMenu }}</router-link>
              </v-list-tile>
              <v-list-tile>
                <router-link  to="/" class="toolbarsMobileLink">{{ allMenu[0].reportManagerMenu }}</router-link>
              </v-list-tile>
              <v-list-tile>
                <button @click="logOut()" class="toolbarsMobileLink">{{ allMenu[0].logoutMenu }}</button>
              </v-list-tile>

            </v-list>
          </v-menu>
  </v-toolbar>
</template>

<style>
    .toolbarsMobileLink{
        text-decoration: none;
        color:black
    }
</style>

<script>
import { store } from '../vuex/store/store'
import { mapState,mapMutations } from 'vuex'
export default {
    store,
    data(){
        return {
            allMenu:[
                {
                    loginMenu:'เข้าสู่ระบบ',
                    userManagerMenu:'จัดการบัญชีผู้ใช้',
                    companyManagerMenu:'จัดการบริษัทนำเข้า',
                    categoryManagerMenu:'จัดการประเภทสินค้า',
                    productManagerMenu:'จัดการสินค้า',
                    lowstockManagerMenu:'รายการสินค้าคงเหลือน้อย',
                    invoiceManagerMenu:'จัดการคำสั่งซื้อสินค้า',
                    reportManagerMenu:'รายงานผลการขาย',
                    logoutMenu:'ออกจากระบบ'
                }
            ]
        }
    },
    computed:{
        ...mapState([
            'authKey'
        ])
    },
    methods:{
         ...mapMutations([
          'SET_AUTHKEY'
        ]),
         logOut(){
            this.$localStorage.set('authKey','')
            this.SET_AUTHKEY(this.$localStorage.get('authKey'))    
            this.$router.push("login")
         }
    }
}
</script>
