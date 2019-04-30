<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-2">
        <button v-on:click="isVisible = !isVisible">Войти</button>
      </div>
    </div>
    <div v-if="isVisible" class="row justify-content-center">
      <div class="col-6">
        <form class="form">
          <div class="form-group">
            <input type="text" placeholder="Username" class="form__input" v-model="username" required>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Пароль" class="form__input" v-model="password" required>
          </div>
          <button v-on:click="register">Подтвердить</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import AuthenticationService from '../services/AuthenticationService'

  export default {
    name: "Login",
    data() {
      return {
        username: '',
        password: '',
        isVisible: false,
        error: null
      }
    },
    methods: {
       async register() {
        try {
           await AuthenticationService.login({
            username: this.username,
            password: this.password
          });
        } catch (error) {
          this.error = error.response.data.error;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/components/register";
</style>
