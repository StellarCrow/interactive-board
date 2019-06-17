<template>
  <div class="board-section">
    <div class="container-fluid">
      <div class="row justify-content-center mb-3">
        <div class="col-3">
        </div>
        <div class="col-4 text-center">
          <div class="board-name">
            <input type="text" class="input-large" name="board-name" maxlength="25" :placeholder="bname"
                   v-model="bname" :disabled="this.$store.state.user._id !== this.$store.state.route.params.id">
          </div>
        </div>
        <div class="col-3">
          <ul class="d-flex justify-content-center pt-4 mb-0" v-if="this.$store.state.user._id === this.$store.state.route.params.id">
            <div v-for="color in colorsStage" :key="color.id">
              <input type="radio" name="stage" v-model="colorStage" :value="color.num"
                     v-bind:id="color.id">
              <label class="color-label" :for="color.id" :style="{background: color.num }"></label>
            </div>
          </ul>
        </div>
      </div>
      <div class="row p-0">
        <div class="col-2 p-0">
          <ul class="menu text-center" v-if="this.$store.state.user._id === this.$store.state.route.params.id">
            <li>
              <div class="menu__bg menu__bg-maincolor" v-on:click="noteModal = true">
                <div class="menu__item menu__item-note"></div>
              </div>
              <p>Добавить заметку</p>
            </li>
            <li>
              <div class="menu__bg menu__bg-secondarycolor" v-on:click="imageModal = true">
                <div class="menu__item menu__item-image"></div>
              </div>
              <p>Добавить фото</p>
            </li>
            <li>
              <div class="menu__bg menu__bg-tertiarycolor" v-on:click="audioModal = true">
                <div class="menu__item menu__item-audio"></div>
              </div>
              <p>Добавить аудио</p>
            </li>
          </ul>
        </div>
        <div class="col-8">
          <div class="konva-container" ref="container" v-bind:style="{height: '70vh', background: this.colorStage}">
            <v-stage :config="stageSize" ref="stage" @mousedown="handleStageMouseDown">
              <v-layer ref="layer" @dblclick="mouseDownOnAudio">
                <v-transformer ref="transformer" :config="transformer"></v-transformer>
              </v-layer>
            </v-stage>
          </div>
        </div>
        <div class="col-2">
          <ul class="menu text-center">
            <li>
              <div class="filter">
                <label for="select-filter">Отображать только: </label>
                <select class="select-board" name="filter" id="select-filter" v-model="filter">
                  <option value="all" selected="selected">Все объекты</option>
                  <option value="text">Текст</option>
                  <option value="images">Изображения</option>
                  <option value="audios">Аудио</option>
                </select>
              </div>
            </li>
            <li>
              <div class="menu__bg menu__bg-secondarycolor">
                <input type="checkbox" id="is-public" v-model="is_public" hidden>
                <label for="is-public" class="menu__item menu__item-public label-public"></label>
              </div>
              <p v-if="is_public">
                Публичная
              </p>
              <p v-else>Приватная</p>
            </li>
            <li>
              <button @click="saveBoard" class="button-add" v-if="this.$store.state.user._id === this.$store.state.route.params.id">Сохранить</button>
              <div> {{savedMessage}}</div>
              <div class="mt-5" v-if="this.$store.state.user._id !== this.$store.state.route.params.id">
                Автор:
                <div class="board-text mt-2" @click="toUserPage">{{author}}</div>
              </div>
              <!--<button @click="test">Test</button>-->
            </li>
          </ul>
        </div>
      </div>
    </div>
    <note-modal v-show="noteModal" @close="noteDataFromModal"></note-modal>
    <image-modal v-show="imageModal" @close="imageDataFromModal"></image-modal>
    <audio-modal v-show="audioModal" @close="audioDataFromModal"></audio-modal>
    <image-full v-show="imageFull" :link="imageFullFile" @close="imageFull = false"></image-full>
  </div>
</template>

