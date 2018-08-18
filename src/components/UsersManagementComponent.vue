<template>
<v-app>
<v-content>
<v-container fluid >
<h1>บัญชีผู้ใช้ทั้งหมด</h1>
<template>
<v-layout  justify-end>
    <v-btn color="teal white--text" @click="dialog = true">
        <v-icon small class="mr-2">person_add</v-icon>
            เพิ่มบัญชีผู้ใช้
    </v-btn>
</v-layout>
<!-- add user dialog -->
<template>
<v-layout row justify-center>
<v-dialog v-model="dialog" persistent max-width="500px">
<v-form ref="form" v-model="valid" lazy-validation>
<v-card>
<v-card-title>
    <h3>{{ formTitle }}</h3>
</v-card-title>
<v-card-text>
<v-container grid-list-md>
    <v-layout wrap>
        <v-flex xs12>
        <v-text-field label="ชื่อบัญชี" v-model="newUser.username" 
        :rules="[v => !!v || 'กรุณากรอกชื่อบัญชี']"
        required></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="รหัสผ่าน" type="password" v-model="newUser.password" required
        :rules="[v => !!v || 'กรุณากรอกรหัสผ่าน']"
        :disabled="passwordDisable"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="ยืนยันรหัสผ่าน" type="password" hint="รหัสผ่านต้องตรงกัน" required
        :rules="reEnterPasswordRules"
        :disabled="reTypePasswordDisable"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="ชื่อต้น" v-model="newUser.firstName" required
        :rules="[v => !!v || 'กรุณากรอกชื่อต้น']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="นามสกุล" v-model="newUser.lastName" required
        :rules="[v => !!v || 'กรุณากรอกนามสกุล']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="อีเมล" v-model="newUser.email" required
        :rules="emailRules"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="เบอร์โทร" type="tel" maxlength="10" v-model="newUser.phoneNumber" required
        :rules="[v => !!v || 'กรุณากรอกเบอร์โทร']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-textarea
            solo
            label="ที่อยู่ปัจจุบัน"
            value=""
            v-model="newUser.address"
            :rules="[v => !!v || 'กรุณากรอกที่อยู่ปัจจุบัน']"
        ></v-textarea>
        </v-flex>
        <v-flex xs12>
        <v-select
            :items="[
            {
                value:0,name: 'พนักงาน'
            },
            {
                value:1,name: 'ผู้ดูแลระบบ'
            }
            ]"
            item-text="name"
            item-value="value"
            label="ประเภทผู้ใช้"
            v-model="newUser.userType"
            :rules="[v => v!=null || 'กรุณาเลือกประเภทผู้ใช้']"
            required
        ></v-select>
        </v-flex>
    </v-layout>
    </v-container>
    <span>*กรุณากรอกข้อมูลให้ครบ</span>
    <br/>
    <span style="color:red" v-if="errMsg!=''">{{this.errMsg}}</span>
</v-card-text>
<v-card-actions>
    <v-spacer></v-spacer>
    <v-btn color="blue darken-1" flat @click.native="resetForm()">ปิดหน้าต่าง</v-btn>
    <v-btn color="blue darken-1" flat @click.native="save()">บันทึก</v-btn>
</v-card-actions>
</v-card>
</v-form>
</v-dialog>
</v-layout>
</template>

<!-- end add user dialog -->

<v-data-table
            :headers="headers"
            :items="user"
            hide-actions
            class="elevation-1"
    >
    <template slot="items" slot-scope="props">
        <td >{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.username }}</td>
        <td class="text-xs-left">{{ props.item.firstName }}</td>
        <td class="text-xs-left">{{ props.item.lastName }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.phoneNumber }}</td>
        <td >
    <v-icon
        medium
        class="mr-2"
        @click="editItem(props.item)"
    >
        edit
    </v-icon>
        
    <v-icon
        medium
        @click="cfmDelete(props.item)"
    >
        delete
    </v-icon>
    </td>
    </template>
    <template slot="no-data">
    <v-alert :value="true" color="error" icon="warning">
        ไม่พบข้อมูลผู้ใช้งาน
    </v-alert>
    </template>
</v-data-table>
</template>
<v-layout  justify-end>
    <v-btn color="teal white--text" @click="getAllUsers()">
        <v-icon small class="mr-2" >refresh</v-icon>
            โหลดข้อมูลใหม่
    </v-btn>
