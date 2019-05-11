import Api from '../services/Api'

export default {
  getBoards (userId) {
    return Api().get(`/users/${userId}`);
  }
}
