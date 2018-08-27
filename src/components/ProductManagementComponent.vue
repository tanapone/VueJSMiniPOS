<template>
<v-app>
<v-content>
<v-container fluid >
<h1>สินค้าทั้งหมด</h1>
<template>
<v-layout  justify-end>
    <v-btn color="teal white--text" @click="dialog = true">
        <v-icon small class="mr-2">add_shopping_cart</v-icon>
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
        <v-text-field label="ชื่อสินค้า" v-model="newProduct.productName" 
        :rules="[v => !!v || 'กรุณากรอกชื่อสินค้า']"
        required></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="รหัสบาร์โค้ดสินค้า" v-model="newProduct.productBarcodeID" 
        required
        :rules="[v => !!v || 'กรุณากรอกรหัสบาร์โค้ดสินค้า']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="ราคาทุนสินค้า" v-model="newProduct.productCapitalPrice"
         style="appearance: none;"
         type="number"
       
        required
        :rules="[v => !!v || 'กรุณากรอกราคาทุนสินค้า']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="ราคาขายสินค้า" v-model="newProduct.productSalePrice" 
        type="number"
        style="appearance: none;"
        required
        :rules="[v => !!v || 'กรุณากรอกราคาขายสินค้า']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="จำนวนสินค้าขั้นต่ำ" v-model="newProduct.productMinimum" 
        type="number"
        style="appearance: none;"
        required
        :rules="[v => !!v || 'กรุณากรอกจำนวนสินค้าขั้นต่ำ']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
        <v-text-field label="จำนวนสินค้า" v-model="newProduct.productQty" 
        type="number"
        style="appearance: none;"
        required
        :rules="[v => !!v || 'กรุณากรอกจำนวนสินค้า']"
        ></v-text-field>
        </v-flex>
        <v-flex xs12>
            <v-select
            :items="categories"
            item-text="categoryName"
            item-value="id"
            label="ประเภทสินค้า"
            :rules="[v => v!=null || 'กรุณาเลือกประเภทสินค้า']"
            persistent-hint
            return-object
            single-line
            v-model="newProduct.category"
            ></v-select>
      </v-flex>
        <v-flex xs12>
            <v-select
            :items="companies"
            item-text="companyName"
            item-value="id"
            label="บริษัทนำเข้า"
            :rules="[v => v!=null || 'กรุณาเลือกบริษัทนำเข้า']"
            persistent-hint
            return-object
            single-line
            v-model="newProduct.company"
            ></v-select>
      </v-flex>
    </v-layout>
    </v-container>
    <span>*กรุณากรอกข้อมูลให้ครบ</span>
    <br/>
    <!-- <span>{{ newProduct.category }}</span>
    <span>{{ newProduct.company }}</span> -->
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
            :items="products"
            hide-actions
            class="elevation-1"
    >
    <template slot="items" slot-scope="props">
        <td >{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.productName }}</td>
        <td class="text-xs-left">{{ props.item.productCapitalPrice }}</td>
        <td class="text-xs-left">{{ props.item.productSalePrice }}</td>
        <td class="text-xs-left">{{ props.item.productMinimum }}</td>
        <td class="text-xs-left">{{ props.item.productQty }}</td>
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
    text: "หมายเลขสินค้า",
    align: "left",
    sortable: false,
    value: "id"
},
{ text: "ชื่อสินค้า", value: "username" },
{ text: "ราคาทุน", value: "firstName" },
{ text: "ราคาขาย", value: "lastName" },
{ text: "จำนวนสินค้าขั้นต่ำ", value: "email" },
{ text: "จำนวนสินค้าคงเหลือ", value: "phoneNumber" },
{ text: "การจัดการ", value: "name", sortable: false }
],
newProduct: [
{
    productName: '',
    productBarcodeID: '',
    productCapitalPrice:0,
    productSalePrice:0,
    productMinimum:0,
    productQty:0,
    company:{},
    category:{}
}
],
companies: [],
categories:[],
products:[]
};
},
computed: {
...mapState(["serverPath", "authKey"]),
    formTitle () {
        return this.editedIndex === -1 ? 'เพิ่มสินค้าใหม่' : 'แก้ไขสินค้า'
    }

},
methods: {
getAllProducts() {
axios
.get(this.serverPath + "products?authKey=" + this.authKey)
.then(response => {
    this.products = response.data;
    console.log(this.serverPath + "products?authKey=" + this.authKey);
    console.log(this.products);
})
.catch(error => {
    console.log(error);
});
},
save() {
if (this.$refs.form.validate()) {
    // editedIndex คือตำแหน่งที่เลือก item index ตอนนี้ใช้ตรวจสอบว่า ถ้า -1 คือสร้างข้อมูลใหม่ แต่ถ้าไม่ใช่คือการแก้ไข
    if(this.editedIndex==-1){
        axios.post(this.serverPath+'create/product?authKey='+this.authKey,{
            productName: this.newProduct.productName,
            productBarcodeID: this.newProduct.productBarcodeID,
            productCapitalPrice: this.newProduct.productCapitalPrice,
            productSalePrice: this.newProduct.productSalePrice,
            productMinimum: this.newProduct.productMinimum,
            productQty: this.newProduct.productQty,
            company: this.newProduct.company,
            category: this.newProduct.category
        }).then(response =>{
            if(response.data.message=='Please change product name.'){
                this.errMsg = 'สินค้านี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนชื่อสินค้า'
            }else{
                this.resetForm()
                this.getAllProducts()
            }
        }).catch(error=>{
            console.log(error)
        })
    }else{
        axios.post(this.serverPath+'update/product?authKey='+this.authKey,{
            id : this.products[this.editedIndex].id,
            productName: this.newProduct.productName,
            productBarcodeID: this.newProduct.productBarcodeID,
            productCapitalPrice: this.newProduct.productCapitalPrice,
            productSalePrice: this.newProduct.productSalePrice,
            productMinimum: this.newProduct.productMinimum,
            productQty: this.newProduct.productQty,
            company: this.newProduct.company,
            category: this.newProduct.category
        }).then(response =>{
            if(response.data.message=='no product detail.'){
                this.errMsg = 'ไม่พบข้อมูลของสินค้า'
            }else{
                if(response.data.message=='Please change product name.'){
                    this.errMsg = 'ชื่อสินค้านี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนชื่อสินค้า'
                }else if(response.data.message=='Please change product barcode.'){
                    this.errMsg = 'มีสินค้าที่ใช้รหัสบาร์โค้ดนี้อยู่ กรุณาเปลี่ยนรหัสบาร์โค้ด'
                }else{
                    this.resetForm()
                    this.getAllProducts()
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
        this.editedIndex = this.products.indexOf(item)
        this.newProduct = Object.assign({}, item)
        this.dialog = true
},
async cfmDelete(item){
    let productName = this.products[this.products.indexOf(item)].productName
    let res = await this.$confirm('คุณต้องการสินค้า '+ productName + '?', {title: 'คำเตือน'})
    if(res){
        this.deleteItem(this.products[this.products.indexOf(item)])
    }
},
deleteItem(item){
    axios.delete(this.serverPath+'delete/product/'+item.id+'?authKey='+this.authKey).then(response=>{
        this.getAllProducts();
    })
},
getAllProducts(){
    axios.get(this.serverPath+'products?authKey=' + this.authKey).then(response=>{
        this.products = response.data
        console.log(this.products)
    })
},
getAllCategories(){
    axios.get(this.serverPath+'categories?authKey=' + this.authKey).then(response=>{
        this.categories = response.data
        console.log(this.categories)
    })
},
getAllCompanies(){
    axios.get(this.serverPath+'companies?authKey=' + this.authKey).then(response=>{
        this.companies = response.data
        console.log(this.companies)
    })
}
},
beforeMount() {
    this.getAllProducts()
    this.getAllCategories()
    this.getAllCompanies()
}
};
</script>