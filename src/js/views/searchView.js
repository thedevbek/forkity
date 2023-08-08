/* The SearchView class is responsible for handling user input and events related to searching. */
class SearchView {
  _parentEl = document.querySelector('.search');

 /**
  * The function `getQuery()` retrieves the value of a search field, clears the input, and returns the
  * query.
  * @returns The value of the input field with the class "search__field".
  */
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
      return query;
  }
   
 /**
  * The _clearInput function clears the value of the search field.
  */
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  /**
   * The addHandlerSearch function adds an event listener to the parent element that listens for a form
   * submission and prevents the default form submission behavior, then calls the provided handler
   * function.
   * @param handler - The `handler` parameter is a function that will be called when the form is
   * submitted.
   */
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();


 

