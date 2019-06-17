<template>
  <div>
    <div class="container pt-4">
      <div class="row justify-content-center">
        <div class="col-5 text-center">
          <h1>Публичные доски</h1>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-3">
        <div class="users">
          <ul>
            <li v-for="board in boards" v-bind:key="board._id">
              <div class="user">
                <div class="d-flex justify-content-between">
                  <div class="user__avatar">
                    <img src="../assets/icons/avatars/boy-1.png" alt="Avatar">
                  </div>
                  <div class="user__username" @click="navigateTo({name: 'Board', params: {id: board.author._id, idb: board._id}})">
                    {{board.name}}
                    {{board.author.username}}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BoardService from '../services/BoardService'
  export default {
    name: 'UsersList',
    data () {
      return {
        boards: []
      }
    },
    methods: {
      navigateTo (router) {
        this.$router.push(router)
      }
    },
    async mounted () {
      let boards = await BoardService.getPublicBoards()
      this.boards = boards.data.boards
    }

  }
</script>

<style lang="scss" scoped>
  @import "../styles/basics/base";
  @import "../styles/components/userList";

</style>
