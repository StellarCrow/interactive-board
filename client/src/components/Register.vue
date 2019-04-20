<template>
    <div>
      <h1>Register</h1>
      <input type="text" name="email" placeholder="email" v-model="email">
      <input type="text" name="password" placeholder="password" v-model="password">
      <br/>
      <button @click="register">Register</button>

    </div>
</template>

<script>
  import AuthenticationService from '../services/AuthenticationService'
    export default {
        name: "Register",
      data() {
        return {
          email: '',
          password: ''
        }
      },
      methods: {
          async register() {
            await AuthenticationService.register({
              email: this.email,
              password: this.password
            });
          }
      }
    }
</script>

<style scoped>

</style>
