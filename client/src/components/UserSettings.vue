<template>
  <div>
    <div class="container">
      <div class="row justify-content-center mb-4">
        <div class="col-7 text-center">
          <h1>Настройки профиля {{username}}</h1>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-5">
          <div class="note text-center mb-4">
            <div class="note__title">
              <h3>Выберите аватарку</h3>
            </div>
            <div class="note__images">
              <div class="d-flex justify-content-center mb-4">
                <div class="note__container">
                  <div class="note__item">
                    <input type="radio" name="avatar" :value="'boy-1'" id="avatar1" v-model="avatar" hidden>
                    <label for="avatar1" class="label-avatar label-avatar-1"></label>
                  </div>
                </div>
                <div class="note__container">
                  <div class="note__item">
                    <input type="radio" name="avatar" :value="'boy-2'" id="avatar2" v-model="avatar" hidden>
                    <label for="avatar2" class="label-avatar label-avatar-2"></label>
                  </div>
                </div>
                <div class="note__container">
                  <div class="note__item">
                    <input type="radio" name="avatar" :value="'boy-3'" id="avatar3" v-model="avatar" hidden>
                    <label for="avatar3" class="label-avatar label-avatar-3"></label>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-center">
                <div class="note__container">
                  <div class="note__item">
                    <input type="radio" name="avatar" :value="'girl-1'" id="avatar4" v-model="avatar" hidden>
                    <label for="avatar4" class="label-avatar label-avatar-4"></label>
                  </div>
                </div>
                <div class="note__container">
                  <div class="note__item">
                    <input type="radio" name="avatar" :value="'girl-2'" id="avatar5" v-model="avatar" hidden>
                    <label for="avatar5" class="label-avatar label-avatar-5"></label>
                  </div>
                </div>
                <div class="note__container">
                  <div class="note__item">
                    <input type="radio" name="avatar" :value="'girl-3'" id="avatar6" v-model="avatar" hidden>
                    <label for="avatar6" class="label-avatar label-avatar-6"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="note__buttons d-flex justify-content-center">
            <div>
              <button @click="saveProfile">Сохранить</button>
              <div> {{savedMessage}}</div>
            </div>
            <div class="ml-3">
              <button @click="navigateTo({name: 'UserPage', params: {id: id}})" class="button-cancel">Назад</button>
            </div>
          </div>
        </div>
        <div class="col-5">
          <div class="note">
            <div class="note__name d-flex">
              <label for="name" class="align-self-end">Имя: </label>
              <input type="text" maxlength="50" id="name" v-model="fullName" :placeholder="fullName">
            </div>
            <div class="note__about">
              <label for="textarea" class="m-0">О себе:</label>
              <textarea maxlength="500" rows="16" id="textarea" v-model="description" :placeholder="description"></textarea>
            </div>
          </div>
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
        savedMessage: '',
        id: ''
      }
    },
    methods: {
      async saveProfile() {
        let message = await BoardService.updateUser({
          id: this.id,
          fullName: this.fullName,
          description: this.description,
          avatar: this.avatar
        });
        this.savedMessage = message.data.message;
      },
      navigateTo(router) {
        this.$router.push(router)
      },
    },
    async mounted() {
      this.id = this.$store.state.route.params.id;
      let user = await BoardService.getUser(this.id);
      this.fullName = user.data.fullName;
      this.username = user.data.username;
      this.email = user.data.email;
      this.description = user.data.description;
      this.password = user.data.password;
      this.avatar = user.data.avatar;
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/components/userSettings";
</style>
