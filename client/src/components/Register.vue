<template>
  <div class="bg">
    <div class="container padding">
      <div class="row justify-content-center">
        <div class="col-3 text-center">
          <h2>Регистрация</h2>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-5 text-center">
          <form class="form" autocomplete="off">
            <div class="form-group">
              <input type="text" placeholder="Username" class="form__input" v-model="username" required>
            </div>
            <div class="form-group">
              <input type="text" placeholder="Полное имя" class="form__input" v-model="fullName">
            </div>
            <div class="form-group">
              <input type="email" placeholder="Email" class="form__input" v-model="email" required>
            </div>
            <div class="form-group">
              <input type="password" placeholder="Пароль" class="form__input" v-model="password" required>
            </div>
            <div class="form-group">
              <input type="password" placeholder="Повторите пароль" class="form__input" v-model="repeatPassword"
                     required>
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
        fullName: '',
        lastName: '',
        isVisible: false,
        error: null,
        passValid: false,
        message: ''
      }
    },
    methods: {
      async register() {
        try {
          const response = await AuthenticationService.register({
            email: this.email,
            username: this.username,
            password: this.password,
            fullName: this.fullName
          });
          this.$store.commit('setToken', response.data.token);
          this.$store.commit('setUser', response.data.user);
          this.$router.push({path: `/users/${response.data.user._id}`});
        } catch (error) {
          this.error = error.response.data.error;
        }
      }
    },
    computed: {
      // message: function () {
      //   if (this.password !== this.repeatPassword) {
      //     this.passValid = false;
      //     return this.message = "Пароли не совпадают!"
      //   }
      //   else {
      //     this.passValid = true;
      //   }
      // }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/components/register";

  .bg {
    background: url("../assets/images/2.svg") no-repeat center top / cover;
  }

  .padding {
    padding-top: 10%;
    padding-bottom: 8%;
  }

</style>
