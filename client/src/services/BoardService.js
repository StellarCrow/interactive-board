import Api from '../services/Api'

export default {
  getBoards (userId) {
    return Api().get(`/users/${userId}/getBoards`);
  },
  createBoard(userId) {
    return Api().post(`/users/${userId}/createBoard`);
  },
  deleteBoard(boardId) {
    return Api().post(`/boards/deleteBoard/${boardId}`);
  },
  saveBoard(data) {
    return Api().post(`/boards/saveBoard`, data);
  },
  getBoardData(boardId) {
    return Api().get(`/boards/${boardId}/getData`);
  },
  createNote(data) {
    return Api().post(`/boards/createNote`, data);
  },
  uploadImage(data, id) {
    return Api().post(`/boards/uploadImage/${id}`, data);
  },
  createImage(data) {
    return Api().post(`/boards/createImage`, data);
  },
  uploadAudio(data, id) {
    return Api().post(`/boards/uploadAudio/${id}`, data);
  },
  createAudio(data) {
    return Api().post(`/boards/createAudio`, data);
  },
  deleteNote(data) {
    return Api().post(`/boards/deleteNote`, data);
  },
  deleteImage(data) {
    return Api().post(`/boards/deleteImage`, data);
  },
  deleteAudio(data) {
    return Api().post(`/boards/deleteAudio`, data);
  },
  createManyNotes(bid) {
    return Api().post(`/boards/${bid}/createManyNotes`);
  },
  getPublicBoards() {
    return Api().get(`/boards/getPublic`);
  }
}
