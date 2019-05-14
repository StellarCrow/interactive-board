<template>
  <div>
    <div class="container-fluid">
      <div class="row justify-content-center mb-3">
        <div class="col-4 text-center">
          <div class="board-name">
            <input type="text" class="input-large" :placeholder="bname" name="board-name" v-model="bname">
          </div>
        </div>
      </div>
      <div class="row p-0">
        <div class="col-2 p-0">
          <ul class="menu">
            <li class="menu__item hue"><a>Добавить заметку</a></li>
            <li class="menu__item hue"><a>Добавить фото</a></li>
            <li class="menu__item hue"><a>Добавить аудио</a></li>
            <li class="menu__item hue"><a>Добавить документ</a></li>
          </ul>
        </div>
        <div class="col-8">
          <div class="konva-container">
            <v-stage :config="configKonva">
              <v-layer ref="layer">
                <v-circle :config="configCircle"></v-circle>
              </v-layer>
            </v-stage>
          </div>
        </div>
        <div class="col-2">
          <div class="">
            <div class="filter mb-4">
              <label for="select-filter">Отображать только: </label>
              <select name="filter" id="select-filter" v-model="filter">
                <option value="all" selected="selected">Всё</option>
                <option value="images">Изображения</option>
                <option value="text">Текст</option>
                <option value="audio">Аудио</option>
              </select>
            </div>
            <div class="public-mark mb-4">
              Публичная:
              <input type="checkbox" v-model="is_public">
            </div>
            <button>Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //import BoardService from '../../services/BoardService';
  let width = 800;
  let height = 400;
  export default {
    name: "Board",
    data() {
      return {
        bname: 'Без названия',
        is_public: false,
        filter: 'all',
        configKonva: {
          container: "konva-container",
          width: width,
          height: height
        },
        configCircle: {
          x: 100,
          y: 100,
          radius: 70,
          fill: 'red',
          stroke: 'black',
          strokeWidth: 4,
          draggable: true
        }
      }
    },
    async mounted() {
      // let stage = this.$ref.stage.getStage();
      // stage.style.border = '1px solid black';
      // const id = this.$store.state.route.params.idb;
      // const boardData = BoardService.getBoardData(id);
      // this.bname = boardData.name;
      // this.is_public = boardData.is_public;
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>
  @import "../styles/components/board";
</style>
