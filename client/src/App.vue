<template>
  <div id="app">
    <toolbar v-if="this.$store.state.isUserLoggedIn"></toolbar>
    <router-view/>
  </div>
</template>

<script>
  import Toolbar from "./components/Toolbar";
export default {
  name: 'App',
  components: {Toolbar}
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
</style>
