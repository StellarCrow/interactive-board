<template>
    <div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-3 text-center">
            <h1>Настройки</h1>
          </div>
        </div>
        <div class="row">
          <div class="col-5">
            <div class="space text-center">
              <div class="space__title">
                <h3>Аватарка</h3>
              </div>
              <div class="space__images">
                <div class="d-flex justify-content-center">
                  <div class="space__container">
                    <input type="radio" name="avatar" value="" id="avatar1" v-model="avatar" hidden>
                    <label for="avatar1" class="label-avatar label-avatar-1">1</label>
                  </div>
                  <div class="space__container">
                    <input type="radio" name="avatar" value="" id="avatar2" v-model="avatar" hidden>
                    <label for="avatar1" class="label-avatar label-avatar-1">2</label>
                  </div>
                  <div class="space__container">
                    <input type="radio" name="avatar" value="" id="avatar3" v-model="avatar" hidden>
                    <label for="avatar1" class="label-avatar label-avatar-1">3</label>
                  </div>
                </div>
                <div class="d-flex justify-content-center">
                  <div class="space__container">
                    <input type="radio" name="avatar" value="" id="avatar4" v-model="avatar" hidden>
                    <label for="avatar1" class="label-avatar label-avatar-1">4</label>
                  </div>
                  <div class="space__container">
                    <input type="radio" name="avatar" value="" id="avatar5" v-model="avatar" hidden>
                    <label for="avatar1" class="label-avatar label-avatar-1">5</label>
                  </div>
                  <div class="space__container">
                    <input type="radio" name="avatar" value="" id="avatar6" v-model="avatar" hidden>
                    <label for="avatar1" class="label-avatar label-avatar-1">6</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-5">
            <div class="space">
              <div class="space__name">
                <input type="text" :value="username" :placeholder="username">
              </div>
              <div class="space__about">
                <textarea maxlength="100%" v-text="description" :placeholder="description"></textarea>
              </div>
            </div>
          </div>
          <div class="col-2">
            <button @click="saveProfile" class="button-add">Сохранить</button>
            <div> {{savedMessage}}</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

  import BoardService from '../services/UsersService';

    export default {
        name: "UserSettings",
      data() {
          return {
            username: '',
            fullName: '',
            email: '',
            password: '',
            description: '',
            avatar: '',
          }
      },
      async mounted() {
        const uid = this.$store.state.route.params.id;
        let user = await BoardService.getUser(uid);
        this.username = user.data.username;
        this.email = user.data.email;
        this.description = user.data.description;
        this.password = user.data.password;
      }
    }
</script>

<style lang="scss" scoped>
  @import "../styles/basics/base";
</style>
