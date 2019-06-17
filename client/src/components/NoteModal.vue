<template>
  <div class="modal">
    <div class="modal-wrapper">
      <div class="modal-container" v-bind:style="{background: colorNote}">
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
    name: 'NoteModal',
    data () {
      return {
        colorNote: '#fff',
        colors: [
          {id: '0', color: 'white', num: '#fff'},
          {id: '1', color: 'red', num: '#ffa1a1'},
          {id: '2', color: 'pink', num: '#ffaad5'},
          {id: '3', color: 'orange', num: '#fff2b3'},
          {id: '4', color: 'green', num: '#d6ffca'},
          {id: '5', color: 'blue', num: '#b3ecff'}
        ],
        text: ''
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
      },
      close () {
        this.$emit('close', {
          noteModal: false,
          text: ''
        })

        this.text = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/basics/base";
  @import "../styles/components/board";

</style>
