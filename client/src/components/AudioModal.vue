<template>
  <div class="modal">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-5 text-center">
              <h5>Добавить аудио</h5>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-6">
              <input type="text" placeholder="Название" maxlength="50" v-model="name">
            </div>
            <div class="col-6">
              <input type="file" accept="audio/mp3" id="input-audio" class="input-file"
                     @change="onFileChange($event.target.files)">
              <label for="input-audio">Выбрать файл</label>
            </div>
          </div>
          <div v-if="audioFile !== null">
            <div class="row">
              <div class="col-12">
                <hr>
              </div>
            </div>
            <div class="row">
              <div class="col-4 text-center">
                <div class="image-style">
                  <input type="radio" name="image-type" id="icon-green" class="image-type" v-model="audioType"
                         value="icon-green">
                  <label class="image-style__name" for="icon-green">Green</label>
                  <div class="image-style__img">
                    <img src="../assets/icons/music-icon-green.png" alt="Ваше изображение">
                  </div>
                  <div class="image-style__title"> {{name}}</div>
                </div>
              </div>
              <div class="col-4 text-center">
                <div class="image-style">
                  <input type="radio" name="image-type" id="icon-pink" class="image-type" v-model="audioType"
                         value="icon-pink">
                  <label class="image-style__name" for="icon-pink">Pink</label>
                  <div class="image-style__img">
                    <img src="../assets/icons/music-icon-pink.png" alt="Ваше изображение">
                  </div>
                  <div class="image-style__title"> {{name}}</div>
                </div>
              </div>
              <div class="col-4 text-center">
                <div class="image-style">
                  <input type="radio" name="image-type" id="icon-yellow" class="image-type" v-model="audioType"
                         value="icon-yellow">
                  <label class="image-style__name" for="icon-yellow">Yellow</label>
                  <div class="image-style__img">
                    <img src="../assets/icons/music-icon-yellow.png" alt="Ваше изображение">
                  </div>
                  <div class="image-style__title"> {{name}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="d-flex justify-content-center">
                <button @click="save">Сохранить</button>
                <button @click="close" class="button-cancel ml-3">Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "AudioModal",
      data() {
          return  {
            audioFile: null,
            audioType: 'icon-green',
            name: 'Название'
          }
      },
      methods: {
        close: function() {
          this.$emit('close', {
            imageModal: false,
            audioFile: null
          });
        },
        save: function () {
          this.$emit('close', {
            imageModal: false,
            audioFile: this.audioFile,
            audioType: this.audioType,
            name: this.name
          });
        },
        onFileChange(file) {
          let audioFile = file[0];

          if(file.length > 0) {
            this.audioFile = audioFile;
          }
        }
      }
    }
</script>

<style lang="scss" scoped>
  @import "../styles/basics/base";
  @import "../styles/components/board";

  .input-file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .input-file + label {
    @include border-radius(1.5em);
    @include transition();
    border: 1px solid $tertiary-color;
    padding: 0.5em 1em;
    font-size: $text;
    display: inline-block;
  }

  .input-file:focus + label,
  .input-file + label:hover {
    cursor: pointer;
    background-color: $tertiary-color;
  }

  .image-type:checked + label {
    color: $tertiary-color
  }

  .image-style {
    &__name {
      font-weight: $medium;
      margin-bottom: 0.5em;

      &:hover {
        cursor: pointer;
      }
    }

    &__img img {
      width: 100%;
      height: auto;
    }

    &__title {
      font-weight: $light;
      font-size: $text;
      color: $gray-color--dark;
    }

  }


</style>
