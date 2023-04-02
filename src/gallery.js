import './css/styles.css';
import Notiflix from 'notiflix';
import { GetImagesAPI } from './index';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('form');
const listEl = document.querySelector('.gallery');
const getImagesApi = new GetImagesAPI();

const galleryListMarkup = data => {
  return data
    .map(
      element => `
      <div class="photo-card">
       <a class="photo-card-link" href="${element.largeImageURL}">
        <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
        </p>
        <p class="info-item">
          <b>Views</b>
        </p>
        <p class="info-item">
          <b>Comments</b>
        </p>
        <p class="info-item">
          <b>Downloads</b>
        </p>
      </div>
</div>`
    )
    .join(' ');
};

const onFormSubmit = async event => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['searchQuery'].value;
  getImagesApi.query = searchQuery;

  try {
    const { data } = await getImagesApi.getImages();

    if (!data.totalHits) {
      listEl.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      listEl.innerHTML = '';
      return;
    }

    const queryResult = data.hits;
    listEl.innerHTML = galleryListMarkup(queryResult);
  } catch (err) {
    console.log(err);
  }
};

formEl.addEventListener('submit', onFormSubmit);
