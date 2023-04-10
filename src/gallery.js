import './css/styles.css';
import Notiflix from 'notiflix';
import { GetImagesAPI } from './index';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('form');
const listEl = document.querySelector('.gallery');
const loadEl = document.querySelector('.setinal');
const getImagesApi = new GetImagesAPI();
let searchQuery = '';

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
  searchQuery = event.currentTarget.elements['searchQuery'].value.trim();
  getImagesApi.query = searchQuery;
  window.scrollTo(0, 0);
  getImagesApi.page = 1;
  getImagesApi.per_page = 40;
  if (searchQuery !== '') {
    try {
      const { data } = await getImagesApi.getImages();
      const queryResult = data.hits;
      if (!data.totalHits) {
        observer.disconnect(loadEl);
        listEl.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        listEl.innerHTML = '';
        return;
      } else if (getImagesApi.page * getImagesApi.per_page >= data.totalHits) {
        listEl.innerHTML = galleryListMarkup(queryResult);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        observer.disconnect(loadEl);
      } else {
        observer.observe(loadEl);
        listEl.innerHTML = galleryListMarkup(queryResult);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
      await lightbox.refresh();
    } catch (err) {
      console.log(err);
    }
    return;
  }
  listEl.innerHTML = '';
};

formEl.addEventListener('submit', onFormSubmit);

const onLoad = async event => {
  getImagesApi.page += 1;
  try {
    const { data } = await getImagesApi.getImages();
    const queryResult = data.hits;
    if (getImagesApi.page * getImagesApi.per_page >= data.totalHits) {
      listEl.insertAdjacentHTML('beforeend', galleryListMarkup(queryResult));
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      observer.disconnect(loadEl);
      return;
    } else {
      listEl.insertAdjacentHTML('beforeend', galleryListMarkup(queryResult));
    }
    await lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
  return;
};

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && searchQuery !== '') {
      onLoad();
    }
  });
};

const options = {
  rootMargin: '100px',
};

const observer = new IntersectionObserver(onEntry, options);

observer.observe(loadEl);
