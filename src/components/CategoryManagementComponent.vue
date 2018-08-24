<template>
<v-app>
<v-content>
<v-container fluid >
<h1>ประเภทสินค้าทั้งหมด</h1>
<template>
<v-layout  justify-end>
    <v-btn color="teal white--text" @click="dialog = true">
        <v-icon small class="mr-2">add_circle</v-icon>
         เพิ่มประเภทสินค้า
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
        <v-text-field label="ชื่อประเภทสินค้า" v-model="newCategory.categoryName" 
        :rules="[v => !!v || 'กรุณากรอกชื่อประเภทสินค้า']"
        required></v-text-field>
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
            :items="categories"
            hide-actions
            class="elevation-1"
    >
    <template slot="items" slot-scope="props">
        <td >{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.categoryName }}</td>
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
editedIndex:-1,
valid: true,
dialog: false,
headers: [
{
    text: "หมายเลขประเภทสินค้า",
    align: "left",
    sortable: false,
    value: "id"
},
{ text: "ชื่อประเภทสินค้า", value: "categoryName"},
{ text: "การจัดการ", value: "name", sortable: false }
],
newCategory: [
{
    categoryName:''
}
],
categories: []
};
},
computed: {
...mapState(["serverPath", "authKey"]),
    formTitle () {
        return this.editedIndex === -1 ? 'เพิ่มประเภทสินค้าใหม่' : 'แก้ไขประเภทสินค้า'
    }

},
methods: {
getAllCategories() {
axios
.get(this.serverPath + "categories?authKey=" + this.authKey)
.then(response => {
    this.categories = response.data;
    console.log(this.serverPath + "categories?authKey=" + this.authKey);
    console.log(this.categories);
})
.catch(error => {
    console.log(error);
});
},
save() {
if (this.$refs.form.validate()) {
    // editedIndex คือตำแหน่งที่เลือก item index ตอนนี้ใช้ตรวจสอบว่า ถ้า -1 คือสร้างข้อมูลใหม่ แต่ถ้าไม่ใช่คือการแก้ไข
    if(this.editedIndex==-1){
        axios.post(this.serverPath+'create/category?authKey='+this.authKey,{
            categoryName: this.newCategory.categoryName
        }).then(response =>{
            if(response.data.message=='Please change category name.'){
                this.errMsg = 'ประเภทสินค้านี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนชื่อประเภทสินค้า'
            }else{
                this.resetForm()
                this.getAllCategories()
            }
        }).catch(error=>{
            console.log(error)
        })
    }else{
        axios.post(this.serverPath+'update/category?authKey='+this.authKey,{
            id : this.categories[this.editedIndex].id,
            categoryName: this.newCategory.categoryName
        }).then(response =>{
            if(response.data.message=='no category detail.'){
                this.errMsg = 'ไม่พบข้อมูลของประเภทสินค้า'
            }else{
                if(response.data.message=='Please change category name.'){
                    this.errMsg = 'ประเภทสินค้านี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนชื่อประเภทสินค้า'
                }else{
                    this.resetForm()
                    this.getAllCategories()
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
        this.editedIndex = this.categories.indexOf(item)
        this.newCategory = Object.assign({}, item)
        this.dialog = true
},
async cfmDelete(item){
    let categoryName = this.categories[this.categories.indexOf(item)].categoryName
    let res = await this.$confirm('คุณต้องการลบประเภทสินค้า '+ categoryName + '?', {title: 'คำเตือน'})
    if(res){
        this.deleteItem(this.categories[this.categories.indexOf(item)])
    }
},
deleteItem(item){
    axios.delete(this.serverPath+'delete/category/'+item.id+'?authKey='+this.authKey).then(response=>{
        this.getAllCategories();
    }).catch(error=>{
        console.log(error)
    })
}
},
beforeMount() {
    this.getAllCategories();
}
};
</script>