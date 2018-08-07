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
                key : {{authKey}}
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
export default {
    
}
</script>
