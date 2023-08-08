import View from "./View.js";
import icons from '../../img/icons.svg';
import previewView from './previewView.js'

/* The BookmarksView class is a JavaScript class that extends the View class and is responsible for
rendering bookmarks in a list. */
class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = 'No bookmarks yet!';
  _message = '';

 /**
  * The addHandlerRender function adds an event listener to the window's load event, with the provided
  * handler function as the callback.
  * @param handler - The `handler` parameter is a function that will be executed when the `load` event
  * is triggered on the `window` object.
  */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }  
  
  /**
   * The `_generateMarkup()` function returns a string of HTML markup by mapping over an array of
   * bookmark data and rendering each bookmark using the `previewView.render()` function.
   * @returns a string that is generated by mapping over an array of bookmark data and rendering each
   * bookmark using the `previewView.render()` function. The `join('')` method is used to concatenate
   * all the rendered bookmarks into a single string.
   */
  _generateMarkup() {
      return this._data
          .map(bookmark => previewView.render(bookmark, false))
          .join('');
  }
}

export default new BookmarksView();



