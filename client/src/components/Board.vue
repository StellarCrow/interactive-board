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
          <div class="konva-container" ref="container" v-bind:style="{height: '70vh'}">
            <v-stage :config="stageSize" ref="myStage">
              <v-layer>
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
  let width = window.innerWidth;
  let height = window.innerHeight;
  export default {
    name: "Board",
    data() {
      return {
        bname: 'Без названия',
        is_public: false,
        filter: 'all',
        stageSize: {
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
          draggable: true,
          dragBoundFunc(pos) {
            console.log(pos);

            let newY, newX;
            if(pos.y < 0){
              newY = 0;
            } else
              newY = pos.y;

            if(pos.x < 0){
              newX = 0;
            } else
              newX = pos.x;

            return {
              x: newX,
              y: newY,
            }
          }
        }
      }
    },
    created: function () {
      window.addEventListener('resize', this.changeRect);
      this.changeRect();
    },
    methods: {
      changeRect: function () {
        const container = this.$refs.container;
        if(!container)
          return;

        const height = container.offsetHeight;
        const width = container.offsetWidth;

        console.log(height, width);
        this.stageSize.width = width;
        this.stageSize.height = height;
      }
    },
    async mounted() {
      this.changeRect();
      // const id = this.$store.state.route.params.idb;
      // const boardData = BoardService.getBoardData(id);
      // this.bname = boardData.name;
      // this.is_public = boardData.is_public;
    },
    computed: {

    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/components/board";
</style>