<script>
  import NoteModal from './NoteModal'
  import ImageModal from './ImageModal'
  import AudioModal from './AudioModal'
  import ImageFull from './ImageFull'
  import BoardService from '../services/BoardService'

  const imagePink = require('../assets/icons/music-icon-pink.png')
  const imageGreen = require('../assets/icons/music-icon-green.png')
  const imageYellow = require('../assets/icons/music-icon-yellow.png')
  const notePinIcon = require('../assets/icons/note-pin-icon.png')
  const settings = require('../assets/icons/026-setting.png')

  let width = window.innerWidth
  let height = window.innerHeight

  export default {
    name: 'Board',
    components: {NoteModal, ImageModal, AudioModal, ImageFull},
    data () {
      return {
        bname: 'Без названия',
        colorStage: '#fcfcfc',
        colorsStage: [
          {id: '6', color: 'white', num: '#fcfcfc'},
          {id: '7', color: 'black', num: '#d0d0d0'},
          {id: '8', color: 'green', num: '#d4fff5'},
          {id: '9', color: 'pink', num: '#ffdbea'},
          {id: '10', color: 'orange', num: '#ffe6c8'},
          {id: '11', color: 'blue', num: '#d9f6ff'}
        ],
        author: '',
        is_public: false,
        audioModal: false,
        imageModal: false,
        imageFull: false,
        noteModal: false,
        imageFullFile: '',
        filter: 'all',
        savedMessage: '',
        notes: [],
        images: [],
        audios: [],
        stageLayer: null,
        stageSize: {
          width: width,
          height: height
        },
        transformer: {
          anchorSize: 10,
          anchorCornerRadius: 5,
          anchorStroke: '#F3BC7B',
          borderStroke: '#F3BC7B',
          borderDash: [3, 3]
        },
        selectedShapeId: '',
        selectedAudioId: '',
        audioFile: null
      }
    },
    created: function () {
      window.addEventListener('resize', this.changeRect)
      this.changeRect()
    },
    methods: {
      toUserPage () {
        this.$router.push({path: '/users/' + this.$store.state.route.params.id})
      },
      async saveBoard () {
        let notesUpdated = []
        let imagesUpdated = []
        let audiosUpdated = []
        const id = this.$store.state.route.params.idb

        this.notes.forEach(function (note) {
          let updatedNote = {}
          updatedNote.coordinates = [note.children[0].getAbsolutePosition().x, note.children[0].getAbsolutePosition().y]
          updatedNote.rotation = note.rotation()
          updatedNote.scale = [note.scaleX(), note.scaleY()]
          updatedNote.id = note.id()
          notesUpdated.push(updatedNote)
        })

        this.images.forEach(function (image) {
          let updatedImage = {}
          updatedImage.coordinates = [image.children[0].getAbsolutePosition().x, image.children[0].getAbsolutePosition().y]
          updatedImage.id = image.id()
          updatedImage.rotation = image.rotation()
          updatedImage.scale = [image.scaleX(), image.scaleY()]
          imagesUpdated.push(updatedImage)
        });

        this.audios.forEach(function (audio) {
          let updatedAudio = {
            coordinates: [audio.children[0].getAbsolutePosition().x, audio.children[0].getAbsolutePosition().y],
            id: audio.id(),
            rotation: audio.rotation(),
            scale: [audio.scaleX(), audio.scaleY()]
          }
          audiosUpdated.push(updatedAudio)
        });

        let data = {
          idb: id,
          is_public: this.is_public,
          name: this.bname,
          background: this.colorStage,
          notes: notesUpdated,
          images: imagesUpdated,
          audios: audiosUpdated
        }

        const response = await BoardService.saveBoard(data)
        console.log(response.data)
        this.savedMessage = 'Сохранено ' + this.getCurrentDate()
      },
      getCurrentDate () {
        let date = new Date()
        let yyyy = date.getFullYear()
        let mmm = date.getMonth() + 1
        let ddd = date.getDate()
        let hh = date.getHours()
        let mm = date.getMinutes()
        let ss = date.getSeconds()

        return `${ddd}/${mmm}/${yyyy} ${hh}:${mm}:${ss}`
      },
      changeRect () {
        const container = this.$refs.container
        if (!container) return

        const height = container.offsetHeight
        const width = container.offsetWidth

        this.stageSize.width = width
        this.stageSize.height = height
      },
      async noteDataFromModal (data) {
        this.noteModal = data.noteModal
        if (data.text === "") return

        const id = this.$store.state.route.params.idb
        const newNote = await BoardService.createNote({
          boardId: id,
          text: data.text,
          color: data.color,
          coordinates: [20, 20],
          rotation: 0,
          scale: [1, 1]
        })
        console.log(newNote.data)
        let noteData = {
          id: newNote.data.id,
          text: data.text,
          color: data.color,
          coordinates: [20, 20],
          rotation: 0,
          scale: [1, 1]
        }

        this.createNote(noteData)
      },
      async imageDataFromModal (data) {
        this.imageModal = data.imageModal
        if (data.imageFile == null) return

        const id = this.$store.state.route.params.idb
        let image = {}

        image.imageType = data.imageType
        image.color = data.color
        image.name = data.name
        image.coordinates = [40, 20]
        image.rotation = 0
        image.scale = [1, 1]

        let formData = new FormData()
        formData.append('photo', data.imageFile)

        await BoardService.uploadImage(formData, id)
          .then((response) => {
            if (response.data.imageId === -1) {
              return console.log('imageId -1 ' + response.data.imageId)
            }
            console.log('image ID ' + response.data.imageId)
            return BoardService.createImage({
              image: image,
              bid: id,
              imageId: response.data.imageId
            })
          })
          .then((response) => {
            console.log(response.data.imageLink)
            image.link = response.data.imageLink
            image.id = response.data.media
          })

        this.createImage(image)
      },
      async audioDataFromModal (data) {
        this.audioModal = data.audioModal
        if (data.audioFile === null) return

        const id = this.$store.state.route.params.idb
        let formData = new FormData()
        formData.append('audio', data.audioFile)

        let audio = {
          audioType: data.audioType,
          name: data.name,
          coordinates: [60, 20],
          rotation: 0,
          scale: [1, 1]
        }

        await BoardService.uploadAudio(formData, id)
          .then(response => {
            if (response.data.audioId === -1) return
            return BoardService.createAudio({
              audio: audio,
              bid: id,
              audioId: response.data.audioId
            })
          })
          .then((response) => {
            console.log(response.data.audioLink)
            audio.link = response.data.audioLink
            audio.id = response.data.media
          })

        this.createAudio(audio)
      },
      createAudio (data) {
        let layer = this.stageLayer
        const stage = this.$refs.stage.getNode()

        let group = new Konva.Group({
          x: data.coordinates[0],
          y: data.coordinates[1],
          draggable: true,
          name: 'audioGroup',
          id: data.id,
          rotation: data.rotation,
          scaleX: data.scale[0],
          scaleY: data.scale[1],
          dragBoundFunc: function (pos) {
            let newY, newX;
            if (pos.y < -50) {
              newY = -50
            } else if (pos.y > stage.height()) {
              newY = stage.height()
            } else
              newY = pos.y

            if (pos.x < -50) {
              newX = -50
            } else if (pos.x > stage.width()) {
              newX = stage.width()
            } else
              newX = pos.x

            return {
              x: newX,
              y: newY,
            }
          }
        });

        let imageObj = new Image()
        if (data.audioType === 'icon-green') {
          imageObj.src = imageGreen
        }
        else if (data.audioType === 'icon-pink') {
          imageObj.src = imagePink
        }
        else if (data.audioType === 'icon-yellow') {
          imageObj.src = imageYellow
        }

        let audioRect = new Konva.Rect({
          name: 'audioRect',
          width: 120,
          height: 120,
          strokeEnabled: false,
          stroke: '#f3bc7b',
          strokeWidth: 5
        });

        let audioImage = new Konva.Image({
          name: 'audioImage',
          image: imageObj,
          width: audioRect.width(),
          height: audioRect.height() - 10,
        });

        let audioName = new Konva.Text({
          y: 110,
          name: 'audioName',
          text: data.name,
          fontSize: 14,
          fontStyle: 200,
          fontFamily: 'Calibri',
          fill: '#000',
          width: audioImage.width()
        });

        let audioText = new Konva.Text({
          name: 'audioText',
          text: data.link,
          visible: false
        });

        group.add(audioRect);
        group.add(audioImage);
        group.add(audioName);
        group.add(audioText);
        layer.add(group);
        this.audios.push(group);
        stage.batchDraw();
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
          scaleY: data.scale[1],
          dragBoundFunc: function (pos) {
            let newY, newX;
            if (pos.y < -50) {
              newY = -50;
            } else if (pos.y > stage.height()) {
              newY = stage.height()
            } else
              newY = pos.y;

            if (pos.x < -50) {
              newX = -50;
            } else if (pos.x > stage.width()) {
              newX = stage.width()
            } else
              newX = pos.x;

            return {
              x: newX,
              y: newY,
            }
          }
        });

        let noteText = new Konva.Text({
          name: 'noteText',
          text: data.text,
          fontSize: 14,
          fontStyle: 200,
          fontFamily: 'Calibri',
          fill: '#000',
          width: 100,
          height: 100,
          padding: 15,
          align: 'center'
        });

        if (data.text.length > 25) {
          noteText.fontSize(12);
          noteText.width(140);
          noteText.height(140);
        }


        let rect = new Konva.Rect({
          name: 'noteRect',
          // stroke: "#e5e5e5",
          // strokeWidth: 1,
          fill: data.color,
          width: noteText.width(),
          height: noteText.height(),
          shadowColor: '#e5e5e5',
          shadowBlur: 5,
          shadowOpacity: 0.5
        });

        let imageObj = new Image();
        imageObj.src = notePinIcon;

        let notePin = new Konva.Image({
          x: rect.width() / 4,
          y: -10,
          name: 'audioImage',
          image: imageObj,
          width: rect.width() / 3,
          height: rect.height() / 3,
          centeredScaling: true,
          rotation: -20
        });

        rect.cache();
        group.add(rect);
        group.add(noteText);
        group.add(notePin);
        // group.cache();
        layer.add(group);
        this.notes.push(group);
        stage.batchDraw();
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
          scaleY: data.scale[1],
          dragBoundFunc: function (pos) {
            let newY, newX;
            if (pos.y < -50) {
              newY = -50;
            } else if (pos.y > stage.height() - 20) {
              newY = stage.height() - 20
            } else
              newY = pos.y;

            if (pos.x < -50) {
              newX = -50;
            } else if (pos.x > stage.width() - 20) {
              newX = stage.width() - 20
            } else
              newX = pos.x;

            return {
              x: newX,
              y: newY,
            }
          }
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
        stage.batchDraw();
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
          if (group.id() === targetId) {
            selectedGroup = group;
          }
        });

        if (selectedGroup) {
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
        const {selectedShapeId} = this;

        const selectedNode = stage.findOne('#' + selectedShapeId);
        console.log(selectedNode.getClassName());
        // do nothing if selected node is already attached
        if (selectedNode === transformerNode.node()) {
          return;
        }

        if (selectedNode.getClassName() === 'Layer') {
          transformerNode.detach();
          stage.batchDraw();
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
      mouseDownOnAudio(e) {
        let target = e.target.getParent();
        if (target.name() !== 'audioGroup')
          return;

        let link = target.findOne('.audioText').text();
        let rect = target.findOne('.audioRect');
        let layer = this.stageLayer;


        console.log(target.id());

        if (this.audioFile === null) {
          rect.strokeEnabled(true);
          this.selectedAudioId = target.id();
          this.audioFile = new Audio(link);
          this.audioFile.play();
        }
        else if (this.selectedAudioId === target.id()) {
          if (!this.audioFile.paused) {
            this.audioFile.pause();
            rect.strokeEnabled(false);
            layer.batchDraw();
          }
          else {
            this.audioFile.play();
            rect.strokeEnabled(true);
            layer.batchDraw();
          }
        }
        else if (this.selectedAudioId !== target.id()) {
          this.audioFile.pause();
          let selectedGroupImage = layer.findOne('#' + this.selectedAudioId).findOne('.audioRect');
          selectedGroupImage.strokeEnabled(false);

          this.audioFile = new Audio(link);
          this.audioFile.play();
          this.selectedAudioId = target.id();
          rect.strokeEnabled(true);
          layer.batchDraw();
        }
      },
      parseDataFromServer(data) {
        let notes = data.notesArray;
        let images = data.imagesArray;
        let audios = data.audiosArray;
        let board = data.board;
        this.bname = board.bname || 'Без названия';
        this.is_public = board.is_public;
        this.colorStage = board.background || '#fcfcfc';
        this.author = board.author;


        this.stageLayer = this.$refs.layer.getNode();

        for (let i = 0; i < notes.length; i++) {
          this.createNote(notes[i]);
        }

        for (let j = 0; j < images.length; j++) {
          this.createImage(images[j]);
        }

        for (let i = 0; i < audios.length; i++) {
          this.createAudio(audios[i]);
        }
      },
      addMenuButton() {
        const transformerNode = this.$refs.transformer.getStage();
        let imageObj = new Image();
        imageObj.src = settings;

        const menuButton = new Konva.Image({
          name: 'deleteButton',
          width: 30,
          height: 30,
          image: imageObj
        });

        menuButton.x(-menuButton.width() / 2);
        menuButton.y(-menuButton.width() / 2);
        transformerNode.add(menuButton);
        menuButton.addEventListener('click', this.showMenuList);
      },
      showMenuList() {
        const transformerNode = this.$refs.transformer.getStage();
        let list = transformerNode.find('.menuGroup')[0];
        list.visible() ? list.visible(false) : list.visible(true);
        this.stageLayer.batchDraw();
      },
      createMenuList() {
        let menuItems;
        const stage = this.$refs.stage.getNode();
        const transformerNode = this.$refs.transformer.getStage();
        let group = new Konva.Group({
          name: 'menuGroup',
          visible: false
        });

        if(this.$store.state.user._id !== this.$store.state.route.params.id) {
           menuItems = ["Открыть изображение"];
        }
        else {
           menuItems = ["Удалить", "Скачать", "Наверх", "Вниз", "Изображение"];
        }

        for (let i = 0; i < menuItems.length; i++) {
          let text = new Konva.Text({
            name: menuItems[i],
            text: menuItems[i],
            fontSize: 12,
            fontStyle: 200,
            fontFamily: 'Calibri',
            fill: '#000',
            width: 150,
            align: 'center',
            padding: 5
          });
          text.y(text.height() * i);
          text.x(-text.width());

          let rect = new Konva.Rect({
            name: 'menuRect',
            x: text.x(),
            y: text.y(),
            fill: '#fff',
            strokeWidth: 0.5,
            stroke: '#72787a',
            width: text.width(),
            height: text.height()
          });

          text.addEventListener('mouseenter', function () {
            rect.fill('#d8f9ff');
            stage.container().style.cursor = 'pointer';
            stage.batchDraw();
          });

          text.addEventListener('mouseleave', function () {
            rect.fill('#fff');
            stage.container().style.cursor = 'default';
            stage.batchDraw();
          });

          if (menuItems[i] === 'Наверх') {
            text.addEventListener('mousedown', this.moveGroupToTop);
          }
          else if (menuItems[i] === 'Удалить') {
            text.addEventListener('mousedown', this.deleteButtonEvent);
          }
          else if (menuItems[i] === 'Вниз') {
            text.addEventListener('mousedown', this.moveGroupToBottom);
          }
          else if (menuItems[i] === 'Изображение') {
            text.addEventListener('mousedown', this.openFullImage);
          }
          else if(menuItems[i] === 'Скачать') {
            text.addEventListener('mousedown', this.downloadMedia)
          }
          group.add(rect);
          group.add(text);
        }

        transformerNode.add(group);
      },
      async deleteButtonEvent() {
        let selectedGroup;
        const id = this.$store.state.route.params.idb;
        const transformerNode = this.$refs.transformer.getStage();
        let group = transformerNode.find('.Удалить')[0].getParent().getParent().getNode();
        let groupId = group.id();

        if (group.name() === 'noteGroup') {
          selectedGroup = this.notes.filter(obj => {
            return obj.id() === groupId;
          });
          this.notes = this.notes.filter(obj => {
            return obj.id() !== groupId;
          });
          await BoardService.deleteNote({noteId: selectedGroup[0].id(), bid: id});
        }
        else if (group.name() === 'imageGroup') {
          selectedGroup = this.images.filter(obj => {
            return obj.id() === groupId;
          });
          this.images = this.images.filter(obj => {
            return obj.id() !== groupId;
          });
          await BoardService.deleteImage({imageId: selectedGroup[0].id(), bid: id});
        }
        else if (group.name() === 'audioGroup') {
          selectedGroup = this.audios.filter(obj => {
            return obj.id() === groupId;
          });
          this.audios = this.audios.filter(obj => {
            return obj.id() !== groupId;
          });
          await BoardService.deleteAudio({audioId: selectedGroup[0].id(), bid: id});
        }
        selectedGroup[0].destroy();
        transformerNode.detach();
        this.stageLayer.draw();
      },
      moveGroupToTop() {
        const transformerNode = this.$refs.transformer.getStage();
        let group = transformerNode.findOne('.Наверх').getParent().getParent().getNode();
        group.moveToTop();
      },
      moveGroupToBottom() {
        const transformerNode = this.$refs.transformer.getStage();
        let group = transformerNode.findOne('.Вниз').getParent().getParent().getNode();
        group.moveToBottom();
      },
      openFullImage() {
        const transformerNode = this.$refs.transformer.getStage();
        let group = transformerNode.findOne('.Изображение').getParent().getParent().getNode();
        if (group.name() !== 'imageGroup')
          return;
        let image = group.find('.image')[0];
        this.imageFullFile = image.image().src;
        this.imageFull = true;
      },
      downloadMedia() {
        const transformerNode = this.$refs.transformer.getStage();
        let group = transformerNode.find('.Скачать')[0].getParent().getParent().getNode();

        if(group.name() === 'noteGroup') {
          let dataURL = group.toDataURL();
          this.downloadURI(dataURL, 'note.png');
        }
        if(group.name() === 'imageGroup') {
          let imageInGroup = group.find('.image')[0];
          let src = imageInGroup.image().src;
          this.downloadURI(src, 'image.png');
        }
        if(group.name() === 'audioGroup') {
          let link = group.findOne('.audioText').text();
          this.downloadURI(link, 'audio.mp3');
        }

      },
      downloadURI(dataURL, name) {
        let link = document.createElement('a');
        link.download = name;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    async mounted() {
      this.changeRect();
      const id = this.$store.state.route.params.idb;
      const boardData = await BoardService.getBoardData(id);
      if (boardData.data.board == null) return;
      // console.log(boardData);
      this.parseDataFromServer(boardData.data);
      this.createMenuList();
      this.addMenuButton();
    },
    watch: {
      filter: function () {
        const layer = this.stageLayer;

        if (this.filter === 'text') {
          this.notes.forEach(note => {
            note.show();
          });
          this.images.forEach(image => {
            image.hide();
          });
          this.audios.forEach(audio => {
            audio.hide();
          });
        }
        else if (this.filter === 'images') {
          this.images.forEach(image => {
            image.show();
          });
          this.notes.forEach(note => {
            note.hide();
          });
          this.audios.forEach(audio => {
            audio.hide();
          });
        }
        else if (this.filter === 'audios') {
          this.audios.forEach(audio => {
            audio.show();
          });
          this.notes.forEach(note => {
            note.hide();
          });
          this.images.forEach(image => {
            image.hide();
          });
        }
        else {
          this.images.forEach(image => {
            image.show();
          });
          this.audios.forEach(audio => {
            audio.show();
          });
          this.notes.forEach(note => {
            note.show();
          });
        }

        layer.batchDraw();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/components/board";


</style>
