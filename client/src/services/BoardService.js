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
  getBoardData(boardId) {
    return Api().get(`/boards/${boardId}/getData`);
  },
  createNote(data) {
    return Api().post(`/boards/createNote`, data);
  }
}
