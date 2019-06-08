<template>
  <nav class="navbar navbar-expand-lg navbar-light navbar-color">
    <a class="navbar-brand" v-on:click="navigateTo({name: 'MainPage'})">Home</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <li class="nav-item active">
          <!--<a class="nav-link" v-on:click="navigateTo({ name: 'UserPage', params: { id: this.$store.state.user._id }})"> {{this.$store.state.user.username}}<span class="sr-only">(current)</span></a>-->
          <router-link class="nav-link" :to="{ name: 'UserPage', params: { id: this.$store.state.user._id }}">{{this.$store.state.user.username}}</router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="navigateTo({path: '/users/'})">Чужие доски</a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
      <button class="btn btn-outline-success my-2 my-sm-0 ml-5" v-on:click="logout">Выйти</button>
    </div>
  </nav>
</template>

<script>
  export default {
    name: "Toolbar",
    methods: {
      navigateTo(route) {
        this.$router.push(route);
      },
      logout() {
            this.$store.commit('setToken', null);
            this.$store.commit('setUser', null);
            this.$router.push({
              name: 'MainPage'
            })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/basics/base";

  .navbar-color {
    background-color: $tertiary-color--light;
  }
</style>
