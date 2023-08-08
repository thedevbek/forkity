import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

/**
 * The `controlRecipes` function is responsible for controlling the flow of actions when a recipe is
 * selected, including updating the results view, bookmarks view, loading the recipe, and rendering the
 * recipe.
 * @returns If there is no `id`, the function will return nothing (`undefined`).
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

/**
 * The function `controlSearchResults` is responsible for handling the search functionality, including
 * loading search results, rendering them, and rendering pagination buttons.
 * @returns If the query is empty, nothing is returned. Otherwise, the search results page is rendered.
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

/**
 * The controlPagination function renders new search results and pagination buttons based on the
 * specified page number.
 * @param goToPage - The `goToPage` parameter is the page number that the user wants to navigate to in
 * the pagination. It is used to retrieve the search results for that specific page and render them on
 * the page.
 */
const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

/**
 * The controlServings function updates the recipe servings in the state and then updates the recipe
 * view.
 * @param newServings - The new number of servings for the recipe.
 */
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

/**
 * The controlAddBookmark function adds or removes a bookmark for a recipe, updates the recipe view,
 * and renders the bookmarks.
 */
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/**
 * The controlBookmarks function renders the bookmarks in the model state.
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * The `controlAddRecipe` function handles the process of adding a new recipe, including uploading the
 * recipe data, rendering the recipe view, displaying success messages, updating the URL, and closing
 * the form window.
 * @param newRecipe - The `newRecipe` parameter is an object that represents the new recipe data that
 * will be added. It contains properties such as the recipe title, ingredients, cooking time, servings,
 * and instructions.
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();
    // reload after success message
    location.reload();
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

/**
 * The `init` function initializes the application by adding event handlers to various views and
 * calling their respective control functions.
 */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();


