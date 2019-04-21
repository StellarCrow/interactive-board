<template>
  <div>
    <h1>Register</h1>
    <b-container>
      <b-row>
        <b-col>
          <input type="text" name="email" placeholder="email" v-model="email">
        </b-col>
        <b-col>
          <input type="text" name="password" placeholder="password" v-model="password">
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <button @click="register">Register</button>
        </b-col>
      </b-row>
    </b-container>
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

<style lang="scss" scoped>
  @import "../styles/components/register";
</style>
