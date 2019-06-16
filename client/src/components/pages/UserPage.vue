<template>
  <div class="user-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-5 text-center">
          <div>
            <div class="">
              <a>
                <img class="icon" title="Изменить профиль" src="@/assets/icons/026-setting.png" alt='Settings'
                     @click="navigateTo({name: 'UserSettings', params: {id: user._id}})">
              </a>
            </div>
            <div>
              <h1>{{username}}</h1>
            </div>

            <div class="user-info">
              <div class="user-info__avatar">
                <img :src='pathToAvatar' alt="Avatar">
              </div>
              <div class="user-info__fullname">
                {{fullName}}
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 align-self-center">
            <div class="user-info">
              <div class="user-info__desc">
                {{description}}
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
        <div class="col-2 text-center mb-4">
          <h1>Доски</h1>
          <button class="button-add-board" title="Добавить доску" v-on:click="createBoard()">+</button>
        </div>
      </div>

      <div class="row mb-5" v-for="n in cycle">
        <div class="col-12">
          <div class="d-flex justify-content-start">
            <div class="board text-center" v-for="(board, index) in boards.slice((n - 1) * 4, (n - 1) * 4 + 4)" v-bind:key="board._id">
              <!--<div class="board__pin">-->
                <!--<img src="../../assets/icons/note-pin-icon.png" alt="Pin">-->
              <!--</div>-->
              <div class="board__name" v-on:click="navigateTo({name: 'Board', params: {id: user._id, idb: board._id}})">
                {{board.name}}
              </div>
              <div class="board__image">
                <img src="../../assets/images/board.png" alt="board-image">
              </div>
              <div class="d-flex justify-content-around">
                <div class="board__public">
                  <div v-if="board.is_public">
                    <img title="Публичная" class="icon" src="../../assets/icons/public.png" alt="Public">
                  </div>
                  <div v-else>
                    <img title="Приватная"  class="icon" src="../../assets/icons/private.png" alt="Private">
                  </div>
                </div>
                <div class="board__delete">
                  <a @click="deleteBoard(board._id, board)"><img class="icon" title="Удалить доску"
                                                                 src="@/assets/icons/trash.png" alt="Delete Board"></a>
                </div>
              </div>
            </div>
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
        boards: null,
        username: '',
        fullName: '',
        description: '',
        pathToAvatar: '',
        cycle: 0
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
      async deleteBoard(boardId, board) {
        let index = this.boards.indexOf(board);
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
      this.cycle = Math.ceil(this.boards.length / 4);
      let user = response.data.user;
      this.user = user;
      this.pathToAvatar = require("@/assets/icons/avatars/" + user.avatar + ".png");
      this.username = user.username;
      this.description = user.description;
      this.fullName = user.fullName;
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/partials/user-page";
</style>
