<template>
  <div class="note-modal">
    <div class="note-modal-wrapper">
      <div class="note-modal-container" v-bind:style="{background: colorNote}">
        <div class="container">
          <div class="row">
            <div class="col-5">
              <h5>Создать заметку</h5>
            </div>
            <div class="col-7">
              <div class="note-modal__colors">
                <div class="d-flex justify-content-center">
                  <div v-for="color in colors" :key="color.id">
                    <input type="radio" name="color" v-model="colorNote" class="note-modal__color" :value="color.num"
                           v-bind:id="color.id">
                    <label class="color-label" :for="color.id" :style="{background: color.num}"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-content-center mb-3">
            <div class="col-12">
              <div class="note-modal__text">
                <textarea name="note-text" id="note-text" cols="30" rows="5" placeholder="Введите текст..."
                          maxlength="500" v-model="text"></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="d-flex justify-content-center">
                <button @click="save">Сохранить</button>
                <button @click="save" class="button-cancel ml-3">Закрыть</button>
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
    name: "NoteModal",
    data() {
      return {
        colorNote: '#fff',
        colors: [
          {id: "0", color: "white", num: "#fff"},
          {id: "1", color: "red", num: "#ff0000"},
          {id: "2", color: "pink", num: "#cc0066"},
          {id: "3", color: "orange", num: "#ff9900"},
          {id: "4", color: "green", num: "#33cc33"},
          {id: "5", color: "blue", num: "#33ccff"}
        ],
        text: ""
      }
    },
    methods: {
      save: function () {
        this.$emit('close', {
          noteModal: false,
          text: this.text,
          color: this.colorNote
        })

        this.text = "";
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/basics/base";

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
    width: 45vw;
    margin: 0 auto;
    padding: 3% 5%;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
  }

  .color-label {
    @include border-radius(50%, 50%);
    width: 30px;
    height: 30px;
    margin-left: 0.5em;
    border: 1px solid black;

    :first-child {
      margin-left: 0;
    }

    &:hover {
      cursor: pointer;
      filter: grayscale(50%);
    }
  }

</style>
