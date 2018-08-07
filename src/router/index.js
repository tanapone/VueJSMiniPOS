import Vue from 'vue'
import Router from 'vue-router'
import Authentication from '@/components/Authentication'
import AddCategoryComponent from '@/components/AddCategoryComponent'
import ListAllUsersComponent from '@/components/ListAllUsersComponent'
import '../styles/main.styl'
import VueLocalStorage from 'vue-localstorage'
import VueRouter from 'vue-router';

Vue.use(Router)
Vue.use(VueLocalStorage)

const routes = [
    {
        path: '/login',
        component: Authentication,
        meta: { title: 'Authentication Page' }
    },
    {
        path: '/addCategory',
        component: AddCategoryComponent,
        meta: { title: 'Add Category Page' }
    },
    {
        path: '/users',
        component: ListAllUsersComponent,
        meta: { title: 'List All Users Page' }
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})

export default router
// export default new Router({
//     mode: 'history',
//     routes: [{
//             path: '/',
//             name: '',
//         },
//         {
//             path: '/login',
//             name: 'Authentication',
//             component: Authentication,
//             meta: { title: 'Login' }
//         }
//     ]
// })