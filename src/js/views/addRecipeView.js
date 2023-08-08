import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

/* The AddRecipeView class is a JavaScript class that represents a view for adding and uploading
recipes, with methods for showing and hiding the add recipe window, and handling form submission for
uploading a recipe. */
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  /**
   * The constructor function adds event handlers for showing and hiding a window.
   */
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

 /**
  * The toggleWindow function toggles the visibility of an overlay and a window element.
  */
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

 /**
  * The function adds an event listener to a button element that toggles the visibility of a window.
  */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

 /**
  * The function adds event listeners to the close button and overlay element to toggle the visibility
  * of a window.
  */
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

/* The `addHandlerUpload` method is adding an event listener to the `_parentElement` (which is a form
element) for the `submit` event. When the form is submitted, it prevents the default form submission
behavior using `e.preventDefault()`. It then creates an array of key-value pairs from the form data
using `new FormData(this)` and converts it into an object using `Object.fromEntries(dataArr)`.
Finally, it calls the `handler` function with the `data` object as an argument. */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();