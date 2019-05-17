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
            <li class="menu__item hue"><a v-on:click="noteModal = true">Добавить заметку</a></li>
            <li class="menu__item hue"><a>Добавить фото</a></li>
            <li class="menu__item hue"><a>Добавить аудио</a></li>
            <li class="menu__item hue"><a>Добавить документ</a></li>
          </ul>
        </div>
        <div class="col-8">
          <div class="konva-container" ref="container" v-bind:style="{height: '70vh'}">
            <v-stage :config="stageSize" ref="stage"></v-stage>
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
            <button @click="saveBoard">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
    <note-modal v-show="noteModal" @close="noteDataFromModal"></note-modal>
  </div>
</template>

<script>
  import NoteModal from './NoteModal';
  import BoardService from "../services/BoardService";
  //import BoardService from '../../services/BoardService';


  let width = window.innerWidth;
  let height = window.innerHeight;
  export default {
    name: "Board",
    components: { NoteModal},
    data() {
      return {
        bname: 'Без названия',
        is_public: false,
        noteModal: false,
        filter: 'all',
        notes: [],
        stageSize: {
          width: width,
          height: height
        }
      }
    },
    created: function () {
      window.addEventListener('resize', this.changeRect);
      this.changeRect();
    },
    methods: {
      saveBoard() {

      },
      changeRect: function () {
        const container = this.$refs.container;
        if(!container)
          return;

        const height = container.offsetHeight;
        const width = container.offsetWidth;

        console.log(height, width);
        this.stageSize.width = width;
        this.stageSize.height = height;
      },
      boundaries: function (pos) {
        const stage = this.$refs.stage.getNode();

        let newY, newX;
        if(pos.y < 0){
          newY = 0;
        } else if(pos.y > stage.height()) {
          newY = stage.height()
        } else
          newY = pos.y;

        if(pos.x < 0){
          newX = 0;
        }else if(pos.x > stage.width()) {
          newX = stage.width()
        } else
          newX = pos.x;

        return {
          x: newX,
          y: newY,
        }

      },
      noteDataFromModal: function(data) {
        this.noteModal = data.noteModal;
        if(data.text === "") return;
        let noteData = {
          text: data.text,
          color: data.color,
          coordinates: [20, 20]
        };
        this.createNote(noteData);

        const id = this.$store.state.route.params.idb;
        const newNote = BoardService.createNote({
          boardId: id,
          text: data.text,
          color: data.color,
          coordinates: [20, 20]
        })
      },
      createNote: function (data) {
        const stage = this.$refs.stage.getNode();
        let layer = new Konva.Layer();
        let group = new Konva.Group({
          draggable: true,
          name: 'noteGroup'
        });

        let noteText = new Konva.Text({
          x: data.coordinates[0],
          y: data.coordinates[1],
          name: 'noteText',
          text: data.text,
          fontSize: 14,
          fontStyle: 200,
          fontFamily: 'Calibri',
          fill: '#000',
          width: 150,
          padding: 20,
          align: 'center'
        });

        let rect = new Konva.Rect({
          x: data.coordinates[0],
          y: data.coordinates[1],
          name: 'noteRect',
          stroke: "#e5e5e5",
          strokeWidth: 1,
          fill: data.color,
          width: noteText.width(),
          height: noteText.height(),
          shadowColor: '#e5e5e5',
          shadowBlur: 5,
          shadowOpacity: 0.5
        });

        //let tr = new Konva.Transformer();

        group.add(rect);
        group.add(noteText);
        //tr.attachTo(group);
        layer.add(group);
        //layer.add(tr);
        this.notes.push(layer);
        stage.add(layer);
      },
      parseDataFromServer: function (data) {
        //Just Notes Array arr[obj, obj]
        const stage = this.$refs.stage.getNode();
        for(let i = 0; i < data.length; i++) {
          this.createNote(data[i]);
        }

      }
    },
    async mounted() {
      this.changeRect();
      const id = this.$store.state.route.params.idb;
      const boardData = await BoardService.getBoardData(id);
      //Just Notes for now
      this.parseDataFromServer(boardData.data);
    },
    computed: {

    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/components/board";
</style>
