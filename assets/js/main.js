let movieList = null;
let inputSearch = null;
let triggerMode = false;


const createElement = ({
    type,
    attrs,
    container = null,
    position = 'append',
    evt = null,
    handler = null
}) => {
    const el = document.createElement(type);

    for (let key in attrs) {
        if (key !== 'innerText') {
            el.setAttribute(key, attrs[key]);
        } else {
            el.innerHTML = attrs[key];
        }
    };

    if (container && position === 'append') container.append(el);
    if (container && position === 'prepend') container.prepend(el);
    if (evt && handler && typeof handler === 'function') el.addEventListener(evt, handler)

    return el;
};


const createStyle = () => {
    createElement({
        type: 'style',
        attrs: {
            innerText: `
      * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      padding: 20px;
      max-width: 1280px;
      margin: 0 auto;
    }
    .movies {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    .movie {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .movie__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .search {
      margin-bottom: 30px;
    }
    .search__label-input {
      display: block;
      margin-bottom: 7px;
    }
    .search__input {
      display: block;
      width: 400px;
      padding: 10px 15px;
      margin-bottom: 10px;
      border: 1px solid lightgrey;
      border-radius: 4px;
    }
    .search__label-checkbox {
      font-size: 12px;
      display: block;
      margin-top: -17px;
      margin-left: 25px;
    }
  `
        },
        container: document.head
    });
};


const createMarkup = () => {
    const container = createElement({
        type: 'div',
        attrs: { class: 'container' },
        container: document.body,
        position: 'prepend'
    });

    createElement({
        type: 'h1',
        attrs: {
            innerText: 'Приложение для поиска фильмов'
        },
        container
    });

    const searchBox = createElement({
        type: 'div',
        attrs: { class: 'search' },
        container
    });

    createElement({
        type: 'label',
        attrs: {
            class: 'search__label-input',
            for: 'search',
            innerText: 'Поиск фильмов'
        },
        container: searchBox
    });

    inputSearch = createElement({
        type: 'input',
        attrs: {
            class: 'search__input',
            id: 'search',
            type: 'text',
            placeholder: 'Начните вводить текст...'
        },
        container: searchBox
    });


    createElement({
        type: 'input',
        attrs: {
            class: 'search__checkbox',
            id: 'checkbox',
            type: 'checkbox'
        },
        container: searchBox
    });

    createElement({
        type: 'label',
        attrs: {
            class: 'search__label-checkbox',
            for: 'checkbox',
            innerText: 'Добавлять фильмы к существующему списку'
        },
        container: searchBox,
        evt: 'click',
        handler: () => triggerMode = !triggerMode
    });

    movieList = createElement({
        type: 'div',
        attrs: { class: 'movies' },
        container
    });
};


const addMovieToList = (movie) => {
    const item = createElement({
        type: 'div',
        attrs: { class: 'movie' },
        container: movieList
    });
    createElement({
        type: 'img',
        attrs: {
            class: 'movie__image',
            alt: movie.Title,
            title: movie.Title,
            src: /^(http|https):\/\//i.test(movie.Poster) ? movie.Poster : 'assets/img/unnamed.jpg'
        },
        container: item
    });
};


createMarkup();
createStyle();

const siteUrl = 'https://www.omdbapi.com/';

let searchLast = ' ';



const getData = (url) => fetch(url)
    .then((res) => res.json())
    .then((json) => {

        if (!json || !json.Search) throw Error('Сервер вернул неправильный объект')

        return json.Search
    });


const delay = (() => {
    let timer = 0;
    return (cb, ms) => {
        clearTimeout(timer);
        timer = setTimeout(cb, ms);
    };
})();


const clearMoviesMarkup = (el) => (el) && (el.innerHTML = '');


inputSearch.addEventListener('keyup', (e) => {

    delay(() => {
        const searchString = e.target.value.trim();

        if (searchString && searchString.length > 3 && searchString !== searchLast) {

            if (!triggerMode) clearMoviesMarkup(movieList);

            getData(`${siteUrl}?s=${searchString}&apikey=6385f87`)
                .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
                .catch((err) => console.log(err));
        }
        searchLast = searchString;

    }, 2000);

});

