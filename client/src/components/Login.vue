<template>
  <div class="bg">
    <div class="container padding">
      <div class="row justify-content-center">
        <div class="col-3 text-center">
          <h2>Войти в аккаунт</h2>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-5 text-center">
          <form class="form">
            <div class="form-group">
              <input type="text" placeholder="Username" class="form__input" v-model="username" required>
            </div>
            <div class="form-group">
              <input type="password" placeholder="Пароль" class="form__input" v-model="password" required>
            </div>
            <button v-on:click="login">Подтвердить</button>
          </form>
        </div>
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
      async login() {
        try {
          const response = await AuthenticationService.login({
            username: this.username,
            password: this.password
          });
          console.log(response.data.token);
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

  .padding {
    padding-top: 12%;
    padding-bottom: 17%;
  }



</style>
