import Api from '../services/Api'

export default {
  getBoards (credentials) {
    return Api().get('/user/boards', {
      params: {
        uid: credentials.uid
      }
    });
  }
}
