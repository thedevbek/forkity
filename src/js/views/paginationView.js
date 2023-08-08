import View from "./View.js";
import icons from '../../img/icons.svg';

/* The PaginationView class is a JavaScript class that generates the markup for a pagination component
and handles click events on the pagination buttons. */
class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

  /**
   * The addHandlerClick function adds a click event listener to the parent element and calls the
   * provided handler function with the data-goto value of the clicked button.
   * @param handler - The `handler` parameter is a function that will be called when the click event is
   * triggered. It takes one argument, `gotToPage`, which represents the page number that the user
   * wants to navigate to.
   * @returns Nothing is being returned in this code snippet.
   */
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline')
            if (!btn) return;
            const gotToPage = +btn.dataset.goto;

            handler(gotToPage);
        })
    }

  /* The `_generateMarkup()` function is a private method of the `PaginationView` class. It is
  responsible for generating the HTML markup for the pagination component based on the current page
  and the number of pages. */
    _generateMarkup() {
        const curPage = this._data.page;
        // page 1, and other pages
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        // console.log(numPages);
      
        if (curPage === 1 && numPages > 1) {
            return `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }
        // last page
        if (curPage === numPages && numPages > 1) {
            return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>${curPage - 1}</span>
            </button>
            `
        }
        // other page
        if (curPage < numPages) {
             return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>${curPage - 1}</span>
            </button>
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `
        }
        // page 1, NO pages
        return '';
    };
}

export default new PaginationView();