</v-layout>
</v-container>
</v-content>
</v-app>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
data() {
return {
errMsg:'',
passwordDisable:false,
reTypePasswordDisable:false,
editedIndex:-1,
emailRules:[
    v => !!v || 'กรุณากรอกอีเมล',
    v => /.+@.+/.test(v) || 'รูปแบบอีเมลไม่ถูกต้อง'
    ],
reEnterPasswordRules:[
        v => !!v || 'กรุณายืนยันรหัสผ่าน',
        v => v==this.newUser.password || 'รหัสผ่านไม่ตรงกัน'
        
],
disableReTypeRules:[]
,
valid: true,
dialog: false,
headers: [
{
    text: "หมายเลขบัญชี",
    align: "left",
    sortable: false,
    value: "id"
},
{ text: "ชื่อบัญชี", value: "username" },
{ text: "ชื่อ", value: "firstName" },
{ text: "นามสกุล", value: "lastName" },
{ text: "อีเมล์", value: "email" },
{ text: "เบอร์โทร", value: "phoneNumber" },
{ text: "การจัดการ", value: "name", sortable: false }
],
newUser: [
{
    username: '',
    password: '',
    userType:0,
    firstName: '',
    lastName: '',
    email:'',
    phoneNumber:'',
    address:''
}
],
user: []
};
},
computed: {
...mapState(["serverPath", "authKey"]),
    formTitle () {
        return this.editedIndex === -1 ? 'สร้างบัญชีใหม่' : 'แก้ไขบัญชี'
    }

},
methods: {
getAllUsers() {
axios
.get(this.serverPath + "users?authKey=" + this.authKey)
.then(response => {
    this.user = response.data;
    console.log(this.serverPath + "users?authKey=" + this.authKey);
    console.log(this.user);
})
.catch(error => {
    console.log(error);
});
},
save() {
if (this.$refs.form.validate()) {
    // editedIndex คือตำแหน่งที่เลือก item index ตอนนี้ใช้ตรวจสอบว่า ถ้า -1 คือสร้างข้อมูลใหม่ แต่ถ้าไม่ใช่คือการแก้ไข
    if(this.editedIndex==-1){
        axios.post(this.serverPath+'create/user?authKey='+this.authKey,{
            username: this.newUser.username,
            password: this.newUser.password,
            userType: this.newUser.userType,
            firstName: this.newUser.firstName,
            lastName: this.newUser.lastName,
            email: this.newUser.email,
            phoneNumber: this.newUser.phoneNumber,
            address: this.newUser.address
        }).then(response =>{
            if(response.data.message=='Please change username.'){
                this.errMsg = 'บัญชีนี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนชื่อบัญชี'
            }else if(response.data.message=='Please change email.'){
                this.errMsg = 'มีบัญชีที่ใช้อีเมลนี้อยู่ กรุณาเปลี่ยนอีเมล'
            }else{
                this.resetForm()
                this.getAllUsers()
            }
        }).catch(error=>{
            console.log(error)
        })
    }else{
        axios.post(this.serverPath+'update/user?authKey='+this.authKey,{
            id : this.user[this.editedIndex].id,
            username: this.newUser.username,
            password: this.newUser.password,
            userType: this.newUser.userType,
            firstName: this.newUser.firstName,
            lastName: this.newUser.lastName,
            email: this.newUser.email,
            phoneNumber: this.newUser.phoneNumber,
            address: this.newUser.address,
            authKey:this.user[this.editedIndex].authKey
        }).then(response =>{
            if(response.data.message=='no user detail.'){
                this.errMsg = 'ไม่พบข้อมูลของผู้ใช้'
            }else{
                if(response.data.message=='Please change username.'){
                    this.errMsg = 'บัญชีนี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนชื่อบัญชี'
                }else if(response.data.message=='Please change email.'){
                    this.errMsg = 'มีบัญชีที่ใช้อีเมลนี้อยู่ กรุณาเปลี่ยนอีเมล'
                }else{
                    this.resetForm()
                    this.getAllUsers()
                }
            }
        }).catch(error=>{
            console.log(error)
        })
    }
}
},
resetForm(){
    this.$refs.form.reset()
    this.errMsg = ''
    this.dialog = false
    this.reTypePasswordDisable = false
    this.passwordDisable = false
    this.editedIndex = -1
},
editItem(item) {
        this.editedIndex = this.user.indexOf(item)
        this.newUser = Object.assign({}, item)
        this.reEnterPasswordRules = Object.assign([],this.disableReTypeRules)
        this.reTypePasswordDisable = true
        this.passwordDisable = true
        this.dialog = true
},
async cfmDelete(item){
    let username = this.user[this.user.indexOf(item)].username
    let res = await this.$confirm('คุณต้องการลบบัญชี '+ username + '?', {title: 'คำเตือน'})
    if(res){
        this.deleteItem(this.user[this.user.indexOf(item)])
    }
},
deleteItem(item){
    axios.delete(this.serverPath+'delete/user/'+item.id+'?authKey='+this.authKey).then(response=>{
        this.getAllUsers();
    })
}
},
beforeMount() {
    this.getAllUsers();
}
};
</script>