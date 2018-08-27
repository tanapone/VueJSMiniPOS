<template>
<v-app>
<v-content>
<v-container fluid >
<h1>บริษัทนำเข้าสินค้าทั้งหมด</h1>
<template>
<v-layout  justify-end>
    <v-btn color="teal white--text" @click="dialog = true">
        <v-icon small class="mr-2">add_circle</v-icon>
         เพิ่มบริษัทนำเข้า
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
        <v-text-field label="ชื่อบริษัท" v-model="newCompany.companyName" 
        :rules="[v => !!v || 'กรุณากรอกชื่อบริษัท']"
        required></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="เบอร์โทรศัพท์" v-model="newCompany.companyPhoneNumber" maxlength="10" required
        :rules="[v => !!v || 'กรุณากรอกเบอร์โทรศัพท์']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="อีเมล ของบริษัท" v-model="newCompany.companyEmail" required
        :rules="[v => !!v || 'กรุณากรอกอีเมล ของบริษัท']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-textarea
            solo
            label="ที่อยู่ของบริษัท"
            value=""
            v-model="newCompany.companyAddress"
            :rules="[v => !!v || 'กรุณากรอกที่อยู่ของบริษัท']"
        ></v-textarea>
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

<!-- alert box when company still have product using -->
<template>
  <v-layout row justify-center>
    <v-dialog v-model="alertDialog" persistent max-width="350">
      <v-card>
        <v-card-title class="headline">เกิดข้อผิดพลาด</v-card-title>
        <v-card-text>{{ errMsg }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click.native="alertDialog = false,errMsg = ''">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<!-- end -->

<v-data-table
            :headers="headers"
            :items="companies"
            hide-actions
            class="elevation-1"
    >
    <template slot="items" slot-scope="props">
        <td >{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.companyName }}</td>
        <td class="text-xs-left">{{ props.item.companyPhoneNumber }}</td>
        <td class="text-xs-left">{{ props.item.companyEmail }}</td>
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
        ไม่พบข้อมูลบริษัทนำเข้า
    </v-alert>
    </template>
</v-data-table>
</template>
<v-layout  justify-end>
    <v-btn color="teal white--text" @click="getAllCompanies()">
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
editedIndex:-1,
emailRules:[
    v => !!v || 'กรุณากรอกอีเมล',
    v => /.+@.+/.test(v) || 'รูปแบบอีเมลไม่ถูกต้อง'
    ],
valid: true,
dialog: false,
alertDialog: false,
headers: [
{
    text: "หมายเลขบริษัทนำเข้า",
    align: "left",
    sortable: false,
    value: "id"
},
{ text: "ชื่อบริษัทนำเข้า", value: "companyName" },
{ text: "เบอร์โทรศัพท์", value: "companyPhoneNumber" },
{ text: "อีเมล", value: "companyEmail"},
{ text: "การจัดการ", value: "name", sortable: false }
],
newCompany: [
{
    companyName:'',
    companyPhoneNumber:'',
    companyEmail:'',
    companyAddress:''
}
],
companies: []
};
},
computed: {
...mapState(["serverPath", "authKey"]),
    formTitle () {
        return this.editedIndex === -1 ? 'เพิ่มบริษัทนำข้าใหม่' : 'แก้ไขบริษัทนำเข้า'
    }

},
methods: {
getAllCompanies() {
axios
.get(this.serverPath + "companies?authKey=" + this.authKey)
.then(response => {
    this.companies = response.data;
    console.log(this.serverPath + "companies?authKey=" + this.authKey);
    console.log(this.companies);
})
.catch(error => {
    console.log(error);
});
},
save() {
if (this.$refs.form.validate()) {
    // editedIndex คือตำแหน่งที่เลือก item index ตอนนี้ใช้ตรวจสอบว่า ถ้า -1 คือสร้างข้อมูลใหม่ แต่ถ้าไม่ใช่คือการแก้ไข
    if(this.editedIndex==-1){
        axios.post(this.serverPath+'create/company?authKey='+this.authKey,{
            companyName: this.newCompany.companyName,
            companyPhoneNumber: this.newCompany.companyPhoneNumber,
            companyEmail: this.newCompany.companyEmail,
            companyAddress: this.newCompany.companyAddress,
        }).then(response =>{
            if(response.data.message=='Please change company name.'){
                this.errMsg = 'บริษัทนี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนชื่อบริษัท'
            }else{
                this.resetForm()
                this.getAllCompanies()
            }
        }).catch(error=>{
            console.log(error)
        })
    }else{
        axios.post(this.serverPath+'update/company?authKey='+this.authKey,{
            id : this.companies[this.editedIndex].id,
            companyName: this.newCompany.companyName,
            companyPhoneNumber: this.newCompany.companyPhoneNumber,
            companyEmail: this.newCompany.companyEmail,
            companyAddress: this.newCompany.companyAddress,
        }).then(response =>{
            if(response.data.message=='no company detail.'){
                this.errMsg = 'ไม่พบข้อมูลของบริษัท'
            }else{
                if(response.data.message=='Please change company name.'){
                    this.errMsg = 'บริษัทนี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนชื่อบริษัท'
                }else{
                    this.resetForm()
                    this.getAllCompanies()
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

    this.editedIndex = -1
},
editItem(item) {
        this.editedIndex = this.companies.indexOf(item)
        this.newCompany = Object.assign({}, item)
        this.dialog = true
},
async cfmDelete(item){
    let companyName = this.companies[this.companies.indexOf(item)].companyName
    let res = await this.$confirm('คุณต้องการลบบริษัท '+ companyName + '?', {title: 'คำเตือน'})
    if(res){
        this.deleteItem(this.companies[this.companies.indexOf(item)])
    }
},
deleteItem(item){
    axios.delete(this.serverPath+'delete/company/'+item.id+'?authKey='+this.authKey).then(response=>{
        if(response.data.message=='This company still have products.'){
            this.errMsg = 'ยังมีสินค้าที่เป็นของบริษัทนี้อยู่ ไม่สามารถลบบริษัทได้ กรุณาลบสินค้าที่เป็นของบริษัทนี้ก่อน'
            this.alertDialog = true
        }
        this.getAllCompanies();
    }).catch(error=>{
        console.log(error)
    })
},

},
beforeMount() {
    this.getAllCompanies();
}
};
</script>