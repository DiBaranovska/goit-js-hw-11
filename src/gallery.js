import './css/styles.css';
import Notiflix from 'notiflix';
import { GetImagesAPI } from './index';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import trottle from 'lodash.throttle';

const formEl = document.querySelector('form');
const listEl = document.querySelector('.gallery');
const getImagesApi = new GetImagesAPI();

let lightbox = new SimpleLightbox('.gallery a', {
  sourceAttr: 'href',
  close: true,
});

const galleryListMarkup = data => {
  return data
    .map(
      element => `
      <a class="photo-card-link" href="${element.largeImageURL}">
            <div class="photo-card">
        <img class="gallery__image" src="${element.webformatURL}" alt="${element.tags}" loading="lazy"/>
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
    </div></a>`
    )
    .join(' ');
};

const onFormSubmit = async event => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['searchQuery'].value;
  getImagesApi.query = searchQuery;

  try {
    const { data } = await getImagesApi.getImages();
    const queryResult = data.hits;
    if (!data.totalHits) {
      listEl.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      listEl.innerHTML = '';
      return;
    } else if (listEl.textContent !== '') {
      page = 1;
      listEl.innerHTML = galleryListMarkup(queryResult);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    } else if (getImagesApi.per_page >= data.totalHits) {
      listEl.innerHTML = galleryListMarkup(queryResult);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    } else {
      listEl.innerHTML = galleryListMarkup(queryResult);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    await lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
};

const onLoadMoreBtnClick = async () => {
  getImagesApi.page += 1;

  try {
    const { data } = await getImagesApi.getImages();
    const queryResult = data.hits;

    if (getImagesApi.page * getImagesApi.per_page >= data.totalHits) {
      listEl.insertAdjacentHTML('beforeend', galleryListMarkup(queryResult));
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    listEl.insertAdjacentHTML('beforeend', galleryListMarkup(queryResult));
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    await lightbox.refresh();
  } catch (err) {
    console.log(err);
  };
}

formEl.addEventListener('submit', onFormSubmit);

window.addEventListener(
  'scroll',
  trottle(() => {
    const documentPosition = document.documentElement.getBoundingClientRect();
    const { height: cardHeight } =
      listEl.firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    if (documentPosition.bottom < document.documentElement.clientHeight + 150) {
      onLoadMoreBtnClick();
    }
  }, 400)
);
