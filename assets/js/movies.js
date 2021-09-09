import {
  addMovieToList,
  clearMoviesMarkup,
  createMarkup,
  createStyle,
  inputSearch,
  movieList,
  triggerMode
} from './dom.js'


let siteUrl = null;
let searchLast = ' ';

const debounce = (() => {
  let timer = null;
  return (cb, ms) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(cb, ms);
  };
})();

const getData = (url) => fetch(url)
  .then((res) => res.json())
  .then((json) => {

    if (!json || !json.Search) throw Error('Сервер вернул неправильный объект')

    return json.Search
  });

const inputSearchHandler = (e) => {

  debounce(() => {
    const searchString = e.target.value.trim();

    if (searchString && searchString.length > 3 && searchString !== searchLast) {

      if (!triggerMode) clearMoviesMarkup(movieList);

      getData(`${siteUrl}?s=${searchString}&apikey=6385f87`)
        .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
        .catch((err) => console.log(err));
    }
    searchLast = searchString;

  }, 2000);

}

export const appInit = (url) => {
  createMarkup();
  createStyle();

  siteUrl = url
  inputSearch.addEventListener('keyup', inputSearchHandler);
}