import Api from '../services/Api'

export default {
  getBoards (userId) {
    return Api().get(`/users/${userId}`);
  },
  createBoard(userId) {
    return Api().post(`/users/${userId}/createBoard`);
  },
  deleteBoard(boardId) {
    return Api().post(`/deleteBoard/${boardId}`);
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
  }
}
