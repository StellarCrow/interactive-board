<template>
  <div>
    <div class="container-fluid">
      <div class="row justify-content-center mb-3">
        <div class="col-3">
          <ul class="d-flex justify-content-center pt-4 mb-0">
            <div v-for="color in colorsStage" :key="color.id">
              <input type="radio" name="stage" v-model="colorStage" :value="color.num"
                     v-bind:id="color.id">
              <label class="color-label" :for="color.id" :style="{background: color.num }"></label>
            </div>
          </ul>
        </div>
        <div class="col-4 text-center">
          <div class="board-name">
            <input type="text" class="input-large" name="board-name" maxlength="25" :placeholder="bname"
                   v-model="bname">
          </div>
        </div>
        <div class="col-3">
          <ul class="d-flex justify-content-center pt-4 mb-0">
            <li>
              <input type="radio" id="color-dots" v-model="colorStage" :value="'../assets/textures/dots.jpg'">
              <label class="color-label color-label--dots" for="color-dots"></label>
            </li>
            <li>
              <input type="radio" id="color-dots2" v-model="colorStage" :value="'../assets/textures/dots2.jpg'">
              <label class="color-label color-label--dots2" for="color-dots2"></label>
            </li>
            <li>
              <input type="radio" id="color-grid" v-model="colorStage" :value="'../assets/textures/grid.png'">
              <label class="color-label color-label--grid" for="color-grid"></label>
            </li>
            <li>
              <input type="radio" id="color-line" v-model="colorStage" :value="'../assets/textures/line.jpg'">
              <label class="color-label color-label--line" for="color-line"></label>
            </li>
          </ul>
        </div>
      </div>
      <div class="row p-0">
        <div class="col-2 p-0">
          <ul class="menu">
            <li class="menu__item hue"><a v-on:click="noteModal = true">Добавить заметку</a></li>
            <li class="menu__item hue"><a v-on:click="imageModal = true">Добавить фото</a></li>
            <li class="menu__item hue"><a>Добавить аудио</a></li>
            <li class="menu__item hue"><a>Добавить документ</a></li>
          </ul>
        </div>
        <div class="col-8">
          <div class="konva-container" ref="container" v-bind:style="stageStyle">
            <v-stage :config="stageSize" ref="stage" @mousedown="handleStageMouseDown">
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
            <button @click="saveBoard">Сохранить</button>
            <div> {{savedMessage}}</div>
            <button @click="test">TestCoordinates</button>
          </div>
        </div>
      </div>
    </div>
    <note-modal v-show="noteModal" @close="noteDataFromModal"></note-modal>
    <image-modal v-show="imageModal" @close="imageDataFromModal"></image-modal>
  </div>
</template>

