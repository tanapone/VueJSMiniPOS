<template>
 <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="teal">
                <v-toolbar-title>ระบบยืนยันตัวตน</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="login" label="ชื่อบัญชี" type="text" v-model="username"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" label="รหัสผ่าน" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="teal white--text" @click="checkValidate()">เข้าสู่ระบบ</v-btn>
              </v-card-actions>
            </v-card>
            <div>
                <v-alert v-model="warning" dismissible type="warning" style="margin-top:1em">
                {{ warningMsg }}
                </v-alert>
            </div>
            <div>
                <v-alert v-model="errorFound" dismissible type="error" style="margin-top:1em">
                {{ errorMsg }}
                </v-alert>
                <!-- key : {{authKey}} -->
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>

</template>
<script>
import { store } from '../vuex/store/store'
import { mapState,mapMutations } from 'vuex'
import axios from 'axios'
export default {
    data(){
     return {
             username : '',
             password : '',
             warning : false,
             warningMsg : '',
             errorFound : false,
             errorMsg : ''
        }
    },
     computed:{
        ...mapState([
            'serverPath',
            'authKey'
        ])
    },
    methods:{
        checkValidate(){ 
            if(this.username == '' || this.password == ''){
             this.warningMsg = 'กรุณากรอกข้อมูลให้ครบ'
             this.warning = true
            }else{
                this.checkUser()
            }
        },
         ...mapMutations([
          'SET_AUTHKEY'
        ]),
        checkUser(){
            axios.post(this.serverPath+'login/admin',{
                username : this.username,
                password : this.password
            }).then(response=>{
                if(response.data.message =='Wrong username or password.'){
                    this.errorMsg = 'ชื่อบัญชี หรือ รหัสผ่านไม่ถูกต้อง'
                    this.errorFound = true
                }else if(response.data.message =='No permission.'){
                    this.errorMsg = 'คุณไม่มีสิทธิ์ ใช้งานในส่วนของผู้ดูแลระบบ'
                    this.errorFound = true
                }else{
                    this.$localStorage.set('authKey',response.data.authKey)
                    this.SET_AUTHKEY(this.$localStorage.get('authKey'))
                }
            }).catch(error=>{
                console.log(error)
            })
        }
    }
}
</script>
