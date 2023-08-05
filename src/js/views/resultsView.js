
import View from "./View.js";
import icons from '../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = 'No recipes found for your query! Try again!';
  _message = '';

  _generateMarkup() {
  
    return this._data.map(this._generateMarkupPreview.bind(this)).join('');
  }

  _generateMarkupPreview(result) {
    return `
      <li class="preview">
        <a class="preview__link" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" class="recip_img" crossorigin/>
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}.</h4>
            <p class="preview__publisher">${result.publisher}</p>
          </div>
        </a>
      </li>
    `;
  }
}

export default new ResultsView();


