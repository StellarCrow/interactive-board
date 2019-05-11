<template>
  <div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-5">
          <h1>Мой профиль</h1>
          <div class="user-info">
            <div class="user-info__avatar">
              <img src="" alt="Avatar">
            </div>
            <div class="user-info__username">
              {{user.username}}
            </div>
            <div class="user-info__fullname">
              {{user.firstName + user.lastName}}
            </div>
            <div class="user-info__description">
              {{user.description}}
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-10 text-center">
          <h1>Доски</h1>
          <div class="boards">
              <div v-for="board in boards">
                  <div class="boards__name">
                    {{board.name}}
                  </div>
                  <a v-on:click="navigateTo({name: 'Board', params: {id: user._id, idb: board._id}})">
                    <img src="" alt="Board-image" class="boards__image">
                  </a>
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
        user: null,
        boards: null
      }
    },
    methods: {
      navigateTo (router) {
        this.$router.push(router)
      }
    },
   async mounted () {
      const uid = this.$store.state.route.params.id;
      const response = await BoardService.getBoards(uid);
      console.log(response);
      this.boards = response.data.boards;
      this.user = response.data.user;
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/partials/user-page";
</style>
