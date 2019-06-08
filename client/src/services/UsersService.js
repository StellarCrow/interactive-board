import Api from '../services/Api'

export default {
  getUser (userId) {
    return Api().get(`/users/${userId}`);
  },
  updateUser (data) {
    return Api().post(`/users/update`, data);
  },
  getAllUsers () {
    return Api().get('/users/getAll');
  }
}
