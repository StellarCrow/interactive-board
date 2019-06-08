import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '../components/pages/MainPage'
import UserPage from '../components/pages/UserPage'
import UserSettings from '../components/UserSettings'
import UsersList from '../components/UsersList'
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
      path: '/users/:id',
      name: 'UserPage',
      component: UserPage,
      meta: {requiresAuth: true}
    },
    {
      path: '/users/:id/board/:idb',
      name: 'Board',
      component: Board
    },
    {
      path: '/users/:id/settings',
      name: 'UserSettings',
      component: UserSettings,
      meta: {requiresAuth: true}
    },
    {
      path: '/users/',
      name: 'UsersList',
      component: UsersList,
      meta: {requiresAuth: true}
    }

  ]
})
