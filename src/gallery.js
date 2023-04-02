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
        <img class="gallery__image" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${element.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${element.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${element.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${element.downloads}
        </p>
      </div>
    </div>`
    )
    .join(' ');
};

var lightbox = new SimpleLightbox('.gallery a', {
  sourceAttr: 'href',
  captionDelay: 250,
});

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
    var gallery = $('.gallery a').simpleLightbox();
  } catch (err) {
    console.log(err);
  }
};

formEl.addEventListener('submit', onFormSubmit);
