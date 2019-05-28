<template>
  <div class="user-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-5 text-center">
          <div class="d-flex justify-content-center">
            <h1>Мой профиль</h1>
            <div>
              <a><img class="icon" title="Изменить профиль" src="@/assets/icons/026-setting.png" alt='Settings'></a>
            </div>
          </div>

          <div class="user-info">
            <div class="user-info__avatar">
              <img src="@/assets/icons/002-user.png" alt="Avatar">
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
      <div class="row">
        <div class="col-12">
          <hr>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-10 text-center">
          <h1>Доски</h1>
          <div class="d-flex justify-content-center">
            <div class="board" v-for="(board, index) in boards" v-bind:key="board._id">
              <div class="d-flex justify-content-between board__top">
                <div class="board__name">
                  {{board.name}}
                  <span class="board__public" v-if="board.is_public">
                    (Публичная)
                  </span>
                  <span class="board__public" v-else>
                    (Приватная)
                  </span>
                </div>
                <a @click="deleteBoard(board._id, index)"><img class="icon" title="Удалить доску"
                                                        src="@/assets/icons/trash.png" alt="Delete Board"></a>
              </div>
              <div class="board__bottom">
                <a v-on:click="navigateTo({name: 'Board', params: {id: user._id, idb: board._id}})">
                  Cсыль на доску
                  <img src="" alt="Board-image" class="board__image">
                </a>
              </div>
            </div>
            <button class="button-add" title="Добавить доску" v-on:click="createBoard()">+</button>
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
      navigateTo(router) {
        this.$router.push(router)
      },
      async createBoard() {
        let userId = this.$store.state.user._id;
        const newId = await BoardService.createBoard(userId);
        console.log(newId.data.boardId);
        this.$router.push({name: 'Board', params: {id: userId, idb: newId.data.boardId}});
      },
      async deleteBoard(boardId, index) {
        this.boards.splice(index, 1);
        const response = await BoardService.deleteBoard(boardId);
        console.log(response.data.board);
      }
    },
    async mounted() {
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
