<template>
  <div class="note-modal">
    <div class="note-modal-wrapper">
      <div class="note-modal-container">
        <div class="container">
          <div class="row justify-content-center">
            <h3>Добавить изображение</h3>
          </div>
          <div class="row">
            <div class="col-12">
              <hr>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-6">
              <input type="text" placeholder="Название" maxlength="20" v-model="name">
            </div>
            <div class="col-6">
              <input type="file" :name="uploadFileName" accept="image/jpeg" class="input-file"
                     id="input-file"
                     @change="onFileChange($event.target.files)">
              <label for="input-file">Выбрать файл</label>
              <h5>{{errorText}}</h5>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <hr>
            </div>
          </div>
          <div v-if="image !== null">
            <div class="row">
              <div class="col-4 text-center">
                <div class="image-style">
                  <input type="radio" name="image-type" id="simple" class="image-type" v-model="imageType"
                         value="simple">
                  <label class="image-style__name" for="simple">Simple</label>
                  <div class="image-style__img">
                    <img :src="image" alt="Ваше изображение">
                  </div>
                </div>
              </div>
              <div class="col-4 text-center">
                <div class="image-style">
                  <input type="radio" name="image-type" id="polaroid" class="image-type" v-model="imageType"
                         value="polaroid">
                  <label class="image-style__name" for="polaroid">Polaroid</label>
                  <div class="image-style__polaroid">
                    <div class="image-style__img">
                      <img :src="image" alt="Ваше изображение">
                    </div>
                    <div class="image-style__title">{{name}}</div>
                  </div>
                </div>
              </div>
              <div class="col-4 text-center">
                <div class="image-style">
                  <input type="radio" name="image-type" id="frame" class="image-type" v-model="imageType" value="frame">
                  <label class="image-style__name" for="frame">Frame</label>
                  <div class="image-style__frame" v-bind:style="{background: colorFrame}">
                    <div class="image-style__img">
                      <img :src="image" alt="Ваше изображение">
                    </div>
                  </div>
                  <div class="image-style__colors">
                    <ul class="d-flex justify-content-center">
                      <li v-for="color in colors" :key="color.id">
                        <input type="radio" name="color" v-model="colorFrame" class="image-style__color" :value="color.num"
                               v-bind:id="color.id">
                        <label class="color-label color-label--small" :for="color.id" :style="{background: color.num}"></label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="d-flex justify-content-center">
              <button @click="save">Сохранить</button>
              <button @click="save" class="button-cancel ml-3">Закрыть</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ImageModal",
    data() {
      return {
        name: "Название",
        imageType: "simple",
        image: null,
        colorFrame: "#fff",
        colors: [
          {id: "12", color: "white", num: "#fff"},
          {id: "13", color: "red", num: "#ff0000"},
          {id: "14", color: "pink", num: "#cc0066"},
          {id: "15", color: "orange", num: "#ff9900"},
          {id: "16", color: "green", num: "#33cc33"},
          {id: "17", color: "blue", num: "#33ccff"}
        ],
        uploadFileName: "photo",
        errorText: "",
        errorDialog: null,
        maxSize: 5120,
        formData: null
      }
    },
    props: {
      // Use "value" here to enable compatibility with v-model
      value: Object,
    },
    methods: {
      reset() {
        // reset form to initial state
        this.errorText = "";
        this.formData = null;
        this.errorDialog = null;
        this.image = null;
      },
      save: function () {
        this.$emit('close', {
          imageModal: false,
          formData: this.formData,
          imageType: this.imageType,
          color: this.colorFrame,
          name: this.name
        });
      },
      onFileChange(file) {
        const {maxSize} = this;
        let imageFile = file[0];

        //check if user actually selected a file
        if (file.length > 0) {
          let size = imageFile.size / maxSize / maxSize;
          if (size > 1) {
            // check whether the size is greater than the size limit
            this.errorDialog = true;
            this.errorText = 'Your file is too big! Please select an image under 5MB'
          } else {
            // Append file into FormData & turn file into image URL
            let formData = new FormData();
            let imageURL = URL.createObjectURL(imageFile);
            formData.append('photo', imageFile);
            this.formData = formData;
            this.image = imageURL;
          }
        }
      }
    },
    mounted() {
      this.reset();
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/basics/base";
  @import "../styles/components/board";

  .note-modal {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .note-modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .note-modal-container {
    width: 50vw;
    margin: 0 auto;
    padding: 3% 5%;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
  }

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
      border: 1px solid $gray-color--light;
      width: 100%;
      height: auto;
    }

    &__polaroid, &__frame {
      border: 1px solid $gray-color--light;
    }

    &__polaroid {
      padding: 0.5em;
    }

    &__title {
      font-weight: $light;
      font-size: $text;
      color: $gray-color--dark;
    }

    &__frame {
      padding: 1em;
      margin-bottom: 0.6em;
    }
  }
</style>
