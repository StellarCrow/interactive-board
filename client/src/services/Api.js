import axios from 'axios'
const url = 'https://interactive-board.herokuapp.com/';

export default () => {
  return axios.create({
    baseURL: url
  })
}
