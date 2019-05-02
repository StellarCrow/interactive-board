import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '../components/pages/MainPage'
import UserPage from '../components/pages/UserPage'
import Register from '../components/Register'
import Login from '../components/Login'
import Board from '../components/Board'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/registration',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/user/:id',
      name: 'UserPage',
      component: UserPage,
      meta: {requiresAuth: true}
    },
    {
      path: '/user/:id/board/:idb',
      name: 'Board',
      component: Board
    }
  ]
})
