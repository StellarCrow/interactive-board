<template>
  <nav class="navbar navbar-light bg-light">
    <a class="navbar-brand" v-on:click="navigateTo({name: 'MainPage'})">Main Page</a>
    <!--<a v-on:click="navigateTo({ name: 'UserPage', params: { id: this.$store.state.user._id }})"> {{this.$store.state.user.username}}</a>-->
    <router-link :to="{ name: 'UserPage', params: { id: this.$store.state.user._id }}">{{this.$store.state.user.username}}</router-link>
    <button class="btn btn-outline-success my-2 my-sm-0" v-on:click="logout">Log out</button>
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
</style>
