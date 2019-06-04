<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-2">
        <h1>Регистрация</h1>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-6">
        <form class="form" autocomplete="off">
          <div class="form-group">
            <input type="text" placeholder="Username" class="form__input" v-model="username" required>
          </div>
          <div class="form-group">
            <input type="text" placeholder="Имя" class="form__input" v-model="firstName">
          </div>
          <div class="form-group">
            <input type="text" placeholder="Фамилия" class="form__input" v-model="lastName">
          </div>
          <div class="form-group">
            <input type="email" placeholder="Email" class="form__input" v-model="email" required>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Пароль" class="form__input" v-model="password" required>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Повторите пароль" class="form__input" v-model="repeatPassword" required>
          </div>
          <button v-on:click="register">Подтвердить</button>
        </form>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-4">
        {{error}}
      </div>
    </div>
  </div>
</template>

<script>
  import AuthenticationService from '../services/AuthenticationService'

  export default {
    name: "Register",
    data() {
      return {
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
        firstName: '',
        lastName: '',
        isVisible: false,
        error: null
      }
    },
    methods: {
      async register() {
        try {
           const response = await AuthenticationService.register({
            email: this.email,
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password
          });
          this.$store.commit('setToken', response.data.token);
          this.$store.commit('setUser', response.data.user);
          this.$router.push({ path: `/users/${response.data.user._id}`});
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
