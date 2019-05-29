<template>
  <div class="board-section">
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
              <v-layer ref="layer">
                <v-transformer ref="transformer" />
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
        colorStage: "#fcfcfc",
        colorsStage: [
          {id: "6", color: "white", num: "#fcfcfc"},
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
        images: [],
        stageLayer: null,
        stageSize: {
          width: width,
          height: height
        },
        selectedShapeId: ''
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
          console.log(note.children[0].getAbsolutePosition().x, note.children[0].getAbsolutePosition().y);
          console.log(note.getAttr('x'), note.getAttr('y'));
          console.log(note.getAbsolutePosition());
          console.log(note.rotation(), note.scaleX(), note.scaleY());
        })
      },
      async saveBoard() {
        let notesUpdated = [];
        let imagesUpdated = [];
        const id = this.$store.state.route.params.idb;

        this.notes.forEach(function (note) {
          let updatedNote = {};
          updatedNote.coordinates = [note.children[0].getAbsolutePosition().x, note.children[0].getAbsolutePosition().y];
          updatedNote.rotation = note.rotation();
          updatedNote.scale = [note.scaleX(), note.scaleY()];
          updatedNote.id = note.id();
          notesUpdated.push(updatedNote);
        });

        this.images.forEach(function (image) {
          let updatedImage = {};
          updatedImage.coordinates = [image.children[0].getAbsolutePosition().x, image.children[0].getAbsolutePosition().y];
          updatedImage.id = image.id();
          updatedImage.rotation = image.rotation();
          updatedImage.scale = [image.scaleX(), image.scaleY()];
          imagesUpdated.push(updatedImage);
        });

        let data = {
          idb: id,
          is_public: this.is_public,
          name: this.bname,
          background: this.colorStage,
          notes: notesUpdated,
          images: imagesUpdated
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

        this.stageSize.width = width;
        this.stageSize.height = height;
      },
      async noteDataFromModal(data) {
        this.noteModal = data.noteModal;
        if (data.text === "") return;

        const id = this.$store.state.route.params.idb;
        const newNote = await BoardService.createNote({
          boardId: id,
          text: data.text,
          color: data.color,
          coordinates: [20, 20],
          rotation: 0,
          scale: [1, 1]
        });
        console.log(newNote.data);
        let noteData = {
          id: newNote.data.id,
          text: data.text,
          color: data.color,
          coordinates: [20, 20],
          rotation: 0,
          scale: [1, 1]
        };

        this.createNote(noteData);
      },
      async imageDataFromModal(data) {
        this.imageModal = data.imageModal;
        if (data.imageFile == null) return;

        const id = this.$store.state.route.params.idb;
        let image = {};

        image.imageType = data.imageType;
        image.color = data.color;
        image.name = data.name;
        image.coordinates = [40, 20];
        image.rotation = 0;
        image.scale = [1, 1];

        let formData = new FormData();
        formData.append('photo', data.imageFile);

        await BoardService.uploadImage(formData, id)
          .then((response) => {
            if (response.data.imageId === -1) {
              return console.log("imageId -1 " + response.data.imageId);
            }
            console.log("image ID " + response.data.imageId);
            return BoardService.createImage({
              image: image,
              bid: id,
              imageId: response.data.imageId
            })
          })
          .then((response) => {
            console.log(response.data.imageLink);
            image.link = response.data.imageLink;
            image.id = response.data.media;
          });

        this.createImage(image);
      },
      createNote(data) {
        const stage = this.$refs.stage.getNode();
        let layer = this.stageLayer;
        let group = new Konva.Group({
          x: data.coordinates[0],
          y: data.coordinates[1],
          draggable: true,
          name: 'noteGroup',
          id: data.id,
          rotation: data.rotation,
          scaleX: data.scale[0],
          scaleY: data.scale[1]
          // dragBoundFunc: function (pos) {
          //   let newY, newX;
          //   if (pos.y < -50) {
          //     newY = -50;
          //   } else if (pos.y > stage.height()) {
          //     newY = stage.height()
          //   } else
          //     newY = pos.y;
          //
          //   if (pos.x < -50) {
          //     newX = -50;
          //   } else if (pos.x > stage.width()) {
          //     newX = stage.width()
          //   } else
          //     newX = pos.x;
          //
          //   return {
          //     x: newX,
          //     y: newY,
          //   }
          // }
        });

        let noteText = new Konva.Text({
          name: 'noteText',
          text: data.text,
          fontSize: 14,
          fontStyle: 200,
          fontFamily: 'Calibri',
          fill: '#000',
          width: 150,
          padding: 15,
          align: 'center'
        });

        let rect = new Konva.Rect({
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


        group.add(rect);
        group.add(noteText);
        layer.add(group);
        this.notes.push(group);
        stage.add(layer);
      },
      createImage(data) {
        const stage = this.$refs.stage.getNode();
        let layer = this.stageLayer;
        let newImage, rect;
        let group = new Konva.Group({
          x: data.coordinates[0],
          y: data.coordinates[1],
          draggable: true,
          name: 'imageGroup',
          id: data.id,
          rotation: data.rotation,
          scaleX: data.scale[0],
          scaleY: data.scale[1]
        });

        let imageObj = new Image();
        imageObj.src = data.link;

        if (data.imageType === "simple") {
          newImage = new Konva.Image({
            name: 'image',
            image: imageObj,
            width: 100,
            height: 100
          });
          console.log(newImage);
          group.add(newImage);
        }
        else if (data.imageType === 'polaroid') {

          newImage = new Konva.Image({
            x: 5,
            y: 10,
            name: 'image',
            image: imageObj,
            stroke: "#72787a",
            strokeWidth: 1,
            width: 100,
            height: 100
          });

          let imageText = new Konva.Text({
            y: newImage.height(),
            name: 'imageText',
            text: data.name,
            fontSize: 14,
            fontStyle: 200,
            fontFamily: 'Calibri',
            fill: '#000',
            padding: 20,
            align: 'center'
          });

          rect = new Konva.Rect({
            name: 'imageBack',
            stroke: "#e5e5e5",
            strokeWidth: 1,
            fill: data.color,
            width: newImage.width() + 10,
            height: newImage.height() + imageText.height()
          });

          imageText.width = rect.width;
          group.add(rect);
          group.add(newImage);
          group.add(imageText);
        }
        else if (data.imageType === 'frame') {
          newImage = new Konva.Image({
            x: data.coordinates[0] + 10,
            y: data.coordinates[1] + 10,
            name: 'image',
            image: imageObj,
            width: 100,
            height: 100
          });

          rect = new Konva.Rect({
            x: data.coordinates[0],
            y: data.coordinates[1],
            name: 'imageBack',
            stroke: "#e5e5e5",
            strokeWidth: 1,
            fill: data.color,
            width: newImage.width() + 20,
            height: newImage.height() + 20
          });

          group.add(rect);
          group.add(newImage);
        }

        layer.add(group);
        this.images.push(group);
        stage.add(layer);
      },
      handleStageMouseDown(e) {
        let selectedGroup;

        if (e.target === e.target.getStage()) {
          this.selectedShapeId = '';
          this.updateTransformer();
          return;
        }

        const clickedOnTransformer =
          e.target.getParent().className === 'Transformer';
        if (clickedOnTransformer) {
          return;
        }

        const targetId = e.target.getParent().id();
        this.stageLayer.children.forEach(function (group) {
          if(group.id() === targetId) {
            selectedGroup = group;
          }
        });

        if(selectedGroup) {
          this.selectedShapeId = targetId;
        }
        else {
          this.selectedShapeId = '';
        }

        this.updateTransformer();
      },
      updateTransformer() {
        const transformerNode = this.$refs.transformer.getStage();
        const stage = transformerNode.getStage();
        const { selectedShapeId } = this;

        const selectedNode = stage.findOne('#' + selectedShapeId);
        console.log(selectedNode.getClassName());
        // do nothing if selected node is already attached
        if (selectedNode === transformerNode.node()) {
          return;
        }

        if(selectedNode.getClassName() === 'Layer') {
          transformerNode.detach();
          stage.draw();
          return;
        }

        if (selectedNode) {
          // attach to another node
          transformerNode.moveToTop();
          transformerNode.attachTo(selectedNode);
        } else {
          // remove transformer
          transformerNode.detach();
        }
        transformerNode.getLayer().batchDraw();
      },
      parseDataFromServer(data) {
        let notes = data.notesArray;
        let images = data.imagesArray;
        let board = data.board;
        this.bname = board.bname;
        this.is_public = board.is_public;
        this.colorStage = board.background;

        this.stageLayer = this.$refs.layer.getNode();

        for (let i = 0; i < notes.length; i++) {
          this.createNote(notes[i]);
        }

        for (let j = 0; j < images.length; j++) {
          this.createImage(images[j]);
        }

      },
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
