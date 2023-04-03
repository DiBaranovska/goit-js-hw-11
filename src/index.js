import './css/styles.css';
import axios from 'axios';

export class GetImagesAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34925796-aa77653a24e3240cce9cedfc1';

  query = null;
  page = 1;
  per_page = 40;
  totalHits = null;

  getImages() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        page: this.page,
        per_page: this.per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        totalHits: this.totalHits,
      },
    });
  }
}