<script>
  import NoteModal from './NoteModal';
  import ImageModal from './ImageModal'
  import BoardService from "../services/BoardService";

  let width = window.innerWidth;
  let height = window.innerHeight;
  export default {
    name: "Board",
    components: {NoteModal, ImageModal},
    data() {
      return {
        bname: 'Без названия',
        colorStage: "#fff",
        colorsStage: [
          {id: "6", color: "white", num: "#fff"},
          {id: "7", color: "black", num: "#000"},
          {id: "8", color: "green", num: "#7bf3d8"},
          {id: "9", color: "pink", num: "#f37bae"},
          {id: "10", color: "orange", num: "#f3bc7b"},
          {id: "11", color: "blue", num: "#33ccff"}
        ],
        is_public: false,
        noteModal: false,
        imageModal: false,
        filter: 'all',
        savedMessage: "",
        notes: [],
        notesLayer: null,
        stageSize: {
          width: width,
          height: height
        },
        selectedShapeName: ''
      }
    },
    created: function () {
      window.addEventListener('resize', this.changeRect);
      this.changeRect();
    },
    computed: {
      stageStyle: function () {
        if (this.colorStage.length > 8) {
          console.log('url("' + this.colorStage + '")');
          return {height: '70vh', background: `url("${this.colorStage}")`}
        }
        else return {height: '70vh', background: this.colorStage}
      }
    },
    methods: {
      test() {
        const stage = this.$refs.stage.getNode();
        this.notes.forEach(function (note) {
          // console.log(note.children[0].getAbsolutePosition().x, note.children[0].getAbsolutePosition().y);
          //console.log(note.getAttr('x'), note.getAttr('y'));
          console.log(Date.now().toString());
        })
      },
      async saveBoard() {
        let notesUpdated = [];
        const id = this.$store.state.route.params.idb;

        this.notes.forEach(function (note) {
          let updatedNote = {};
          updatedNote.coordinates = [note.children[0].getAbsolutePosition().x, note.children[0].getAbsolutePosition().y];
          updatedNote.id = note.id();
          notesUpdated.push(updatedNote);
        });

        let data = {
          idb: id,
          is_public: this.is_public,
          name: this.bname,
          background: this.colorStage,
          notes: notesUpdated
        };

        const response = await BoardService.saveBoard(data);
        console.log(response.data);
        this.savedMessage = "Сохранено " + this.getCurrentDate();
      },
      getCurrentDate() {
        let date = new Date();
        let yyyy = date.getFullYear();
        let mmm = date.getMonth() + 1;
        let ddd = date.getDate();
        let hh = date.getHours();
        let mm = date.getMinutes();
        let ss = date.getSeconds();

        return `${ddd}/${mmm}/${yyyy} ${hh}:${mm}:${ss}`
      },
      changeRect() {
        const container = this.$refs.container;
        if (!container)
          return;

        const height = container.offsetHeight;
        const width = container.offsetWidth;

        console.log(height, width);
        this.stageSize.width = width;
        this.stageSize.height = height;
      },
      boundaries(pos) {
        const stage = this.$refs.stage.getNode();

        let newY, newX;
        if (pos.y < 0) {
          newY = 0;
        } else if (pos.y > stage.height()) {
          newY = stage.height()
        } else
          newY = pos.y;

        if (pos.x < 0) {
          newX = 0;
        } else if (pos.x > stage.width()) {
          newX = stage.width()
        } else
          newX = pos.x;

        return {
          x: newX,
          y: newY,
        }

      },
      async noteDataFromModal(data) {
        this.noteModal = data.noteModal;
        if (data.text === "") return;

        const id = this.$store.state.route.params.idb;
        const newNote = await BoardService.createNote({
          boardId: id,
          text: data.text,
          color: data.color,
          coordinates: [20, 20]
        });
        console.log(newNote.data);
        let noteData = {
          id: newNote.data.id,
          text: data.text,
          color: data.color,
          coordinates: [20, 20]
        };

        this.createNote(noteData);
      },
      async imageDataFromModal(data) {
        const id = this.$store.state.route.params.idb;
        const uid = this.$store.state.route.params.id;

        this.imageModal = data.imageModal;
        if (data.formData == null) return;
        let image = {};
        image.imageType = data.imageType;
        image.color = data.color;
        image.name = data.name;

        // const newImage = await BoardService.createImage({
        //   imageProp: image,
        //   photo: data.formData,
        //   bid: id,
        //   coordinates: [40, 20],
        // }, config);

        const newImage = await BoardService.uploadImage(data.formData, uid);
      },
      createNote(data) {
        const stage = this.$refs.stage.getNode();
        let layer = this.notesLayer;
        let group = new Konva.Group({
          draggable: true,
          name: 'noteGroup',
          id: data.id
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
        this.notes.push(group);
        stage.add(layer);
      },
      parseDataFromServer(data) {
        let notes = data.notesArray;
        let board = data.board;
        this.bname = board.bname;
        this.is_public = board.is_public;
        this.colorStage = board.background;
        //Notes

        this.notesLayer = new Konva.Layer();

        for (let i = 0; i < notes.length; i++) {
          console.log('Length: ' + notes.length);
          this.createNote(notes[i]);
        }

      },
      handleStageMouseDown(e) {
        const stage = this.$refs.stage.getNode();
        if (e.target === stage) {
          console.log("Clicked on stage!");
          stage.find('Transformer').destroy();
        }

        console.log(stage.find('Transformer'));
        stage.find('Transformer').destroy();

        let tr = new Konva.Transformer({
          node: e.target.getParent()
        });
        let layer = e.target.getLayer();
        console.log(e.target.getLayer());
        layer.add(tr);
      }
    },
    async mounted() {
      this.changeRect();
      const id = this.$store.state.route.params.idb;
      const boardData = await BoardService.getBoardData(id);
      if (boardData.data.board == null) return;
      console.log(boardData);
      //Just Notes for now
      this.parseDataFromServer(boardData.data);
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/components/board";
</style>
