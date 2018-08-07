<template>
   <v-app>
    <v-content>
    <v-container fluid >
        <h1>บัญชีผู้ใช้ทั้งหมด</h1>
            <template>
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
                small
                class="mr-2"
                @click="editItem(props.item)"
            >
                edit
            </v-icon>
            <v-icon
                small
                @click="deleteItem(props.item)"
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
    import axios from 'axios'
    import { mapState } from 'vuex'
    export default {
        data(){
            return{
               headers: [
                {
                    text: 'หมายเลขบัญชี',
                    align: 'left',
                    sortable: false,
                    value: 'id'
                },
                { text: 'ชื่อบัญชี', value: 'username' },
                { text: 'ชื่อ', value: 'firstName' },
                { text: 'นามสกุล', value: 'lastName' },
                { text: 'อีเมล์', value: 'email' },
                { text: 'เบอร์โทร', value: 'phoneNumber' },
                { text: 'การจัดการ', value: 'name', sortable: false }
                ],
                user:[],
                authKey:'1cb349e3-eff2-4165-b12d-0bf8c52b622d'
            }
        },
        computed:{
            ...mapState([
                'serverPath',
                //'authKey'
            ])
        },
        methods:{
            getAllUsers(){
                axios.get(this.serverPath+'users?authKey='+this.authKey).then(response=>{
                    this.user = response.data
                    console.log(this.serverPath+'users?authKey='+this.authKey)
                    console.log(this.user)
                }).catch(error=>{
                    console.log(error)
                })
            }
        }
    }
</script>