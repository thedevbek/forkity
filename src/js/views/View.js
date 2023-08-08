import icons from '../../img/icons.svg';

/* The View class is responsible for rendering data to the DOM and handling error and message displays. */
export default class View {
    _data;

  /** 
   * ! Jonas Wrote
   * Render the received object to the DOM 
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe) 
   * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Bek Johansson
   * @todo Finish implementation
   */
  
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // updates changed TEXT
 /**
  * The `update` function updates the DOM elements based on the new data provided, by comparing and
  * updating text content and attributes of the elements.
  * @param data - The `data` parameter is the new data that will be used to update the markup. It is an
  * object that contains the updated values for the elements in the markup.
  */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
   
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      
      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
    });  
  }

   /**
    * The _clear() function clears the inner HTML content of the parent element.
    */
    _clear() {
    this._parentElement.innerHTML = '';
  }

 /**
  * The `renderSpinner` function inserts a spinner element into the parent element to indicate that a
  * process is loading.
  */
  renderSpinner() {
    const markup = `
    <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
    </div> 
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * The `renderError` function renders an error message with an icon and a given error message.
   * @param [message] - The `message` parameter is a string that represents the error message to be
   * displayed. It is an optional parameter with a default value of `this._errorMessage`, which is a
   * property of the current object. If no `message` argument is provided when calling the
   * `renderError` method, the default
   */
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

/**
 * The `renderMessage` function generates HTML markup for displaying a message with a smiley icon and
 * inserts it into the parent element.
 * @param [message] - The `message` parameter is a string that represents the content of the message to
 * be rendered.
 */
renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}



