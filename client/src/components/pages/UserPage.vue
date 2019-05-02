<template>
  <div>
    <div class="container">
      <div class="row justify-content-center">
        <col-5>
          <h1>Мой профиль</h1>
          <div class="user-info">
            <div class="user-info__avatar">
              <img src="" alt="Avatar">
            </div>
            <div class="user-info__username">
              {{username}}
            </div>
            <div class="user-info__fullname">
              {{firstName + secondName}}
            </div>
            <div class="user-info__description">
              {{description}}
            </div>
          </div>
        </col-5>
      </div>
      <div class="row justify-content-center">
        <div class="col-10 text-center">
          <h1>Доски</h1>
          <div class="boards">
              <div v-for="board in boards">
                  <div class="boards__name">
                    {{board.name}}
                  </div>
                  <router-link>
                    <img src="" alt="Board-image" class="boards__image">
                  </router-link>
              </div>
            <button class="add" v-on:click="navigateTo()">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BoardService from '../../services/BoardService'

  export default {
    name: "UserPage",
    data() {
      return {
        username: "",
        firstName: "",
        secondName: "",
        description: "",
        avatar:"",
        boards: null
      }
    },
    methods: {
      navigateTo (router) {
        this.$router.push(router)
      }
    },
   async mounted () {
      this.boards = await BoardService.getBoards()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/partials/user-page";
</style>
