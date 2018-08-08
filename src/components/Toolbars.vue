<template>
    <v-toolbar color="teal" dark fixed>
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title class="white--text">MiniPOS</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down" v-if="authKey=='' || authKey==null">
      <v-btn flat to="/login">เข้าสู่ระบบ</v-btn>
    </v-toolbar-items>
    <v-toolbar-items class="hidden-sm-and-down" v-else>
      <v-btn flat to="/users">จัดการบัญชีผู้ใช้</v-btn>
      <v-btn flat>จัดการบริษัทนำเข้า</v-btn>
      <v-btn flat to="/addCategory">จัดการประเภทสินค้า</v-btn>
      <v-btn flat>จัดการสินค้า</v-btn>
      <v-btn flat>รายการสินค้าคงเหลือน้อย</v-btn>
      <v-btn flat>จัดการคำสั่งซื้อสินค้า</v-btn>
      <v-btn flat>รายงานผลการขาย</v-btn>
      <v-btn flat @click="logOut()">ออกจากระบบ</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { store } from '../vuex/store/store'
import { mapState,mapMutations } from 'vuex'
export default {
    store,
    data(){
        return {

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
            router.push("login")
         }
    }
}
</script>
